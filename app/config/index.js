const config = {
  app: {
    port: process.env.PORT || 3000,
  },
  db: {
    uri: process.env.MONGODB_URI || "mongodb+srv://yenngoc29032k1:sq7Fn!bY@cluster0.3lhkfz0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    }
};

module.exports = config;