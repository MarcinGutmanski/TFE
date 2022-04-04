import bcrypt from 'bcryptjs';

const data = {
  users: [
    {
      name: 'Marcin',
      email: 'marcin@gmail.com',
      password: bcrypt.hashSync('test123'),
    },
    {
      name: 'Natalia',
      email: 'natalia@gmail.com',
      password: bcrypt.hashSync('test123'),
    },
  ],
  products: [
    {
      name: 'Cochon en epoxy',
      image: '/images/cochon.jpg',
      price: 3,
      countInStock: 5,
      rating: 4.8,
      numReviews: 13,
      description: 'Figurine de cochon en epoxy',
    },
    {
      name: 'Cerf en epoxy',
      image: '/images/deer.jpg',
      price: 3,
      countInStock: 5,
      rating: 4.7,
      numReviews: 10,
      description: 'Figurine de cerf en epoxy',
    },
    {
      name: 'Ours en epoxy',
      image: '/images/bear.jpg',
      price: 3,
      countInStock: 0,
      rating: 4.6,
      numReviews: 17,
      description: "Figurine d'ours en epoxy",
    },
    {
      name: 'Bulldog en epoxy',
      image: '/images/bulldog.jpg',
      price: 3,
      countInStock: 5,
      rating: 4.8,
      numReviews: 12,
      description: 'Figurine de bulldog en epoxy',
    },
    {
      name: 'Licorne en epoxy',
      image: '/images/unicorn.jpg',
      price: 3,
      countInStock: 5,
      rating: 4.5,
      numReviews: 13,
      description: 'Figurine de licorne en epoxy',
    },
    {
      name: 'Chat en epoxy',
      image: '/images/cat.jpg',
      price: 3,
      countInStock: 5,
      rating: 4.9,
      numReviews: 8,
      description: 'Figurine de chat en epoxy',
    },
    {
      name: 'Loup en epoxy',
      image: '/images/wolf.jpg',
      price: 3,
      countInStock: 5,
      rating: 4.5,
      numReviews: 6,
      description: 'Figurine de loup en epoxy',
    },
  ],
};

export default data;
