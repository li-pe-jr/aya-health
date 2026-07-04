import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { AyaProvider } from '@/lib/store'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AyaProvider>
        <App />
      </AyaProvider>
    </BrowserRouter>
  </StrictMode>,
)
