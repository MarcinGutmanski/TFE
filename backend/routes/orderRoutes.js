import express from 'express';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';
import Feedback from '../models/feedbackModel.js';
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

    const productsToUpdate = await Product.find();

    productsToUpdate.forEach((product) => {
      newOrder.orderItems.forEach((orderedProduct) => {
        if (product._id.toString() === orderedProduct.product.toString()) {
          product.countInStock = product.countInStock - orderedProduct.quantity;
          console.log(product);
          product.save();
        }
      });
    });

    const user = await User.findById(req.user._id);
    const order = await newOrder.save();

    const mailOptions = {
      from: 'Creamates',
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
    const orders = await Order.find({ user: req.user._id, isDeleted: false });
    if (orders) {
      res.send(orders);
    } else {
      res.status(404).send({ message: 'No orders not found.' });
    }
  })
);

orderRouter.get('/admin', isAuth, async (req, res) => {
  const orders = await Order.find({ isDeleted: false });
  if (orders) {
    res.send(orders);
  } else {
    res.status(404).send({ message: 'There is no order' });
  }
});

orderRouter.post(
  '/feedback',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findOne({ _id: req.body.order });
    if (order) {
      const newFeedback = new Feedback({
        name: req.body.name,
        email: req.body.email,
        feedback: req.body.feedback,
        order: order._id,
      });

      await newFeedback.save();

      res.send(200);
    } else {
      res.status(404).send({ message: 'The specified order does not exist' });
    }
  })
);

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

orderRouter.put(
  '/order/send/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    console.log(order);
    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      const updatedOrder = await order.save();

      const user = await User.findOne({ _id: order.user });

      const mailOptions = {
        from: 'Creamates',
        to: user.email,
        subject: 'Your order has been sent!',
        html:
          'Hello ' +
          user.name +
          ', <br/><br/>Your order has been sent, it should arrive in the next 5 working days<br/><br/> You can check your order <a href="' +
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

      res.send({ message: 'Order Sent', order: updatedOrder });
    } else {
      res.status(404).send({ message: 'Order not found.' });
    }
  })
);

export default orderRouter;
