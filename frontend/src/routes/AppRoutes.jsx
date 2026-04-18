import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'
import MainLayout from '../layouts/MainLayout.jsx'
import AuthLayout from '../layouts/AuthLayout.jsx'
import AdminDashboardLayout from '../layouts/AdminDashboardLayout.jsx'
import ClientDashboardLayout from '../layouts/ClientDashboardLayout.jsx'
import Home from '../pages/Home.jsx'
import About from '../pages/About.jsx'
import Contact from '../pages/Contact.jsx'
import Login from '../pages/Login.jsx'
import Register from '../pages/Register.jsx'
import Products from '../pages/Products.jsx'
import ProductDetail from '../pages/ProductDetail.jsx'
import Cart from '../pages/Cart.jsx'
import AdminOverview from '../pages/admin/Overview.jsx'
import AdminProducts from '../pages/admin/Products.jsx'
import AdminUsers from '../pages/admin/Users.jsx'
import AdminCategories from '../pages/admin/Categories.jsx'
import AdminAnalytics from '../pages/admin/Analytics.jsx'
import ClientOverview from '../pages/client/Overview.jsx'
import ClientMyOrders from '../pages/client/MyOrders.jsx'
import ClientWishlist from '../pages/client/Wishlist.jsx'
import ClientTracking from '../pages/client/Tracking.jsx'
import ClientProfile from '../pages/client/Profile.jsx'
import ClientPaymentMethods from '../pages/client/PaymentMethods.jsx'

function DashboardShortcut() {
  const { isAuthenticated, user } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  const role = user?.role || 'client'
  return (
    <Navigate
      to={role === 'admin' ? '/admin/overview' : '/client/overview'}
      replace
    />
  )
}

function LegacySettingsRedirect() {
  const { isAuthenticated, user } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  const role = user?.role || 'client'
  return (
    <Navigate
      to={role === 'admin' ? '/admin/overview' : '/client/profile'}
      replace
    />
  )
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/dashboard" element={<DashboardShortcut />} />
        <Route path="/settings" element={<LegacySettingsRedirect />} />
      </Route>

      <Route element={<AdminDashboardLayout />}>
        <Route path="/admin/overview" element={<AdminOverview />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/categories" element={<AdminCategories />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />
        <Route path="/admin/profile" element={<ClientProfile />} />
      </Route>
      <Route path="/admin" element={<Navigate to="/admin/overview" replace />} />

      <Route element={<ClientDashboardLayout />}>
        <Route path="/client/overview" element={<ClientOverview />} />
        <Route path="/client/orders" element={<ClientMyOrders />} />
        <Route path="/client/wishlist" element={<ClientWishlist />} />
        <Route path="/client/tracking" element={<ClientTracking />} />
        <Route path="/client/profile" element={<ClientProfile />} />
        <Route
          path="/client/payment-methods"
          element={<ClientPaymentMethods />}
        />
      </Route>
      <Route path="/client" element={<Navigate to="/client/overview" replace />} />

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
