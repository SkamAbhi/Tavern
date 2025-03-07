import dotenv from 'dotenv';
dotenv.config();

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT || 3000,
  mongoose: {
    url: process.env.MONGODB_URI,
    options: {
      autoIndex: true, // Auto-create indexes (disable in prod)
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
};