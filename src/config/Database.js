import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

class Database {
  static start() {
    mongoose
    .connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
    })
    .then(() => console.log('Connected to Task Manager DB'))
    .catch((err) => console.log(err));
  }

  static createModel(name, model) {
    const schema = new mongoose.Schema(model);
    return mongoose.model(name, schema);
  }
}

export default Database;
