import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
  return jwt.sing(
    {
      _id: user.id,
      name: user.name,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '24h',
    }
  );
};
