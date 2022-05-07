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

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, forms: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

export default function MemberFormListScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [{ loading, error, forms }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get('/api/forms/admin', {
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

  return (
    <div>
      <Helmet>
        <title>Member Forms</title>
      </Helmet>
      <h1 className="my-3">Member Forms</h1>
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
              <th>Email</th>
              <th>Accepted</th>
            </tr>
          </thead>
          <tbody>
            {forms.map((form) => (
              <tr key={form._id}>
                <td>{form._id}</td>
                <td>{form.name}</td>
                <td>{form.email}</td>
                <td>{form.isAccepted ? 'Yes' : 'No'}</td>
                <td>
                  <Button>
                    <Link
                      to={`/forms/${form._id}`}
                      style={{
                        textDecoration: 'none',
                        color: '#FFFFFF',
                      }}
                    >
                      <Card.Title style={{ fontSize: '16px' }}>
                        Details
                      </Card.Title>
                    </Link>
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
