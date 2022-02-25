class Server {
  static async start(app) {
    const port = process.env.port || 3000;
    try {
      await app.listen(port);
      console.log(`Server listening on port ${port}`);
    } catch (err) {
      console.error(err);
    }
  }
}

export default Server;
