import Task from '../../src/models/Task';

const createTask = async () => {
  const newTask = new Task({
    title: 'New task',
    description: 'New task description',
  });

  return newTask.save();
};

export { createTask };
