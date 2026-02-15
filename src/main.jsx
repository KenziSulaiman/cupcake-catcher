import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { SafetyProvider } from './context/SafetyContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <SafetyProvider>
        <App />
      </SafetyProvider>
    </AuthProvider>
  </StrictMode>,
)
