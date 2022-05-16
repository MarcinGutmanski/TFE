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
      return { ...state, product: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function ProductModifyScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const params = useParams();
  const { id } = params;
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);

  const [{ loading, error, product }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
    product: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(`/api/products/${id}`);
        console.log(result);
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
        `/api/products/modify/${id}`,
        {
          name,
          price,
          quantity,
          description,
          category,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );
      toast.success('Product modified succesfully!');
    } catch (err) {
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    const fecthCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/categories`);
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fecthCategories();
  }, []);

  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div className="container small-container">
      <Helmet>
        <title>Add a product</title>
      </Helmet>
      <h1 className="my-3">Add a product</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            required
            defaultValue={product.name}
            onChange={(x) => setName(x.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="price">
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="number"
            min="1"
            step="any"
            required
            defaultValue={product.price}
            onChange={(x) => setPrice(x.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="quantity">
          <Form.Label>Quantity</Form.Label>
          <Form.Control
            type="number"
            min="1"
            required
            defaultValue={product.countInStock}
            onChange={(x) => setQuantity(x.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="description">
          <Form.Label>Describe the product</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            required
            defaultValue={product.description}
            onChange={(x) => setDescription(x.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="category">
          <Form.Label>Category</Form.Label>
          <Form.Select
            id="disabledSelect"
            defaultValue={product.category}
            onChange={(x) => setCategory(x.target.value)}
          >
            {categories.map((cat) => (
              <option value={cat}>{cat}</option>
            ))}
          </Form.Select>
        </Form.Group>
        <div className="mb-3">
          <Button variant="success" type="submit">
            Modify this product
          </Button>
        </div>
      </Form>
    </div>
  );
}
