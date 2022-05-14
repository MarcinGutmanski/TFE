import { useParams } from 'react-router-dom';
import { useReducer, useEffect, useContext, useState } from 'react';
import { Store } from '../Store';
import { getError } from '../utils.js';
import { toast } from 'react-toastify';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Helmet } from 'react-helmet-async';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, productForm: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function ProductFormDetails() {
  const params = useParams();
  const { id } = params;
  const [{ loading, error, productForm }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
    productForm: [],
  });
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        var result = await axios.get(`/api/forms/productForm/${id}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, [id]);

  const { state } = useContext(Store);
  const { userInfo } = state;

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        '/api/products/addFromForm',
        {
          id: id,
          name: productForm.name,
          price: productForm.price,
          quantity: productForm.quantity,
          description: productForm.description,
          category: productForm.category,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );
      toast.success('Product added succesfully!');
    } catch (err) {
      toast.error(getError(err));
    }
  };

  const refuseProductHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        '/api/products/declineFromForm',
        {
          id: id,
          feedback: feedback,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );
      toast.success('Product declined!');
    } catch (err) {
      toast.error(getError(err));
    }
  };

  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div className="container small-container">
      <Helmet>
        <title>Sumbitted product</title>
      </Helmet>
      <h1 className="my-3">Submitted product</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" value={productForm.name} disabled />
        </Form.Group>
        <Form.Group className="mb-3" controlId="price">
          <Form.Label>Price</Form.Label>
          <Form.Control type="number" value={productForm.price} disabled />
        </Form.Group>
        <Form.Group className="mb-3" controlId="quantity">
          <Form.Label>Quantity</Form.Label>
          <Form.Control type="number" value={productForm.quantity} disabled />
        </Form.Group>
        <Form.Group className="mb-3" controlId="description">
          <Form.Label>Describe the product</Form.Label>
          <Form.Control
            as="textarea"
            value={productForm.description}
            disabled
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="category">
          <Form.Label>Category</Form.Label>
          <Form.Control type="text" value={productForm.category} disabled />
        </Form.Group>
        <Form.Group className="mb-3" controlId="feedback">
          <Form.Label>Feedback</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            onChange={(x) => setFeedback(x.target.value)}
          />
        </Form.Group>
        <div className="mb-3">
          <Button variant="success" type="submit">
            Add this product
          </Button>
        </div>
        <div className="mb-3">
          <Button variant="danger" onClick={refuseProductHandler}>
            Decline product
          </Button>
        </div>
      </Form>
    </div>
  );
}
