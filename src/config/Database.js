import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

class Database {
  static async start(mode) {
    let dbUrl;

    if (mode === 'test') dbUrl = process.env.TEST_DB_URL;
    else dbUrl = process.env.DB_URL;

    try {
      await mongoose.connect(dbUrl, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
      });
      console.log(`Database connected to Task Manager DB, mode: ${mode}`);
    } catch (err) {
      console.log(err);
    }
  }

  static createModel(name, model) {
    const schema = new mongoose.Schema(model);
    return mongoose.model(name, schema);
  }
}

export default Database;
