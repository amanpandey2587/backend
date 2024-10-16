// import express from "express"
// import {google} from "googleapis"

const express=require("express")
const app=express();
const cors=require('cors')
// const Connection=require("./models/Connection")
const userRoutes=require("./routes/User")
const profileRoutes=require("./routes/Profile")
const paymentRoutes=require("./routes/Payments")
const courseRoutes=require("./routes/Course")

const database=require("./config/database")
const cookieParser=require("cookie-parser")
const {cloudinaryConnect} =require("./config/cloudinary")
const fileUpload=require("express-fileupload")
const dotenv=require("dotenv");

dotenv.config();
const PORT = process.env.PORT || 4000;

// database connection 
database.connect();
app.use(cors({
    origin: 'http://localhost:3000', // Allow only your frontend application
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific HTTP methods
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
// middlewares 
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin:"http://localhost:3000",
        credentials:true,
    })
)
app.options('*', cors());
app.use(
    fileUpload({
        useTempFiles:true,
        tempFileDir:"/tmp",
    })
)

// cloudinary connection 
cloudinaryConnect()

// routes 
app.use("/api/v1/auth",userRoutes)
// app.use("/api/v1/profile",profileRoutes)
// app.use("/api/v1/payment",paymentRoutes)
app.use("/api/v1/course",courseRoutes)

// default route 
app.get("/",(req,res) =>{
    return res.json({
        success:true,
        message:"Your server is up and running ...",
    })
})
app.listen(3001,()=>{
    console.log("Working")
})
app.get("/",()=>{
    res.send("successfull")
})
app.post("/meet",async (req,res)=>{
        try{
            const result=await db.query("select meet from conn where mentor_id=$1 and mentee_id=$2",[req.user.mid,req.body.mid]);
            const data=result.rows[0];
            if(data.meet=="" || data.meet==null){
              res.render("meet.ejs",{mid:req.body.mid});
             }
            else{
              res.redirect(data.meet);
            }
          }
        catch(err){
          console.log(err.message);
          res.redirect("/home");
        }
})
// const CLIENT_ID = process.env.CLIENT_ID;
// const CLIENT_SECRET = process.env.CLIENT_SECRET;
// const REDIRECT_URL = process.env.REDIRECT_URL;
// const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);
// const SCOPES = ['https://www.googleapis.com/auth/calendar'];

// const url = oauth2Client.generateAuthUrl({
//   access_type: 'offline',
//   scope: SCOPES,
// });

// // Assuming you have a Mongoose model defined for your connections
// const Connection = require('../models/Connection');

// app.post('/authorize', async (req, res) => {
//   try {
//     // Update the connection document in MongoDB
//     await Connection.updateOne(
//       {
//         mentor_id: req.body.mid1,
//         mentee_id: req.body.mid2,
//       },
//       {
//         meet: "flag",
//         meetdate: req.body.date || null,
//         meettime: req.body.time || null,
//         duration: req.body.duration || null,
//       }
//     );

//     // Redirect to the OAuth URL for authentication
//     res.send(url);
//   } catch (err) {
//     console.log(err.message);
//     res.send("error");
//   }
// });

// app.get('/oauth2callback', async (req, res) => {
//   try {
//     const code = req.query.code;
//     const { tokens } = await oauth2Client.getToken(code);
//     oauth2Client.setCredentials(tokens);

//     // Create the meeting link using your function
//     const link = await createMeetLink(req.body.date, req.body.time, req.body.duration);

//     // Update the meeting link in MongoDB
//     await Connection.updateOne(
//       {
//         mentor_id: req.user.mid,
//         meet: 'flag', // Ensure you are updating the correct entry
//       },
//       {
//         meet: link,
//       }
//     );

//     // Send the meeting link to the frontend (if using a response here)
//     res.status(200).json({
//       success: true,
//       message: "Meeting link created successfully",
//       meetLink: link, // Send the meeting link in the response
//     });
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({
//       success: false,
//       message: "Error creating meeting link",
//     });
//   }
// });

// async function createMeetLink(meetDate, meetTime, duration) {
//   const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
  
//   // Construct start and end date-time strings
//   const startDateTime = new Date(`${meetDate}T${meetTime}:00`); // Assume meetTime is in 'HH:mm' format
//   const endDateTime = new Date(startDateTime.getTime() + duration * 60 * 1000); // duration in minutes

//   const event = {
//     summary: 'Sample Meeting',
//     description: 'A chance to hear more about Google Meet API',
//     start: {
//       dateTime: startDateTime.toISOString(),
//       timeZone: 'America/Los_Angeles', // Adjust based on your requirements
//     },
//     end: {
//       dateTime: endDateTime.toISOString(),
//       timeZone: 'America/Los_Angeles',
//     },
//     conferenceData: {
//       createRequest: {
//         requestId: `request-id-${Date.now()}`, // Unique request ID
//         conferenceSolutionKey: {
//           type: 'hangoutsMeet',
//         },
//       },
//     },
//     reminders: {
//       useDefault: true,
//     },
//   };

//   try {
//     const response = await calendar.events.insert({
//       calendarId: 'primary',
//       resource: event,
//       conferenceDataVersion: 1,
//     });

//     const meetLink = response.data.conferenceData.entryPoints[0].uri;
//     return meetLink;
//   } catch (error) {
//     console.error('Error creating event:', error);
//     return null;
//   }
// }

app.listen(PORT ,()=>{
    console.log(`App is running at port ${PORT}`)
})

