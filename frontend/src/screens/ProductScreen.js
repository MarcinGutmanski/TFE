import { useParams, useNavigate } from 'react-router-dom';
import React, { useReducer, useEffect, useContext, useState } from 'react';
import axios from 'axios';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Rating from '../components/Rating';
import Form from 'react-bootstrap/Form';
import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { getError } from '../utils.js';
import { Store } from '../Store';
import { toast } from 'react-toastify';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, product: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function ProductScreen() {
  const params = useParams();
  const navigate = useNavigate();
  const { name } = params;
  let [{ loading, error, product }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
    product: [],
  });
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(`/api/products/name/${name}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, [name]);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { basket, userInfo } = state;
  const addToBasketHandler = async () => {
    const existingItem = basket.basketItems.find((x) => x._id === product._id);
    const quantity = existingItem ? existingItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product.product._id}`);
    product = product.product;
    if (data.countInStock < quantity) {
      window.alert('Sorry, this product is out of stock.');
      return;
    }
    ctxDispatch({
      type: 'BASKET_ADD_ITEM',
      payload: { ...product, quantity },
    });
    navigate('/basket');
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `/api/products/rate/${product.product._id}`,
        {
          rating,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );
      window.location.reload(false);
    } catch (err) {
      toast.error(getError(err));
    }
  };

  const notifyUserHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `/api/products/notify/${product.product._id}`,
        {
          product,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );
      toast.success('You will be notified when the product is available!');
    } catch (err) {
      toast.error(getError(err));
    }
  };

  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <Row>
        <Col md={6}>
          <img
            className="img-large"
            src={product.product.image}
            alt={product.product.name}
          ></img>
        </Col>
        <Col md={3}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <Helmet>
                <title>{product.product.name}</title>
              </Helmet>
              <h1>{product.name}</h1>
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating
                rating={product.product.rating}
                numReviews={product.product.numReviews}
              ></Rating>
            </ListGroup.Item>
            <ListGroup.Item>Price: {product.product.price}€</ListGroup.Item>
            <ListGroup.Item>
              Description:
              <p>{product.product.description}</p>
            </ListGroup.Item>
            <ListGroup.Item>
              Sold by:
              <p>{product.user.name}</p>
            </ListGroup.Item>
            {userInfo && (
              <ListGroup.Item>
                <Form onSubmit={submitHandler}>
                  <Form.Group className="mb-3" controlId="rating">
                    <Form.Label>Rate this product :</Form.Label>
                    <Form.Select
                      aria-label="Rating"
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                    >
                      <option type="number" value="1">
                        1- Very bad
                      </option>
                      <option type="number" value="2">
                        2- Bad
                      </option>
                      <option type="number" value="3">
                        3- Mediocre
                      </option>
                      <option type="number" value="4">
                        4- Good
                      </option>
                      <option type="number" value="5">
                        5- Perfect
                      </option>
                    </Form.Select>
                  </Form.Group>
                  <div className="mb-3">
                    <Button type="submit">Rate</Button>
                  </div>
                </Form>
              </ListGroup.Item>
            )}
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Price:</Col>
                    <Col>{product.product.price}€</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Status:</Col>
                    <Col>
                      {product.product.countInStock > 0 ? (
                        <Badge bg="success">Available</Badge>
                      ) : (
                        <Badge bg="danger">Unavailable</Badge>
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>
                {product.product.countInStock > 0 ? (
                  <ListGroup.Item>
                    <div className="d-grid">
                      <Button onClick={addToBasketHandler} variant="primary">
                        Add to basket
                      </Button>
                    </div>
                  </ListGroup.Item>
                ) : (
                  <ListGroup.Item>
                    <div className="d-grid">
                      <Button onClick={notifyUserHandler} variant="primary">
                        Notify when available
                      </Button>
                    </div>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default ProductScreen;
