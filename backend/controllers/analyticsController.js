const Task = require("../models/Task");

exports.getAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;

    const tasks = await Task.find({ user: userId });

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const pendingTasks = totalTasks - completedTasks;

    const productivity =
      totalTasks === 0
        ? 0
        : Math.round((completedTasks / totalTasks) * 100);

    const priorities = {
      High: 0,
      Medium: 0,
      Low: 0,
    };

    const categories = {
      Study: 0,
      Work: 0,
      Personal: 0,
      Health: 0,
      Other: 0,
    };

    tasks.forEach(task => {
      priorities[task.priority]++;
      categories[task.category]++;
    });

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const todayCompleted = tasks.filter(task => {
      if (!task.completed) return false;

      const completedDate = new Date(task.updatedAt);

      completedDate.setHours(0, 0, 0, 0);

      return completedDate.getTime() === today.getTime();
    }).length;

    const last7Days = [];

    for (let i = 6; i >= 0; i--) {
      const day = new Date();

      day.setDate(day.getDate() - i);

      day.setHours(0, 0, 0, 0);

      const nextDay = new Date(day);

      nextDay.setDate(nextDay.getDate() + 1);

      const completed = tasks.filter(task => {
        return (
          task.completed &&
          task.updatedAt >= day &&
          task.updatedAt < nextDay
        );
      }).length;

      last7Days.push({
        day: day.toLocaleDateString("en-US", {
          weekday: "short",
        }),
        completed,
      });
    }

    res.json({
      success: true,

      overview: {
        totalTasks,
        completedTasks,
        pendingTasks,
        productivity,
        todayCompleted,
      },

      priorities,

      categories,

      weeklyChart: last7Days,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Analytics error",
    });
  }
};