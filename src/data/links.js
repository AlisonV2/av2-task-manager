const apiLinks = [
  {
    ref: 'singleTask',
    links: [
      {
        type: 'self',
        model: 'task',
      },
      {
        type: 'collection',
        model: 'tasks',
      },
    ],
  },
  {
    ref: 'allTasks',
    links: [
      {
        type: 'self',
        model: 'tasks',
      },
    ],
  },
  {
    ref: 'login',
    links: [
      {
        type: 'self',
        model: 'sessions',
      },
      {
        type: 'collection',
        model: 'tokens',
      },
    ],
  },
  {
    ref: 'refreshToken',
    links: [
      {
        type: 'self',
        model: 'tokens',
      },
    ],
  },
  {
    ref: 'verifyEmail',
    links: [
      {
        type: 'collection',
        model: 'sessions',
      },
    ],
  },
  {
    ref: 'currentUser',
    links: [
      {
        type: 'self',
        model: 'users',
      },
    ],
  },
];

export default apiLinks;