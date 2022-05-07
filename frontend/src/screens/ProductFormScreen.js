import React, { useContext, useState, useEffect } from 'react';
import { Store } from '../Store';
import { getError } from '../utils.js';
import { toast } from 'react-toastify';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';

export default function ProductFormScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        '/api/forms/addProduct',
        {
          name,
          price,
          quantity,
          description,
          category,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );
      toast.success('Product submited succesfully!');
    } catch (err) {
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    const fecthCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/categories`);
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fecthCategories();
  }, []);
  return (
    <div className="container small-container">
      <Helmet>
        <title>Add a product</title>
      </Helmet>
      <h1 className="my-3">Add a product</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            required
            onChange={(x) => setName(x.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="price">
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="number"
            min="1"
            step="any"
            required
            onChange={(x) => setPrice(x.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="quantity">
          <Form.Label>Quantity</Form.Label>
          <Form.Control
            type="number"
            min="1"
            required
            onChange={(x) => setQuantity(x.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="description">
          <Form.Label>Describe the product</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            required
            onChange={(x) => setDescription(x.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="category">
          <Form.Label>Category</Form.Label>
          <Form.Select
            id="disabledSelect"
            onChange={(x) => setCategory(x.target.value)}
          >
            {categories.map((cat) => (
              <option value={cat}>{cat}</option>
            ))}
            <option value={'Other'}>Other</option>
          </Form.Select>
        </Form.Group>
        <div className="mb-3">
          <Button type="submit">Submit a product</Button>
        </div>
      </Form>
    </div>
  );
}
