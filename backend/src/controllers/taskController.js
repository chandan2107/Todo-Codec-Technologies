const Task = require('../models/Task');
const { success, error } = require('../utils/apiResponse');

// @desc    Get all tasks for logged in user with pagination, filtering & sorting
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      priority,
      search,
      sortBy = 'createdAt',
      order = 'desc',
      startDate,
      endDate
    } = req.query;

    const query = { user: req.user._id };

    // Filtering by status
    if (status && status !== 'All') {
      query.status = status;
    }

    // Filtering by priority
    if (priority && priority !== 'All') {
      query.priority = priority;
    }

    // Search query across title and description
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: { $regex: searchRegex } },
        { description: { $regex: searchRegex } }
      ];
    }

    // Date range filtering on dueDate
    if (startDate || endDate) {
      query.dueDate = {};
      if (startDate) {
        query.dueDate.$gte = new Date(startDate);
      }
      if (endDate) {
        query.dueDate.$lte = new Date(endDate);
      }
    }

    // Pagination configuration
    const parsedPage = Math.max(1, parseInt(page, 10));
    const parsedLimit = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (parsedPage - 1) * parsedLimit;

    // Sorting configuration
    const sortOrder = order === 'asc' ? 1 : -1;
    let sortOptions = {};

    if (sortBy === 'priority') {
      // Custom priority order can be handled or sort directly by string/aggregation
      sortOptions = { priority: sortOrder, createdAt: -1 };
    } else {
      sortOptions[sortBy] = sortOrder;
    }

    // Execute queries in parallel for count & data
    const [tasks, totalTasks] = await Promise.all([
      Task.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(parsedLimit)
        .lean(),
      Task.countDocuments(query)
    ]);

    const totalPages = Math.ceil(totalTasks / parsedLimit) || 1;

    return success(res, {
      statusCode: 200,
      message: 'Tasks retrieved successfully',
      data: tasks,
      pagination: {
        totalTasks,
        totalPages,
        currentPage: parsedPage,
        limit: parsedLimit,
        hasNextPage: parsedPage < totalPages,
        hasPrevPage: parsedPage > 1
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get dashboard statistics for user's tasks
// @route   GET /api/tasks/stats
// @access  Private
const getTaskStats = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    const [statusStats, priorityStats, overdueCount, dueTodayCount, totalTasks] = await Promise.all([
      // Count by Status
      Task.aggregate([
        { $match: { user: userId } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      // Count by Priority
      Task.aggregate([
        { $match: { user: userId } },
        { $group: { _id: '$priority', count: { $sum: 1 } } }
      ]),
      // Count Overdue tasks (dueDate < startOfToday and status != 'Completed')
      Task.countDocuments({
        user: userId,
        dueDate: { $lt: startOfToday },
        status: { $ne: 'Completed' }
      }),
      // Count Due Today tasks
      Task.countDocuments({
        user: userId,
        dueDate: { $gte: startOfToday, $lte: endOfToday }
      }),
      // Total tasks
      Task.countDocuments({ user: userId })
    ]);

    // Format status map
    const statusMap = {
      Pending: 0,
      'In-Progress': 0,
      Completed: 0
    };
    statusStats.forEach((item) => {
      if (statusMap.hasOwnProperty(item._id)) {
        statusMap[item._id] = item.count;
      }
    });

    // Format priority map
    const priorityMap = {
      Low: 0,
      Medium: 0,
      High: 0
    };
    priorityStats.forEach((item) => {
      if (priorityMap.hasOwnProperty(item._id)) {
        priorityMap[item._id] = item.count;
      }
    });

    return success(res, {
      statusCode: 200,
      message: 'Task statistics retrieved successfully',
      data: {
        total: totalTasks,
        pending: statusMap.Pending,
        inProgress: statusMap['In-Progress'],
        completed: statusMap.Completed,
        priorities: priorityMap,
        overdue: overdueCount,
        dueToday: dueTodayCount,
        completionRate: totalTasks > 0 ? Math.round((statusMap.Completed / totalTasks) * 100) : 0
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!task) {
      return error(res, {
        statusCode: 404,
        message: 'Task not found'
      });
    }

    return success(res, {
      statusCode: 200,
      message: 'Task retrieved successfully',
      data: task
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate, tags } = req.body;

    const task = await Task.create({
      user: req.user._id,
      title,
      description: description || '',
      status: status || 'Pending',
      priority: priority || 'Medium',
      dueDate: dueDate || null,
      tags: tags || []
    });

    return success(res, {
      statusCode: 201,
      message: 'Task created successfully',
      data: task
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update task details
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate, tags } = req.body;

    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!task) {
      return error(res, {
        statusCode: 404,
        message: 'Task not found'
      });
    }

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate || null;
    if (tags !== undefined) task.tags = tags;

    const updatedTask = await task.save();

    return success(res, {
      statusCode: 200,
      message: 'Task updated successfully',
      data: updatedTask
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Quick update task status (Pending -> In-Progress -> Completed)
// @route   PATCH /api/tasks/:id/status
// @access  Private
const updateTaskStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { status },
      { new: true, runValidators: true }
    );

    if (!task) {
      return error(res, {
        statusCode: 404,
        message: 'Task not found'
      });
    }

    return success(res, {
      statusCode: 200,
      message: `Task status updated to ${status}`,
      data: task
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!task) {
      return error(res, {
        statusCode: 404,
        message: 'Task not found'
      });
    }

    return success(res, {
      statusCode: 200,
      message: 'Task deleted successfully',
      data: { id: req.params.id }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Export user's tasks to CSV format
// @route   GET /api/tasks/export/csv
// @access  Private
const exportTasksCSV = async (req, res, next) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 }).lean();

    const escapeCsv = (str) => {
      if (str === null || str === undefined) return '""';
      const clean = String(str).replace(/"/g, '""');
      return `"${clean}"`;
    };

    const headers = ['ID', 'Title', 'Description', 'Status', 'Priority', 'Due Date', 'Tags', 'Created At'];
    const rows = tasks.map((t) => [
      escapeCsv(t._id),
      escapeCsv(t.title),
      escapeCsv(t.description || ''),
      escapeCsv(t.status),
      escapeCsv(t.priority),
      escapeCsv(t.dueDate ? new Date(t.dueDate).toISOString().split('T')[0] : ''),
      escapeCsv((t.tags || []).join(', ')),
      escapeCsv(new Date(t.createdAt).toISOString())
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="tasks-export.csv"');
    return res.status(200).send(csvContent);
  } catch (err) {
    next(err);
  }
};

// @desc    Bulk update status for tasks
// @route   PATCH /api/tasks/bulk/status
// @access  Private
const bulkUpdateStatus = async (req, res, next) => {
  try {
    const { ids, status } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return error(res, {
        statusCode: 400,
        message: 'A non-empty array of task IDs is required'
      });
    }

    const result = await Task.updateMany(
      { _id: { $in: ids }, user: req.user._id },
      { $set: { status } }
    );

    return success(res, {
      statusCode: 200,
      message: `Updated status to ${status} for ${result.modifiedCount} task(s)`,
      data: { modifiedCount: result.modifiedCount }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getTasks,
  getTaskStats,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  exportTasksCSV,
  bulkUpdateStatus
};

