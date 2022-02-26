import Task from '../../src/models/Task';

const createTask = async () => {
  const newTask = new Task({
    title: 'New task',
    description: 'New task description',
    user: '5f0b8b9f9d7d3b3d3c7f2f0f'
  });

  return newTask.save();
};

export { createTask };
