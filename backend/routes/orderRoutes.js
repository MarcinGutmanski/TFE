import express from 'express';
import Order from '../models/orderModel.js';
import User from '../models/userModel.js';
import { isAuth, transporter } from '../utils.js';
import expressAsyncHandler from 'express-async-handler';

const orderRouter = express.Router();
orderRouter.post(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const newOrder = new Order({
      orderItems: req.body.orderItems.map((x) => ({ ...x, product: x._id })),
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      itemsPrice: req.body.itemsPrice,
      shippingPrice: req.body.shippingPrice,
      taxPrice: req.body.taxPrice,
      totalPrice: req.body.totalPrice,
      user: req.user._id,
    });

    const user = await User.findById(req.user._id);
    const order = await newOrder.save();

    const mailOptions = {
      from: 'creamates.info@gmail.com',
      to: user.email,
      subject: 'Thank you for your purchase!',
      html:
        'Hello ' +
        user.name +
        ', <br/><br/>Thank you for chosing our products, you won' +
        't regret it!<br/><br/> You can check your order <a href="' +
        'http://localhost:3000/order/' +
        order._id +
        '">here</a><br/><br/>Kind regards, <br/> Créamates',
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    res.status(201).send({ message: 'New Order created!', order });
  })
);

orderRouter.get(
  '/mine',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    if (orders) {
      res.send(orders);
    } else {
      res.status(404).send({ message: 'No orders not found.' });
    }
  })
);

orderRouter.get('/admin', async (req, res) => {
  const orders = await Order.find();
  if (orders) {
    res.send(orders);
  } else {
    res.status(404).send({ message: 'Ther is no order' });
  }
});

orderRouter.get(
  '/order/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      res.send(order);
    } else {
      res.status(404).send({ message: 'Order not found.' });
    }
  })
);

orderRouter.put(
  '/:id/pay',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };
      const updatedOrder = await order.save();
      res.send({ message: 'Order Paid', order: updatedOrder });
    } else {
      res.status(404).send({ message: 'Order not found.' });
    }
  })
);

export default orderRouter;
