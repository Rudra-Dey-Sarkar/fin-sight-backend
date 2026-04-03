import app from "./app.js";
import env from "./config/env.js";
import { testConnection } from "./config/db.js";

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
