import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

function mountApp() {
  const container = document.getElementById('controlAddIn')
  if (container) {
    createRoot(container).render(
      <StrictMode>
        <App />
      </StrictMode>,
    )
  } else {
    // Retry after a short delay if container is not yet present
    setTimeout(mountApp, 50)
  }
}

document.addEventListener('DOMContentLoaded', mountApp)
