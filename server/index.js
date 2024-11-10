const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const dotenv = require('dotenv');
const userRoute = require("./routes/User")
const taskRoute = require("./routes/Tasks")
const {Server} = require('socket.io');




dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server,{
  cors: {
    origin: "https://task-manager-englighten-client.vercel.app", 
    methods: ["GET", "POST","PUT","DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }});


app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use((req,res,next)=>{
  req.io = io;
  next()
})
const corsOptions = {
  origin:  "https://task-manager-englighten-client.vercel.app",  
  methods: ["GET", "POST","PUT", "DELETE"],  
  allowedHeaders: ["Content-Type", "authorization"], 
  credentials: true, 
  preflightContinue: false, 
  optionsSuccessStatus: 200,  
};
app.use(cors(corsOptions));



io.on("connection",(socket)=>{
  console.log("client connected",socket.id)         
  socket.on("message",(data)=>{
    
    
  })
  
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
