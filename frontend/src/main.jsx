import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthProvider.jsx'
import { CartProvider } from './context/CartProvider.jsx'
import { WishlistProvider } from './context/WishlistProvider.jsx'
import { OrdersProvider } from './context/OrdersProvider.jsx'
import { ToastProvider } from './context/ToastProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <OrdersProvider>
              <ToastProvider>
                <App />
              </ToastProvider>
            </OrdersProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
