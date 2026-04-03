const app = require("./app");
const env = require("../config/env");
const { testConnection } = require("../config/db");

const startServer = async () => {
  await testConnection();

  app.listen(env.PORT, () => {
    console.log(`Fin-Sight backend running on port ${env.PORT}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start server:", error.stack || error);
  process.exit(1);
});
