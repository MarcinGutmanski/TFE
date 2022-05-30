import express from 'express';
import Product from '../models/productModel.js';
import ProductForm from '../models/productFormModel.js';
import User from '../models/userModel.js';
import Order from '../models/orderModel.js';
import UserRating from '../models/userRatingModel.js';
import Notification from '../models/notificationModel.js';
import expressAsyncHandler from 'express-async-handler';
import { isAuth, transporter } from '../utils.js';

const productRouter = express.Router();

productRouter.get('/', async (req, res) => {
  const products = await Product.find({ isDeleted: false });
  res.send(products);
});

const PAGE_SIZE = 3;
productRouter.get(
  '/search',
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1;
    const category = query.category || '';
    const price = query.price || '';
    const rating = query.rating || '';
    const order = query.order || '';
    const searchQuery = query.query || '';

    const queryFilter =
      searchQuery && searchQuery !== 'all'
        ? {
            name: {
              $regex: searchQuery,
              $options: 'i',
            },
          }
        : {};
    const categoryFilter = category && category !== 'all' ? { category } : {};
    const ratingFilter =
      rating && rating !== 'all'
        ? {
            rating: {
              $gte: Number(rating),
            },
          }
        : {};
    const priceFilter =
      price && price !== 'all'
        ? {
            price: {
              $gte: Number(price.split('-')[0]),
              $lte: Number(price.split('-')[1]),
            },
          }
        : {};

    const sortOrder =
      order === 'featured'
        ? { featured: -1 }
        : order === 'lowest'
        ? { price: 1 }
        : order === 'highest'
        ? { price: -1 }
        : order === 'toprated'
        ? { rating: -1 }
        : order === 'newest'
        ? { createdAt: -1 }
        : { _id: -1 };

    const products = await Product.find({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    })
      .sort(sortOrder)
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    const countProducts = await Product.countDocuments({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    });

    res.send({
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
    });
  })
);

productRouter.get('/name/:name', async (req, res) => {
  const product = await Product.findOne({
    name: req.params.name,
    isDeleted: false,
  });
  if (product) {
    const user = await User.findOne({ _id: product.user });
    res.send({ product, user });
  } else {
    res.status(404).send({ message: 'Product not found.' });
  }
});

productRouter.get(
  '/categories',
  expressAsyncHandler(async (req, res) => {
    const categories = await Product.find().distinct('category');
    res.send(categories);
    console.log(categories);
  })
);

productRouter.get('/admin', isAuth, async (req, res) => {
  const products = await Product.find({ isDeleted: false });
  if (products) {
    res.send(products);
  } else {
    res.status(404).send({ message: 'Products not found.' });
  }
});

