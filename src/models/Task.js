import Database from '../config/Database';

const Task = Database.createModel(
  'Task',
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending',
    },
    user: {
      type: String,
      required: true,
    },
    time: {
      type: Number,
      default: 0,
    }
  },
  {
    timestamps: true,
  }
);

export default Task;
