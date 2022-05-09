import express from 'express';
import Product from '../models/productModel.js';
import expressAsyncHandler from 'express-async-handler';

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
    image: '/images/image-not-found.png',
  });
  const product = await newProduct.save();

  if (product) {
    res.send(product);
  }
});

productRouter.post('/addFromForm', async (req, res) => {
  console.log(req.body);
  const newProduct = new Product({
    name: req.body.name,
    price: req.body.price,
    countInStock: req.body.quantity,
    description: req.body.description,
    category: req.body.category,
    rating: 0,
    numReviews: 0,
    image: '/images/image-not-found.png',
  });
  const product = await newProduct.save();

  if (product) {
    res.send(product);
  }
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
