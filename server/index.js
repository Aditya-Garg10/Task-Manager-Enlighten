const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const dotenv = require('dotenv');
const userRoute = require("./routes/User")
const taskRoute = require("./routes/Tasks")
const {Server} = require('socket.io');
const { protect } = require('./middleware/VerifyToken');
const Tasks = require('./models/Tasks');



dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server,{
  cors: {
    origin: "*",  // Accept all origins (or restrict to specific origins)
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }});

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use((req,res,next)=>{
  req.io = io;
  next()
})
const corsOptions = {
  origin:  "http://localhost:3000",  // Allows all origins to make requests
  methods: ["GET", "POST","PUT", "DELETE"],  // Allowed HTTP methods
  allowedHeaders: ["Content-Type", "authorization"], // Allowed request headers
  credentials: true,  // Allows cookies to be sent in cross-origin requests
  preflightContinue: false,  // Allow preflight requests
  optionsSuccessStatus: 200,  // HTTP status for successful preflight request
};
app.use(cors(corsOptions));



io.on("connection",(socket)=>{
  console.log("client connected",socket.id)         
  socket.on("message",(data)=>{
    // io.emit("msg",data);
    
  })
  // socket.on("message",message=>{
  //   console.log("new message",message)
  // })
})



// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));


  
module.exports = { server,io }; 


app.use("/api/user",userRoute)  
app.use("/api/task",taskRoute)  
  // Middleware to protect routes
  

  // Start the server
  server.listen(process.env.PORT || 5000, () => {
    console.log('Server is running');
  });
