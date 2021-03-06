import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import BasketScreen from './screens/BasketScreen';
import SignInScreen from './screens/SignInScreen';
import SignUpScreen from './screens/SignUpScreen';
import ShippingAddressScreen from './screens/ShippingAddressScreen';
import PaymentMethodScreen from './screens/PaymentMethodScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import UserProfileScreen from './screens/UserProfileScreen';
import SearchScreen from './screens/SearchScreen';
import ProductListScreen from './screens/ProductListScreen';
import OrderListScreen from './screens/OrderListScreen';
import UserListScreen from './screens/UserListScreen';
import MemberFormScreen from './screens/MemberFormScreen';
import MemberFormListScreen from './screens/MemberFormListScreen';
import ProductAddScreen from './screens/ProductAddScreen';
import ProductModifyScreen from './screens/ProductModifyScreen';
import ProductFormScreen from './screens/ProductFormScreen';
import ProductFormListScreen from './screens/ProductFormListScreen';
import MemberFormDetails from './screens/MemberFormDetails';
import ProductFormDetails from './screens/ProductFormDetails';
import RoleScreen from './screens/RoleScreen';
import FeedbackScreen from './screens/FeedbackScreen';
import FeedbackListScreen from './screens/FeedbackListScreen';
import FeedbackDetailsScreen from './screens/FeedbackDetailsScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import MemberRoute from './components/MemberRoute';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap';
import Nav from 'react-bootstrap/Nav';
import Badge from 'react-bootstrap/Badge';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { Store } from './Store';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SearchBox from './components/SearchBox';

function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { basket, userInfo } = state;

  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
    window.location.href = '/signin';
  };

  return (
    <BrowserRouter>
      <div>
        <ToastContainer position="bottom-center" limit={1} />
        <header>
          <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
              <LinkContainer to="/">
                <Navbar.Brand>Cr??amates</Navbar.Brand>
              </LinkContainer>
              <Navbar.Collapse id="basic-navbar-nav">
                <SearchBox />
                <Nav className="me-auto w-100 justify-content-end">
                  {userInfo && userInfo.role !== 'Admin' && (
                    <Link to="/feedback" className="nav-link">
                      Feedback
                    </Link>
                  )}
                  {userInfo && userInfo.role === 'Basic' && (
                    <Link to="/memberForm" className="nav-link">
                      Become a member
                    </Link>
                  )}
                  {userInfo && userInfo.role === 'Member' && (
                    <Link to="/productForm" className="nav-link">
                      Submit a product
                    </Link>
                  )}
                  <Link to="/basket" className="nav-link">
                    Basket
                    {basket.basketItems.length > 0 && (
                      <Badge pill bg="danger">
                        {basket.basketItems.reduce((a, c) => a + c.quantity, 0)}
                      </Badge>
                    )}
                  </Link>
                  {userInfo ? (
                    <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                      <LinkContainer to="/profile">
                        <NavDropdown.Item>User profile</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/orderHistory">
                        <NavDropdown.Item>Order History</NavDropdown.Item>
                      </LinkContainer>
                      <NavDropdown.Divider />
                      <Link
                        className="dropdown-item"
                        to="#signout"
                        onClick={signoutHandler}
                      >
                        Sign Out
                      </Link>
                    </NavDropdown>
                  ) : (
                    <Link className="nav-link" to="/signin">
                      Sign In
                    </Link>
                  )}
                  {userInfo && userInfo.role === 'Admin' && (
                    <NavDropdown title="Admin" id="admin-nav-dropdown">
                      <LinkContainer to="/admin/productList">
                        <NavDropdown.Item>Products</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/orderList">
                        <NavDropdown.Item>Orders</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/userList">
                        <NavDropdown.Item>Users</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/feedbacks">
                        <NavDropdown.Item>Feedbacks</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/memberForms">
                        <NavDropdown.Item>Member Forms</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/productForms">
                        <NavDropdown.Item>Product Forms</NavDropdown.Item>
                      </LinkContainer>
                    </NavDropdown>
                  )}
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </header>
        <main>
          <Container className="mt-3">
            <Routes>
              <Route path="/product/:name" element={<ProductScreen />} />
              <Route path="/basket" element={<BasketScreen />} />
              <Route path="/signin" element={<SignInScreen />} />
              <Route path="/reset" element={<ResetPasswordScreen />} />
              <Route path="/signup" element={<SignUpScreen />} />
              <Route path="/shipping" element={<ShippingAddressScreen />} />
              <Route path="/payment" element={<PaymentMethodScreen />} />
              <Route path="/placeOrder" element={<PlaceOrderScreen />} />
              <Route
                path="/feedback"
                element={
                  <ProtectedRoute>
                    <FeedbackScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/order/:id"
                element={
                  <ProtectedRoute>
                    <OrderScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orderHistory"
                element={
                  <ProtectedRoute>
                    <OrderHistoryScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <UserProfileScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/memberForm"
                element={
                  <ProtectedRoute>
                    <MemberFormScreen />
                  </ProtectedRoute>
                }
              />
              <Route path="/search" element={<SearchScreen />} />
              {/* Admin Routes */}
              <Route
                path="/admin/productList"
                element={
                  <AdminRoute>
                    <ProductListScreen />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/feedbacks"
                element={
                  <AdminRoute>
                    <FeedbackListScreen />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/orderList"
                element={
                  <AdminRoute>
                    <OrderListScreen />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/userList"
                element={
                  <AdminRoute>
                    <UserListScreen />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/memberForms"
                element={
                  <AdminRoute>
                    <MemberFormListScreen />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/productForms"
                element={
                  <AdminRoute>
                    <ProductFormListScreen />
                  </AdminRoute>
                }
              />
              <Route
                path="/products/add"
                element={
                  <AdminRoute>
                    <ProductAddScreen />
                  </AdminRoute>
                }
              />
              <Route
                path="/product/modify/:id"
                element={
                  <AdminRoute>
                    <ProductModifyScreen />
                  </AdminRoute>
                }
              />
              <Route
                path="/forms/memberForm/:id"
                element={
                  <AdminRoute>
                    <MemberFormDetails />
                  </AdminRoute>
                }
              />
              <Route
                path="/forms/productForm/:id"
                element={
                  <AdminRoute>
                    <ProductFormDetails />
                  </AdminRoute>
                }
              />
              <Route
                path="/feedback/:id"
                element={
                  <AdminRoute>
                    <FeedbackDetailsScreen />
                  </AdminRoute>
                }
              />
              <Route
                path="/users/role/:id"
                element={
                  <AdminRoute>
                    <RoleScreen />
                  </AdminRoute>
                }
              />
              {/* Parrain?? Routes */}
              <Route
                path="/productForm"
                element={
                  <MemberRoute>
                    <ProductFormScreen />
                  </MemberRoute>
                }
              />
              <Route path="/" element={<HomeScreen />} />
            </Routes>
          </Container>
        </main>
        <footer>
          <div className="text-center">All rights reserved.</div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
