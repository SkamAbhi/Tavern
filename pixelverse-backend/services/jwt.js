import jwt from 'jsonwebtoken';
import config from '../config/config.js';

export const signToken = (id) => {
  return jwt.sign({ id }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

export const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.jwt.secret, (err, decoded) => {
      if (err) reject(err);
      resolve(decoded);
    });
  });
};