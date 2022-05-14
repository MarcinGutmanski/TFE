import express from 'express';
import Product from '../models/productModel.js';
import ProductForm from '../models/productFormModel.js';
import User from '../models/userModel.js';
import expressAsyncHandler from 'express-async-handler';
import { isAuth, transporter } from '../utils.js';

const productRouter = express.Router();

productRouter.get('/', async (req, res) => {
  const products = await Product.find();
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
  const product = await Product.findOne({ name: req.params.name });
  if (product) {
    res.send(product);
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

productRouter.get('/admin', async (req, res) => {
  const products = await Product.find();
  if (products) {
    res.send(products);
  } else {
    res.status(404).send({ message: 'Products not found.' });
  }
});

productRouter.post('/add', async (req, res) => {
  console.log(req.body);
  const newProduct = new Product({
    name: req.body.name,
    price: req.body.price,
    countInStock: req.body.quantity,
    description: req.body.description,
    category: req.body.category,
    rating: 0,
    numReviews: 0,
    image: '/images/image-not-found.jpg',
  });
  const product = await newProduct.save();

  if (product) {
    res.send(product);
  }
});

productRouter.post('/addFromForm', async (req, res) => {
  const newProduct = new Product({
    name: req.body.name,
    price: req.body.price,
    countInStock: req.body.quantity,
    description: req.body.description,
    category: req.body.category,
    rating: 0,
    numReviews: 0,
    image: '/images/image-not-found.jpg',
  });
  const product = await newProduct.save();

  const productForm = await ProductForm.findById(req.body.id);

  productForm.isAccepted = true;

  const updatedProductForm = await productForm.save();

  const user = await User.findOne({ _id: productForm.user });

  const mailOptions = {
    from: 'creamates.info@gmail.com',
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

productRouter.post('/declineFromForm', async (req, res) => {
  const productForm = await ProductForm.findById(req.body.id);

  const user = await User.findOne({ _id: productForm.user });

  if (productForm) {
    await ProductForm.deleteOne({ _id: req.body.id });
    console.log('Form supprimé');
  }

  const mailOptions = {
    from: 'creamates.info@gmail.com',
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

productRouter.post('/rate/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    const total = product.numReviews * product.rating;
    const newRating =
      (total + parseInt(req.body.rating)) / (product.numReviews + 1);
    const updatedProduct = await product.set({
      numReviews: product.numReviews + 1,
      rating: newRating,
    });
    await updatedProduct.save();
    console.log(updatedProduct);
    res.send(updatedProduct);
  } else {
    res.status(404).send({ message: 'Product not found.' });
  }
});

export default productRouter;