productRouter.post('/addFromForm', isAuth, async (req, res) => {
  const productForm = await ProductForm.findById(req.body.id);

  const newProduct = new Product({
    name: req.body.name,
    price: req.body.price,
    countInStock: req.body.quantity,
    description: req.body.description,
    category: req.body.category,
    rating: 0,
    numReviews: 0,
    image: '/images/image-not-found.jpg',
    user: productForm.user,
  });
  const product = await newProduct.save();

  productForm.isAccepted = true;

  const updatedProductForm = await productForm.save();

  const user = await User.findOne({ _id: productForm.user });

  const mailOptions = {
    from: 'Creamates',
    to: user.email,
    subject: 'Your product has been added!',
    html:
      'Hello ' +
      user.name +
      ', <br/><br/>Your product : ' +
      productForm.name +
      ' has been added to the website<br/><br/> You can see your product <a href="' +
      'http://localhost:3000/product/' +
      product.name +
      '">here</a><br/><br/>Kind regards, <br/> Créamates',
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

  if (product) {
    res.send(product);
  }
});

productRouter.post('/declineFromForm', isAuth, async (req, res) => {
  const productForm = await ProductForm.findById(req.body.id);

  const user = await User.findOne({ _id: productForm.user });

  if (productForm) {
    await ProductForm.deleteOne({ _id: req.body.id });
    console.log('Form supprimé');
  }

  const mailOptions = {
    from: 'Creamates',
    to: user.email,
    subject: 'Your product has been declined',
    html:
      'Hello ' +
      user.name +
      ', <br/><br/>Sorry, but your product : ' +
      productForm.name +
      ' has been declined<br/><br/> Here is an explanation why : ' +
      req.body.feedback +
      '<br/><br/> If you apply asked changes/remarks, you can try applying again <a href="' +
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

productRouter.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Product not found.' });
  }
});

productRouter.post('/add', isAuth, async (req, res) => {
  const newProduct = new Product({
    name: req.body.name,
    price: req.body.price,
    countInStock: req.body.quantity,
    description: req.body.description,
    category: req.body.category,
    rating: 0,
    numReviews: 0,
    image: '/images/image-not-found.jpg',
    user: req.user._id,
  });
  const product = await newProduct.save();

  if (product) {
    res.send(product);
  }
});

async function notifyUser(notifId, userId, productId) {
  const user = await User.findOne({ _id: userId });
  const product = await Product.findOne({ _id: productId });
  const mailOptions = {
    from: 'Creamates',
    to: user.email,
    subject: 'Product available!',
    html:
      'Hello ' +
      user.name +
      ', <br/><br/>The product : ' +
      product.name +
      ' is now available!<br/><br/> You can see it <a href="' +
      'http://localhost:3000/product/' +
      product.name +
      '">here</a><br/><br/>Kind regards, <br/> Créamates',
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

  await Notification.deleteOne({ _id: notifId });
}

productRouter.post('/modify/:id', isAuth, async (req, res) => {
  let product = await Product.findOne({ _id: req.params.id });
  console.log(product);

  if (product.countInStock == 0 && req.body.quantity > 0) {
    console.log('It went here');
    const notifications = await Notification.find({ product: product._id });

    notifications.forEach((notif) => {
      notifyUser(notif._id, notif.user, notif.product);
    });
  }

  product.name = req.body.name;
  product.price = req.body.price;
  product.countInStock = req.body.quantity;
  product.description = req.body.description;
  product.category = req.body.category;

  const updatedProduct = await product.save();

  const user = await User.findOne({ _id: product.user });
  console.log(user);

  const mailOptions = {
    from: 'Creamates',
    to: user.email,
    subject: 'Your product has been updated!',
    html:
      'Hello ' +
      user.name +
      ', <br/><br/>Your product : ' +
      product.name +
      ' has been updated.<br/><br/> You can see your product <a href="' +
      'http://localhost:3000/product/' +
      product.name +
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

productRouter.post('/delete/:id', async (req, res) => {
  let product = await Product.findOne({ _id: req.params.id });

  product.isDeleted = true;

  const updatedProduct = await product.save();

  const user = await User.findOne({ _id: product.user });

  const mailOptions = {
    from: 'Creamates',
    to: user.email,
    subject: 'Your product has been deleted',
    html:
      'Hello ' +
      user.name +
      ', <br/><br/>Your product : ' +
      product.name +
      ' has been deleted.<br/><br/> If you think this is a mistake, please respond to this email.<br/><br/>Kind regards, <br/> Créamates',
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

productRouter.post('/rate/:id', isAuth, async (req, res) => {
  const product = await Product.findById(req.params.id);
  const user = await User.findOne({ _id: req.user._id });
  const userRating = await UserRating.find({ user: user._id });
  const orders = await Order.find({
    user: user._id,
    'orderItems._id': product._id,
  });
  console.log(orders);
  console.log(userRating);
  if (product && userRating.length == 0 && orders) {
    const total = product.numReviews * product.rating;
    const newRating =
      (total + parseInt(req.body.rating)) / (product.numReviews + 1);
    const updatedProduct = await product.set({
      numReviews: product.numReviews + 1,
      rating: newRating,
    });

    const userRating = new UserRating({
      user: user._id,
      product: product._id,
      rating: req.body.rating,
    });

    await userRating.save();

    await updatedProduct.save();
    console.log(updatedProduct);
    res.send(updatedProduct);
  } else {
    res.status(404).send({ message: 'You can not rate this item.' });
  }
});

productRouter.post('/notify/:id', isAuth, async (req, res) => {
  const product = await Product.findById(req.params.id);
  const user = await User.findOne({ _id: req.user._id });
  const notification = await Notification.find({
    user: user._id,
    product: product._id,
  });
  console.log(notification);
  if (notification.length == 0) {
    const newNotification = new Notification({
      user: user._id,
      product: product._id,
    });
    await newNotification.save();
    res.send(200);
  } else {
    res
      .status(404)
      .send({ message: 'You have already asked for a notification.' });
  }
});

export default productRouter;
