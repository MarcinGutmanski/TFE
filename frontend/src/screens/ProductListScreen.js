import React, { useContext, useReducer, useEffect } from 'react';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { getError } from '../utils.js';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, products: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

export default function ProductListScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get('/api/products/admin', {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(error),
        });
      }
    };
    fetchData();
  }, [userInfo]);

  const deleteProductHandler = async (e) => {
    e.preventDefault();
    try {
      console.log(userInfo.token);
      await axios.post(`/api/products/delete/${e.target.value}`, {
        headers: { authorization: `Bearer ${userInfo.token}` },
      });
      window.location.reload(false);
    } catch (err) {
      toast.error(getError(err));
    }
  };

  return (
    <div>
      <Helmet>
        <title>Products</title>
      </Helmet>
      <div>
        <h1 className="my-3">Products </h1>
        <Button>
          <Link
            to={`/products/add`}
            style={{ textDecoration: 'none', color: '#FFFFFF' }}
          >
            <Card.Title style={{ fontSize: '16px' }}>Add product</Card.Title>
          </Link>
        </Button>
      </div>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Price</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product._id}</td>
                <td>{product.name}</td>
                <td>{product.price.toFixed(2)}???</td>
                <td>{product.countInStock}</td>
                <td>
                  <Button>
                    <Link
                      to={`/product/modify/${product._id}`}
                      style={{ textDecoration: 'none', color: '#FFFFFF' }}
                    >
                      <Card.Title style={{ fontSize: '16px' }}>
                        Modify
                      </Card.Title>
                    </Link>
                  </Button>
                </td>
                <td>
                  <Button>
                    <Link
                      to={`/product/${product.name}`}
                      style={{ textDecoration: 'none', color: '#FFFFFF' }}
                    >
                      <Card.Title style={{ fontSize: '16px' }}>
                        Details
                      </Card.Title>
                    </Link>
                  </Button>
                </td>
                <td>
                  <Button
                    variant="light"
                    value={product._id}
                    onClick={deleteProductHandler}
                  >
                    <i className="fas fa-trash"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
