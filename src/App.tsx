import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './Components/ProtectedRoute';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Signup from './pages/Signup';
import ShoppingCart from './pages/ShoppingCart';
import ProductCatalogPage from './pages/ProductCatalogPage';
import CategoryManagementPage from './pages/CategoryManagementPage';
import ErrorPage from './pages/ErrorPage';
import BackendTestPage from './pages/BackendTestPage';
import AdminDashboard from './pages/Dashbord';
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <Toaster richColors position="top-right" />
      <AuthProvider>
        <CartProvider>
          <Router>
            <div className="w-screen">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/Auth" element={<Auth />} />
                <Route path="/Signup" element={<Signup />} />
                <Route path="/products" element={<ProductCatalogPage />} />
                <Route path="/cart" element={<ShoppingCart />} />
                <Route path="/error" element={<ErrorPage />} />
                <Route path="/test-backend" element={<BackendTestPage />} />
                
                {/* Protected Admin Routes */}
                <Route path="/admin/dashboard" element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/admin/categories" element={
                  <ProtectedRoute>
                    <CategoryManagementPage />
                  </ProtectedRoute>
                } />
              </Routes>
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </>
  );
}

export default App;
