import bcrypt from 'bcryptjs';

const data = {
  roles: [
    {
      name: 'Admin',
    },
    {
      name: 'Member',
    },
    {
      name: 'Basic',
    },
  ],
  users: [
    {
      name: 'Marcin',
      email: 'guma091196@gmail.com',
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
      countInStock: 4,
      rating: 4.8,
      numReviews: 13,
      description: 'Figurine de cochon en epoxy',
      category: 'Figures',
    },
    {
      name: 'Cerf en epoxy',
      image: '/images/deer.jpg',
      price: 3,
      countInStock: 1,
      rating: 4.7,
      numReviews: 10,
      description: 'Figurine de cerf en epoxy',
      category: 'Figures',
    },
    {
      name: 'Ours en epoxy',
      image: '/images/bear.jpg',
      price: 3,
      countInStock: 0,
      rating: 4.6,
      numReviews: 17,
      description: "Figurine d'ours en epoxy",
      category: 'Figures',
    },
    {
      name: 'Bulldog en epoxy',
      image: '/images/bulldog.jpg',
      price: 3,
      countInStock: 5,
      rating: 4.8,
      numReviews: 12,
      description: 'Figurine de bulldog en epoxy',
      category: 'Figures',
    },
    {
      name: 'Licorne en epoxy',
      image: '/images/unicorn.jpg',
      price: 3,
      countInStock: 5,
      rating: 4.5,
      numReviews: 13,
      description: 'Figurine de licorne en epoxy',
      category: 'Figures',
    },
    {
      name: 'Chat en epoxy',
      image: '/images/cat.jpg',
      price: 3,
      countInStock: 5,
      rating: 4.9,
      numReviews: 8,
      description: 'Figurine de chat en epoxy',
      category: 'Figures',
    },
    {
      name: 'Loup en epoxy',
      image: '/images/wolf.jpg',
      price: 3,
      countInStock: 5,
      rating: 4.5,
      numReviews: 6,
      description: 'Figurine de loup en epoxy',
      category: 'Figures',
    },
    {
      name: 'Sous-verres vert-rouge',
      image: '/images/coaster1.jpg',
      price: 12,
      countInStock: 5,
      rating: 3.8,
      numReviews: 13,
      description: 'Sous-verres en epoxy de couleur verte/bordeau',
      category: 'Coasters',
    },
    {
      name: 'Sous-verres vert-noir',
      image: '/images/coaster2.jpg',
      price: 10,
      countInStock: 3,
      rating: 5,
      numReviews: 31,
      description: 'Sous-verres en epoxy de couleur verte/noire',
      category: 'Coasters',
    },
    {
      name: 'Sous-verres vert-bleu',
      image: '/images/coaster3.jpg',
      price: 8,
      countInStock: 15,
      rating: 3.5,
      numReviews: 17,
      description: 'Sous-verres en epoxy de couleur verte/bordeau',
      category: 'Coasters',
    },
  ],
};

export default data;
