import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { Toaster } from 'react-hot-toast'
import { BrowserRouter } from 'react-router-dom'
import LanguageProvider from './contexts/LanguageContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>

      <AuthProvider>
        <BrowserRouter>
          <App />
          <Toaster
            position="top-center"
            reverseOrder={false}
            toastOptions={{
              duration: 4000,
              className: 'font-arabic',
              style: {
                direction: 'rtl',
                fontFamily: 'Cairo, sans-serif',
              },
              success: {
                style: {
                  background: '#10b981',
                  color: 'white',
                },
              },
              error: {
                style: {
                  background: '#ef4444',
                  color: 'white',
                },
              },
              loading: {
                style: {
                  background: '#6b7280',
                  color: 'white',
                },
              },
            }}
          />
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>

  </StrictMode>,
)
