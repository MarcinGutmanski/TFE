import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { getError } from '../utils.js';

export default function RoleScreen() {
  const [role, setRole] = useState('');
  const [user, setUser] = useState('');
  const [roles, setRoles] = useState([]);
  const params = useParams();
  const { id } = params;

  const { state } = useContext(Store);
  const { userInfo } = state;

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `/api/users/role/${id}`,
        {
          role,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );
      toast.success('Role modified succesfully!');
    } catch (err) {
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const { data } = await axios.get(`/api/users/roles`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        setRoles(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(`/api/users/${id}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        setUser(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchUser();
    fetchRoles();
  }, [id, userInfo]);

  return (
    <Container className="small-container">
      <Helmet>
        <title>Change Role</title>
      </Helmet>
      <h1 className="my-3">Change Role</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" disabled value={user.name} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="category">
          <Form.Label>Role</Form.Label>
          <Form.Select
            id="disabledSelect"
            onChange={(x) => setRole(x.target.value)}
          >
            {roles.map((role) => (
              <option value={role.name}>{role.name}</option>
            ))}
          </Form.Select>
        </Form.Group>
        <div className="mb-3">
          <Button type="submit">Change role</Button>
        </div>
      </Form>
    </Container>
  );
}
