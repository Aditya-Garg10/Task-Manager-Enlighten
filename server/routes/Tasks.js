const express = require("express");
const { createTask, getAllTasks, updateTask, deleteTask } = require("../controllers/Tasks");
const { protect } = require("../middleware/VerifyToken");

const router = express.Router();


router.post("/createTask", protect, createTask);
router.get("/getAllTasks", protect, getAllTasks);
router.put("/updateTask/:id", protect, updateTask);
router.delete("/deleteTask/:id", protect, deleteTask);


module.exports = router;