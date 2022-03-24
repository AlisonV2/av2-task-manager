import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();

export default class Database {
  static async start() {
    try {
      await mongoose.connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
      });
      console.log('Database connected to Task Manager DB');
    } catch (err) {
      console.log(err);
    }
  }

  static createModel(name, model) {
    const schema = new mongoose.Schema(model);
    return mongoose.model(name, schema);
  }
}