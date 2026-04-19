import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { CartProvider } from './hooks/useCart';
import Header from './components/Header';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import { GlobalStyles } from './styles/GlobalStyles';
import ExperienceShowcase from './pages/ExperienceShowcase';
import FlakyLab from './pages/FlakyLab';
import PostLab from './pages/PostLab';
import TestEnv from "./pages/TestEnv";




const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <GlobalStyles />
          <div className="App">
            <Header />
            <main>
              <Routes>
                <Route path="/" caseSensitive={false} element={<Home />} />
                <Route path="/products" caseSensitive={false} element={<Products />} />
                <Route path="/products/:id" caseSensitive={false} element={<ProductDetail />} />
                <Route path="/login" caseSensitive={false} element={<Login />} />
                <Route path="/signup" caseSensitive={false} element={<Signup />} />
                <Route path="/experience" caseSensitive={false} element={<ExperienceShowcase />} />
                <Route path="/flaky-lab" caseSensitive={false} element={<FlakyLab />} />
                <Route path="/post-lab" caseSensitive={false} element={<PostLab />} />
                <Route path="/test-env" caseSensitive={false} element={<TestEnv />} />
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
                    <ProtectedRoute>
                      <Orders />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;