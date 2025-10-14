import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const rootElementId = (window.self !== window.top)
  ? "controlAddIn"
  : "root";

  const rootElement = document.getElementById(rootElementId);

  if (!rootElement) {
    throw new Error(`Root element with id "${rootElementId} not found`);
  }


  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  )
