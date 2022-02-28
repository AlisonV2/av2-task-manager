import Task from '../../src/models/Task';

const task1 = {
  title: 'A - New task',
  description: 'New task description',
  user: '5f0b8b9f9d7d3b3d3c7f2f0f',
  status: 'in-progress',
};

const task2 = {
  title: 'B - New task',
  description: 'New task description',
  user: '5f0b8b9f9d7d3b3d3c7f2f0f',
  status: 'pending',
};

const task3 = {
  title: 'C - New task',
  description: 'New task description',
  user: '5f0b8b9f9d7d3b3d3c7f2f0f',
  status: 'in-progress',
};

const task4 = {
  title: 'D - New task',
  description: 'New task description',
  user: '5f0b8b9f9d7d3b3d3c7f2f0f',
  status: 'pending',
};

const task5 = {
  title: 'E - New task',
  description: 'New task description',
  user: '5f0b8b9f9d7d3b3d3c7f2f0f',
  status: 'completed',
};

const task6 = {
  title: 'F - New task',
  description: 'New task description',
  user: '5f0b8b9f9d7d3b3d3c7f2f0f',
  status: 'completed',
};

const createTask = async () => {
  const newTask = new Task({
    title: 'New task',
    description: 'New task description',
    user: '5f0b8b9f9d7d3b3d3c7f2f0f',
  });

  return newTask.save();
};

const createUserTask = async (id) => {
  const newTask = new Task({
    title: 'New task',
    description: 'New task description',
    user: id,
  });
  return newTask.save();
};

const createManyTasks = async () => {
  const tasks = [task1, task2, task3, task4, task5, task6];
  return Task.insertMany(tasks);
};

const createManyUserTasks = async (id) => {
  const tasks = [
    {
      ...task1,
      user: id,
    },
    {
      ...task2,
      user: id,
    },
    {
      ...task3,
      user: id,
    },
    {
      ...task4,
      user: id,
    },
    {
      ...task5,
      user: id,
    },
    {
      ...task6,
      user: id,
    },
  ];

  return Task.insertMany(tasks);
};

export { createTask, createManyTasks, createUserTask, createManyUserTasks };
