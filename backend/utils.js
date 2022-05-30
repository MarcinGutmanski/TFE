import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

export const generateToken = (user) => {
  return jwt.sign(
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

export const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7, authorization.length);
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        res.status(401).send({ message: 'Invalid Token' });
      } else {
        req.user = decode;
        next();
      }
    });
  } else {
    res.status(401).send({ message: 'No token' });
  }
};

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'info.creamates@gmail.com',
    pass: 'CreamatesAdmin3584',
  },
  from: 'Creamates',
});
