import express from 'express';
import data from '../data.js';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';
import MemberForm from '../models/memberFormModel.js';
import ProductForm from '../models/productFormModel.js';
import Order from '../models/orderModel.js';
import Role from '../models/roleModel.js';
import Notification from '../models/notificationModel.js';
import Feedback from '../models/feedbackModel.js';

const seedRouter = express.Router();

seedRouter.get('/', async (req, res) => {
  await MemberForm.remove({});
  await ProductForm.remove({});
  await Order.remove({});
  await Role.remove({});
  await Notification.remove({});
  await Feedback.remove({});
  const createdRoles = await Role.insertMany(data.roles);
  console.log(createdRoles);
  await Product.remove({});
  const createdProducts = await Product.insertMany(data.products);
  await User.remove({});
  const createdUsers = await User.insertMany(data.users);
  const admin = await User.findOne({ email: 'guma091196@gmail.com' });
  admin.role = createdRoles[0]._id;
  const updatedUser = await admin.save();
  const users = await User.find({ email: { $ne: 'guma091196@gmail.com' } });
  const udpatedUsers = await User.updateMany(
    { email: { $ne: 'guma091196@gmail.com' } },
    { $set: { role: createdRoles[2]._id } }
  );
  const updateProducts = await Product.updateMany(
    {},
    { $set: { user: admin._id } }
  );
  res.send({ createdProducts, createdUsers, createdRoles });
});

export default seedRouter;
