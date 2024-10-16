const {instance} =require("../config/razorpay");
const Course=require("../models/Course");
const User=require("../models/User");
const mailSender=require("../utils/mailSender");
const {courseEnrollmentEmail}=require("../mail/templates/courseEnrollmentEmail");
const {default:mongoose} = require("mongoose");

// Capture the payment and initiate the Razorpay order 
exports.capturePayment = async (req,res)=>{
    try{
        // get courseId and userId
        const {courseId} =req.body;
        const {userId}=req.user.id;

        // validation 
        // valid courseId 
        if(!courseId){
            return res.json({
                success:false,
                message:"Please enter a course Id ",
            })
        }
        // valid courseDetail
        let course;
        try{
            course = await Course.findById(courseId);
            if(!course){
                return res.json({
                    success:false,
                    message:"could not find the course",
                })
            }

        // user already pay for the same course 
        // it is done by getting user id not in string form but in object id form 
        const uid = new mongoose.Types.ObjectId(userId);
        if(course.studentsEnrolled.includes(uid)){
            return res.status(200).json({
                success:false,
                message:"Student is already enrolled ",
            })
        }
        }
        catch(error){
            console.log(error);
            console.error(error);
            return res.status(500).json({
                success:false,
                message:"could not generate the course details ,please try later "
            })
        }


        //main kaam - order create 
        const amount = course.price;
        const currency="INR";
        const options={
            amount:amount*100,
            currency,
            receipt:Math.random(Date.now()).toString(),
            notes:{ 
            //used in signature verification kyuki waha pe hme userId etc req ki body se nhi milne wala hai 
                courseId:courseId,
                userId,
            }
        };

        try{
            // initiate the payment using razorpay
            const paymentResponse = await instance.orders.create(options);
            console.log("Payment response is: ",paymentResponse);
            // return response 
            return res.status(200).json({
                success:true,
                courseName:course.courseName,
                courseDescription:course.courseDescription,
                thumbnail:course.thumbnail,
                orderId:paymentResponse.id,
                currency:paymentResponse.currency,
                amount:paymentResponse.amount,
            });

        }catch(error){
            console.error(error);
            return res.json({
                success:false,
                message:"Couldn't inititate resposne "
            })
        }
        // return response 
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"Error in capturing the payment and initiating the Razorpay order ",
        });
    }
}

// verify Signature of Razorpay and Server 

exports.verifySignature = async (req,res)=>{
    try{
        // assuming server ka secret ye rha 
        // dusra secret razorpay se aayega after webhook is created in it 
        const webhookSecret="123456789";

        const signature = req.headers["x-razorpay-signature"];
        // Hmac- Hashed Based method authenication code -> naam hi kaafi hai 
        // Sha - secure hashing algorithm

        const shasum = crypto.createHmac("sha256",webhookSecret);
        shasum.update(JSON.stringify(req.body));
        const digest= shasum.digest("hex");

        if(signature===digest){
            console.log("Payment is authorised ");
        

        const {courseId,userId}=req.body.payload.payment.entity.notes;

        try{
            // fulfill the action 

            // find the course and enroll the student in it 
            const enrolledCourse= await Course.findOneAndUpdate(
                {_id:CourseId},
                {$push:{studentsEnrolled:userId}},
                {new:true},
            );
            // Validating the response of above query 
            if(!enrolledCourse){
                return res.status(500).json({
                    success:false,
                    message:"Course not found ",
                })
            }
            console.log(enrolledCourse);

            // find the student and add the course to their list enrolled courses mai 
            const enrolledStudent = await User.findOneAndUpdate(
                                            {_id:userId},
                                            {$push:{courses:courseId}},
                                            {new:true},
            );
            
            console.log(enrolledStudent);

            // mail send krdo confirmation wala 
            const emailResponse =await mailSender(
                enrolledStudent.email,
                "Congratulations from Aman Pandey ",
                "Congo ,you are enrolled into new studysync code ",
                
            );
            console.log(emailResponse);
            return res.status(200).json({
                success:true,
                message:"Student enrolled successfully "
            })

        }catch(error){
            return res.status(400).json({
                success:false,
                message:"student enrollment failed ",
            })
        }

    }
        // if signature != digest 
        else{
            return res.status(400).json({
                success:false,
                message:"Invalid signature , mismatch occurred ",
            })
        }
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Error in verifying the signature "
        })
    }
}
