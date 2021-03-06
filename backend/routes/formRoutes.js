import express from 'express';
import MemberForm from '../models/memberFormModel.js';
import ProductForm from '../models/productFormModel.js';
import { isAuth } from '../utils.js';
import expressAsyncHandler from 'express-async-handler';

const formRouter = express.Router();
formRouter.get('/admin/member', isAuth, async (req, res) => {
  const memberForms = await MemberForm.find({ isAccepted: false });
  if (memberForms) {
    res.send(memberForms);
  } else {
    res.status(404).send({ message: 'No forms found.' });
  }
});

formRouter.get('/admin/product', isAuth, async (req, res) => {
  const productForms = await ProductForm.find({ isAccepted: false });
  if (productForms) {
    res.send(productForms);
  } else {
    res.status(404).send({ message: 'No forms found.' });
  }
});

formRouter.post(
  '/submit',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const newMemberForm = new MemberForm({
      name: req.body.name,
      email: req.body.email,
      description: req.body.description,
      type: 'Member',
      isAccepted: false,
      user: req.user._id,
    });
    const memberForm = await newMemberForm.save();
    res.send({
      _id: memberForm._id,
      name: memberForm.name,
      email: memberForm.email,
      isAccepted: memberForm.isAccepted,
    });
  })
);

formRouter.post(
  '/addProduct',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    console.log(req.user);
    const newProductForm = new ProductForm({
      name: req.body.name,
      price: req.body.price,
      quantity: req.body.quantity,
      description: req.body.description,
      category: req.body.category,
      isAccepted: false,
      user: req.user._id,
    });
    const productForm = await newProductForm.save();
    res.send({
      _id: productForm._id,
      name: productForm.name,
      price: productForm.price,
      quantity: productForm.quantity,
      description: productForm.description,
      category: productForm.category,
      isAccepted: productForm.isAccepted,
    });
  })
);

formRouter.get('/memberForm/:id', isAuth, async (req, res) => {
  const memberForm = await MemberForm.findById(req.params.id);
  if (memberForm) {
    res.send(memberForm);
  } else {
    res.status(404).send({ message: 'Member form not found.' });
  }
});

formRouter.get('/productForm/:id', isAuth, async (req, res) => {
  const productForm = await ProductForm.findById(req.params.id);
  if (productForm) {
    res.send(productForm);
  } else {
    res.status(404).send({ message: 'Product form not found.' });
  }
});

export default formRouter;
