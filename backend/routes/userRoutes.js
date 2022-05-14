import express from 'express';
import User from '../models/userModel.js';
import Order from '../models/orderModel.js';
import MemberForm from '../models/memberFormModel.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils.js';
import expressAsyncHandler from 'express-async-handler';
import { isAuth, transporter } from '../utils.js';

const userRouter = express.Router();

userRouter.post(
  '/signin',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          token: generateToken(user),
        });
        return;
      }
    }
    res.status(401).send({ message: 'Email ou mot de passe invalide(s)' });
  })
);

userRouter.post(
  '/signup',
  expressAsyncHandler(async (req, res) => {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password),
    });
    const user = await newUser.save();

    const mailOptions = {
      from: 'creamates.info@gmail.com',
      to: newUser.email,
      subject: 'Welcome to Creamates!',
      html:
        'Hello ' +
        newUser.name +
        ', <br/><br/>Thank you for joining!<br/><br/> Now that you joined you can go back to our <a href="' +
        'http://localhost:3000' +
        '">website</a><br/><br/>Kind regards, <br/> Créamates',
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user),
    });
  })
);

userRouter.put(
  '/profile',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8);
      }

      const updatedUser = await user.save();
      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        token: generateToken(updatedUser),
      });
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  })
);

userRouter.get('/admin', async (req, res) => {
  const users = await User.find();
  if (users) {
    res.send(users);
  } else {
    res.status(404).send({ message: 'Users not found.' });
  }
});

userRouter.post('/addFromForm', async (req, res) => {
  const memberForm = await MemberForm.findById(req.body.id);

  memberForm.isAccepted = true;

  const updatedProductForm = await memberForm.save();

  const user = await User.findOne({ _id: memberForm.user });

  const mailOptions = {
    from: 'creamates.info@gmail.com',
    to: user.email,
    subject: 'Membership accepted!',
    html:
      'Hello ' +
      user.name +
      ', <br/><br/>Your membership has been approved!<br/><br/> You can now submit your own products, once they are accepted by the admin, they will be out there for eveyrone to see!<br/><br/>' +
      'If you want to add a product, please go <a href="' +
      'http://localhost:3000/productForm' +
      '">here</a><br/><br/>Kind regards, <br/> Créamates',
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

  res.send(200);
});

userRouter.post('/declineFromForm', async (req, res) => {
  const memberForm = await MemberForm.findById(req.body.id);

  const user = await User.findOne({ _id: memberForm.user });

  if (memberForm) {
    await MemberForm.deleteOne({ _id: req.body.id });
    console.log('Form supprimé');
  }

  const mailOptions = {
    from: 'creamates.info@gmail.com',
    to: user.email,
    subject: 'Membership declined',
    html:
      'Hello ' +
      user.name +
      ', <br/><br/>Sorry, but your membership has been declined<br/><br/> Here is an explanation why : ' +
      req.body.feedback +
      '<br/><br/> If you apply this feedback, you can try applying again <a href="' +
      'http://localhost:3000/memberForm' +
      '">here</a><br/><br/>Kind regards, <br/> Créamates',
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

  res.send(200);
});

userRouter.delete('/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    const orders = await Order.find({ user: req.params.id });
    if (orders) {
      await Order.deleteMany({ user: req.params.id });
      console.log('Order supprimé');
    }
    await User.deleteOne({ _id: req.params.id });
    console.log('User supprimé');
    res.status(200);
  } else {
    res.status(404).send({ message: 'User not found.' });
  }
});

userRouter.put(
  '/profile/:id',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8);
      }

      const updatedUser = await user.save();
      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        token: generateToken(updatedUser),
      });
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  })
);

export default userRouter;
