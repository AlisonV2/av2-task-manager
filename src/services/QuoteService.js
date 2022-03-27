import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export default class QuoteService {
  static async getRandomQuote() {
      const { data } = await axios.get(`${process.env.QUOTE_URL}/random`);
      return {
        content: data.content,
        author: data.author,
      };
  }
}
