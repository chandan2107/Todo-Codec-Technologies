const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const Task = require('./models/Task');
const connectDB = require('./config/db');

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data for demo user
    const existingDemo = await User.findOne({ email: 'demo@taskflow.dev' });
    if (existingDemo) {
      await Task.deleteMany({ user: existingDemo._id });
      await User.deleteOne({ _id: existingDemo._id });
      console.log('[Seed] Cleared prior demo user and associated tasks');
    }

    // Create demo user
    const demoUser = await User.create({
      name: 'Alex Johnson',
      email: 'demo@taskflow.dev',
      password: 'Password123'
    });
    console.log(`[Seed] Demo user created: ${demoUser.email} (Password: Password123)`);

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 17, 0, 0);
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 18, 0, 0);
    const inThreeDays = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3, 12, 0, 0);
    const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 12, 0, 0);

    const sampleTasks = [
      {
        user: demoUser._id,
        title: 'Design MongoDB Aggregation Pipelines for Analytics',
        description: 'Optimize task metrics computation with aggregation stages ($match, $group, $count) for fast dashboard rendering.',
        status: 'In-Progress',
        priority: 'High',
        dueDate: today,
        tags: ['Database', 'MongoDB', 'Performance']
      },
      {
        user: demoUser._id,
        title: 'Implement Express Validator & Structured Error Handler',
        description: 'Add request validation rules for title length, status enums, date formats, and centralize 400/404/422/500 error responses.',
        status: 'Completed',
        priority: 'High',
        dueDate: yesterday,
        tags: ['Backend', 'Security', 'Express']
      },
      {
        user: demoUser._id,
        title: 'Integrate React Hooks & Context State Management',
        description: 'Build useAuth, useTasks, and useDebounce custom hooks alongside AuthContext and ToastContext for seamless UI responsiveness.',
        status: 'Completed',
        priority: 'Medium',
        dueDate: yesterday,
        tags: ['Frontend', 'React', 'Hooks']
      },
      {
        user: demoUser._id,
        title: 'Build Kanban Workflow Board View',
        description: 'Provide an interactive board view displaying tasks under Pending, In-Progress, and Completed columns with instant status transitions.',
        status: 'In-Progress',
        priority: 'Medium',
        dueDate: tomorrow,
        tags: ['UI/UX', 'Workflow', 'Kanban']
      },
      {
        user: demoUser._id,
        title: 'Conduct End-to-End API Integration Testing',
        description: 'Test all CRUD endpoints: GET /api/tasks with pagination and filters, PATCH status update, and DELETE with authorization checks.',
        status: 'Pending',
        priority: 'High',
        dueDate: inThreeDays,
        tags: ['QA', 'Testing', 'API']
      },
      {
        user: demoUser._id,
        title: 'Document API Endpoints and Architecture Guide',
        description: 'Write comprehensive documentation detailing routes, query parameters, JWT auth headers, and setup instructions in README.',
        status: 'Pending',
        priority: 'Low',
        dueDate: inThreeDays,
        tags: ['Docs', 'Architecture']
      }
    ];

    await Task.insertMany(sampleTasks);
    console.log(`[Seed] Seeded ${sampleTasks.length} sample tasks successfully.`);

    process.exit(0);
  } catch (error) {
    console.error(`[Seed Error]: ${error.message}`);
    process.exit(1);
  }
};

seedData();

