import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const rootElementId = (window.self !== window.top)
  ? "controlAddIn"
  : "root";


function mountApp() {
  const container = document.getElementById(rootElementId)
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

document.addEventListener('DOMContentLoaded', mountApp);

(window as any).SendDataToReact = (jsonData:string) => {
  try {
    const data = JSON.parse(jsonData);

    const event = new CustomEvent('BCData', { detail: data });
      window.dispatchEvent(event);
  } catch (e) {
    console.error('Invalid Json from BC:', e, jsonData);
  }
}