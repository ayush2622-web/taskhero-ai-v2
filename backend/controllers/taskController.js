const Task = require("../models/Task");

// Create Task
exports.createTask = async (req,res)=>{
    try{

        const task = await Task.create({
            ...req.body,
            user:req.user.id,
        });

        res.status(201).json(task);

    }catch(err){

        res.status(500).json({
            message:err.message,
        });

    }
};

// Get User Tasks
exports.getTasks = async (req,res)=>{
    try{

        const tasks = await Task.find({
            user:req.user.id,
        });

        res.json(tasks);

    }catch(err){

        res.status(500).json({
            message:err.message,
        });

    }
};
    // Toggle Task Completion
exports.completeTask = async (req, res) => {
  try {
    console.log("Completed API called",req.params.id);
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    task.completed = !task.completed;

    await task.save();

    res.json(task);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
