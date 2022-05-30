import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { getError } from '../utils.js';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/users/reset', {
        email,
        name,
      });
      toast.success('Your new password has been sent via email!');
    } catch (err) {
      toast.error(getError(err));
    }
  };

  return (
    <Container className="small-container">
      <Helmet>
        <title>Reset password</title>
      </Helmet>
      <h1 className="my-3">Reset password</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            required
            onChange={(x) => setName(x.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            required
            onChange={(x) => setEmail(x.target.value)}
          />
        </Form.Group>
        <div className="mb-3">
          <Button type="submit">Reset your password</Button>
        </div>
      </Form>
    </Container>
  );
}
