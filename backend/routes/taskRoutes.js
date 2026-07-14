const express = require("express");

const router = express.Router();

const {
    createTask,
    getTasks,
    completeTask,
    deleteTask,
} = require("../controllers/taskController");

const protect = require("../middleware/authMiddleware");

router.post("/", protect, createTask);

router.get("/", protect, getTasks);
router.put("/:id",protect,completeTask);
router.delete("/:id",protect,deleteTask);

module.exports = router;