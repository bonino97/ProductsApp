import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config({ path: '.env' });

export const createToken = async (user) => {
  const expiresIn = '24H';
  const { id, email, name, lastName } = user;
  const token = jwt.sign(
    { id, email, name, lastName },
    process.env.SECRET_JWT,
    { expiresIn }
  );
  return token;
};

export const verifyToken = async (token) => {
  const user = jwt.verify(token, process.env.SECRET_JWT);
  if (!user) throw new Error('Invalid token.');
  return user;
};
