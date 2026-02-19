// Database configuration for Aiven Cloud MySQL
export const dbConfig = {
  host: 'mysql-3c580c50-v1ny45248-6b02.i.aivencloud.com',
  port: 16892,
  user: 'avnadmin',
  password: process.env.DB_PASSWORD,
  database: 'defaultdb',
  ssl: {
    rejectUnauthorized: false
  },
  connectTimeout: 60000
};

// Connection string format
export const connectionString = `mysql://${dbConfig.user}:****@${dbConfig.host}:${dbConfig.port}/${dbConfig.database}?ssl-mode=REQUIRED`;