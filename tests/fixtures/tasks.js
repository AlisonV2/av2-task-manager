import Task from '../../src/models/Task';

const createTask = async () => {
  const newTask = new Task({
    title: 'New task',
    description: 'New task description',
    user: '5f0b8b9f9d7d3b3d3c7f2f0f'
  });

  return newTask.save();
};

const createManyTasks = async () => {
  const tasks = [
    {
      title: 'A - New task',
      description: 'New task description',
      user: '5f0b8b9f9d7d3b3d3c7f2f0f',
      status: 'in-progress'
    },
    {
      title: 'B - New task',
      description: 'New task description',
      user: '5f0b8b9f9d7d3b3d3c7f2f0f',
      status: 'pending'
    },
    {
      title: 'C - New task',
      description: 'New task description',
      user: '5f0b8b9f9d7d3b3d3c7f2f0f',
      status: 'in-progress'
    },
    {
      title: 'D - New task',
      description: 'New task description',
      user: '5f0b8b9f9d7d3b3d3c7f2f0f',
      status: 'pending'
    },
    {
      title: 'E - New task',
      description: 'New task description',
      user: '5f0b8b9f9d7d3b3d3c7f2f0f',
      status: 'completed'
    },
    {
      title: 'F - New task',
      description: 'New task description',
      user: '5f0b8b9f9d7d3b3d3c7f2f0f',
      status: 'completed'
    },
  ];

  return Task.insertMany(tasks);
}

export { createTask, createManyTasks };
