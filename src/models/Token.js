import Database from '../config/Database';

const Token = Database.createModel('Token', {
  user: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  }
});

export default Token;