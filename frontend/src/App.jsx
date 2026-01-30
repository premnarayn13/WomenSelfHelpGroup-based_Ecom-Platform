import { Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductList from './pages/ProductList';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderHistory from './pages/OrderHistory';
import OrderTracking from './pages/OrderTracking';
import SHGDashboard from './pages/SHGDashboard';
import SHGOrders from './pages/SHGOrders';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import AddProduct from './pages/AddProduct';
import CreateOpenOrder from './pages/CreateOpenOrder';
import CustomerOpenOrders from './pages/CustomerOpenOrders';
import OpenOrderList from './pages/OpenOrderList';
import Notifications from './pages/Notifications';
import SHGOnboarding from './pages/SHGOnboarding';
import SHGInventory from './pages/SHGInventory';
import SHGDirectory from './pages/SHGDirectory';



function App() {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/products" element={<ProductList />} />
                    <Route path="/communities" element={<SHGDirectory />} />
                    <Route path="/products/:id" element={<ProductDetails />} />

                    {/* Protected Customer Routes */}
                    <Route
                        path="/cart"
                        element={
                            <ProtectedRoute>
                                <Cart />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/checkout"
                        element={
                            <ProtectedRoute>
                                <Checkout />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/orders"
                        element={
                            <ProtectedRoute allowedRoles={['customer']}>
                                <OrderHistory />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/orders/:id"
                        element={
                            <ProtectedRoute>
                                <OrderTracking />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/notifications"
                        element={
                            <ProtectedRoute>
                                <Notifications />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/open-orders/create"
                        element={
                            <ProtectedRoute allowedRoles={['customer']}>
                                <CreateOpenOrder />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/open-orders/my"
                        element={
                            <ProtectedRoute allowedRoles={['customer']}>
                                <CustomerOpenOrders />
                            </ProtectedRoute>
                        }
                    />

                    {/* SHG Routes */}
                    <Route
                        path="/shg/onboarding"
                        element={
                            <ProtectedRoute allowedRoles={['shg']}>
                                <SHGOnboarding />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/shg/inventory"
                        element={
                            <ProtectedRoute allowedRoles={['shg']}>
                                <SHGInventory />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/shg/dashboard"
                        element={
                            <ProtectedRoute allowedRoles={['shg']}>
                                <SHGDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/shg/orders"
                        element={
                            <ProtectedRoute allowedRoles={['shg']}>
                                <SHGOrders />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/shg/products/add"
                        element={
                            <ProtectedRoute allowedRoles={['shg']}>
                                <AddProduct />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/open-orders"
                        element={
                            <ProtectedRoute allowedRoles={['shg']}>
                                <OpenOrderList />
                            </ProtectedRoute>
                        }
                    />

                    {/* Admin Routes */}
                    <Route
                        path="/admin/dashboard"
                        element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </main>
            <Footer />
        </div>
    );
}

export default App;
