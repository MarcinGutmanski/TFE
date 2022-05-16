import React, { useEffect, useReducer } from 'react';
import { useParams } from 'react-router-dom';
import { getError } from '../utils.js';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, feedback: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function FeedbackDetailsScreen() {
  const params = useParams();
  const { id } = params;
  const [{ loading, error, feedback }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
    feedback: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(`/api/feedbacks/${id}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, [id]);

  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div className="container small-container">
      <Helmet>
        <title>Feedback</title>
      </Helmet>
      <h1 className="my-3">Feedback</h1>
      <Form>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control value={feedback.name} disabled />
        </Form.Group>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" value={feedback.email} disabled />
        </Form.Group>
        <Form.Group className="mb-3" controlId="order">
          <Form.Label>Select the order that went wrong : </Form.Label>
          <Form.Control type="text" value={feedback.order} disabled />
        </Form.Group>
        <Button>
          <Link
            to={`/order/${feedback.order}`}
            style={{ textDecoration: 'none', color: '#FFFFFF' }}
          >
            <Card.Title style={{ fontSize: '16px' }}>See the order</Card.Title>
          </Link>
        </Button>
        <Form.Group className="mb-3" controlId="description">
          <Form.Label>What went wrong with your order ?</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            required
            disabled
            value={feedback.feedback}
          />
        </Form.Group>
      </Form>
    </div>
  );
}
