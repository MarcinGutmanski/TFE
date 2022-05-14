import express from 'express';
import data from '../data.js';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';
import MemberForm from '../models/memberFormModel.js';
import ProductForm from '../models/productFormModel.js';
import Order from '../models/orderModel.js';

const seedRouter = express.Router();

seedRouter.get('/', async (req, res) => {
  await MemberForm.remove({});
  await ProductForm.remove({});
  await Order.remove({});
  await Product.remove({});
  const createdProducts = await Product.insertMany(data.products);
  await User.remove({});
  const createdUsers = await User.insertMany(data.users);
  res.send({ createdProducts, createdUsers });
});

export default seedRouter;
