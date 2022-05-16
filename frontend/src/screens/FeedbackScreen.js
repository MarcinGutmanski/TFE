import React, { useContext, useState, useEffect } from 'react';
import { Store } from '../Store';
import { getError } from '../utils.js';
import { toast } from 'react-toastify';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';

export default function FeedbackScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [name] = useState(userInfo.name);
  const [email] = useState(userInfo.email);
  const [feedback, setFeedback] = useState('');
  const [order, setOrder] = useState('');
  const [orders, setOrders] = useState([]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        '/api/orders/feedback',
        {
          name,
          email,
          feedback,
          order,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );
      toast.success('Your feedback has been sent to the administrator!');
    } catch (err) {
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    const fecthOrders = async () => {
      try {
        const { data } = await axios.get('/api/orders/mine', {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        setOrders(data);
        console.log(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fecthOrders();
  }, [userInfo.token]);

  return (
    <div className="container small-container">
      <Helmet>
        <title>Feedback</title>
      </Helmet>
      <h1 className="my-3">Feedback</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control value={name} disabled />
        </Form.Group>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" value={email} disabled />
        </Form.Group>
        <Form.Group className="mb-3" controlId="category">
          <Form.Label>Select the order that went wrong</Form.Label>
          <Form.Select id="Select" onChange={(x) => setOrder(x.target.value)}>
            <option value="0">Select...</option>
            {orders.map((order) => (
              <option value={order._id}>{order._id.toString()}</option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3" controlId="description">
          <Form.Label>What went wrong with your order ?</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            required
            onChange={(x) => setFeedback(x.target.value)}
          />
        </Form.Group>
        <div className="mb-3">
          <Button type="submit">Send feedback</Button>
        </div>
      </Form>
    </div>
  );
}
