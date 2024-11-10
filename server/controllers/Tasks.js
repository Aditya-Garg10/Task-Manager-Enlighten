
const { server } = require("../index");
const Tasks = require("../models/Tasks")
const {Server} = require('socket.io');

const createTask = async(req,res)=> {
    const { title, description,assignedTo } = req.body;  
        
    try {
      
      const newTask = new Tasks({
        title,
        description,
        createdBy: req.user.userId, 
        status: "Pending",
        assignedTo,
        collaborators: [req.user.userId], 
      });
  
      await newTask.save();
  
      // Emit a 'task-created' event to notify all clients of the new task
      const tasktoSend = await Tasks.find({ createdBy: req.user.userId });
      console.log(tasktoSend)
      req.io.emit("created",tasktoSend);
      res.status(201).json(newTask);
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Failed to create task' });
    }
  }


const getAllTasks = async(req,res) =>{
  // Get All Tasks
  try {
    const tasks = await Tasks.find({ createdBy: req.user.userId });
    res.json(tasks).status(200);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Failed to get tasks' });
  }

}

// Update Task
const updateTask = async(req, res) => {
  const { status, title, description } = req.body;
  try {
    const task = await Tasks.findById(req.params.id);

    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Ensure the user is authorized to edit this task
    if (task.createdBy.toString() !== req.user.userId && !task.collaborators.includes(req.user.userId)) {
      return res.status(403).json({ message: 'Permission denied' });
    }

    // Update task fields
    task.status = status || task.status;
    task.title = title || task.title;
    task.description = description || task.description;

    await task.save();
      
   
    
      
   req.io.emit("msg",task);
  // socket.on("message",message=>{
  //   console.log("new message",message)
  // })

  
    
    res.json(task).status(200);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update task' });
  }
};

// Delete Task
const deleteTask = async(req, res) => {
  try {
    const task = await Tasks.findById(req.params.id);

    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Ensure the user is authorized to delete this task
    if (task.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Permission denied' });
    }

    console.log(task)
    
     tasktoDelete = await Tasks.findByIdAndDelete({ _id: req.params.id });
    const tasktoSend = await Tasks.find({ createdBy: req.user.userId });
    console.log(tasktoSend)
    
    req.io.emit("del",tasktoSend);

    res.json({ message: 'Task deleted' }).status(200);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to delete task' });
  }
};




module.exports = {createTask,getAllTasks,updateTask,deleteTask}