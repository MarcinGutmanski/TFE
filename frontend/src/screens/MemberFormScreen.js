import React, { useContext, useState } from 'react';
import { Store } from '../Store';
import { getError } from '../utils.js';
import { toast } from 'react-toastify';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';

export default function MemberFormScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [name] = useState(userInfo.name);
  const [email] = useState(userInfo.email);
  const [description, setDescription] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        '/api/forms/submit',
        {
          name,
          email,
          description,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );
      toast.success('You applied succesfully!');
    } catch (err) {
      toast.error(getError(err));
    }
  };
  return (
    <div className="container small-container">
      <Helmet>
        <title>Become a Member</title>
      </Helmet>
      <h1 className="my-3">Become a member</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control value={name} disabled />
        </Form.Group>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" value={email} disabled />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>
            What kind of products would you sell as a member?
          </Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            required
            onChange={(x) => setDescription(x.target.value)}
          />
        </Form.Group>

        <div className="mb-3">
          <Button type="submit">Apply</Button>
        </div>
      </Form>
    </div>
  );
}
