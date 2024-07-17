const dev = {
  app: {
    port: process.env.DEV_APP_PORT || 4000,
  },
  db: {
    host: process.env.DEV_DB_HOST || "localhost",
    port: process.env.DEV_DB_PORT || "27017",
    db_name: process.env.DEV_DB_NAME || "ecommerceDev",
    user_name: process.env.DEV_DB_USER || "",
    password: process.env.DEV_DB_PASSWORD || "",
  },
};

const pro = {
  app: {
    port: process.env.PRO_APP_PORT || 4000,
  },
  db: {
    host: process.env.PRO_DB_HOST || "localhost",
    port: process.env.PRO_DB_PORT || "27017",
    db_name: process.env.PRO_DB_NAME || "ecommerceDev",
    user_name: process.env.PRO_DB_USER || "",
    password: process.env.PRO_DB_PASSWORD || "",
  },
};

const config = { dev, pro };
const env = process.env.NODE_ENV || "dev";

module.exports = config[env];
