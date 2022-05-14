import { useParams } from 'react-router-dom';
import { useReducer, useEffect, useState, useContext } from 'react';
import { Store } from '../Store';
import { getError } from '../utils.js';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, memberForm: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function MemberFormDetails() {
  const params = useParams();
  const { id } = params;
  const [{ loading, error, memberForm }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
    memberForm: [],
  });

  const [feedback, setFeedback] = useState('');
  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(`/api/forms/memberForm/${id}`);
        console.log(result.data);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, [id]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        '/api/users/addFromForm',
        {
          id: id,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );
      toast.success('Member added succesfully!');
    } catch (err) {
      toast.error(getError(err));
    }
  };

  const refuseMemberHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        '/api/users/declineFromForm',
        {
          id: id,
          feedback: feedback,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );
      toast.success('Membership declined!');
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
        <title>Become a Member</title>
      </Helmet>
      <h1 className="my-3">Become a member</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control value={memberForm.name} disabled />
        </Form.Group>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" value={memberForm.email} disabled />
        </Form.Group>
        <Form.Group className="mb-3" controlId="description">
          <Form.Label>
            What kind of products would you sell as a member?
          </Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            required
            value={memberForm.description}
            disabled
          />
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
            Accept
          </Button>
        </div>
        <div className="mb-3">
          <Button variant="danger" onClick={refuseMemberHandler}>
            Decline
          </Button>
        </div>
      </Form>
    </div>
  );
}
