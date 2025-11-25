import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

declare global {
  interface Window {
    downloadBCData: (tableNumber?: number) => void;
    SendDataToReact: (jsonData: string) => void;
  }
}

const rootElementId = (window.self !== window.top)
  ? "controlAddIn"
  : "root";

let capturedBCData: Map<number, any> = new Map();

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

(window as any).SendDataToReact = (jsonData: string) => {
  try {
    const data = JSON.parse(jsonData);

    console.log(typeof data, data.length);
    console.log('parsed data from BC', data);

    const event = new CustomEvent('BCData', { detail: data });
    window.dispatchEvent(event);
  } catch (e) {
    console.error('Invalid Json from BC:', e, jsonData);
  }
};

window.addEventListener('BCData', (event: CustomEvent) => {
  const dataArray = event.detail[0];

  if (Array.isArray(dataArray) && dataArray.length > 1) {
    const header = dataArray[0];
    // const records = dataArray.slice(1);
    const tableNumber = header.tableNumber || 'unknown';

    capturedBCData.set(tableNumber, dataArray);
    console.log(`✅ Captured table ${tableNumber} (${header.tableName}), ${dataArray.length} records`);
  } else if (Array.isArray(dataArray) && dataArray.length === 1) {
    // Only header, no records
    const header = dataArray[0];
    const tableNumber = header.tableNumber || 'unknown';
    capturedBCData.set(tableNumber, []);
    console.log(`✅ Captured table ${tableNumber} (${header.tableName}), 0 records`);
  } else {
    const tableNumber = dataArray.id || 'unknown';
    capturedBCData.set(tableNumber, [dataArray]);
    console.log(`✅ Captured table ${tableNumber}`);
  }
});

window.downloadBCData = function downloadBCData(tableNumber?: number) {
  let dataToDownload = tableNumber
    ? capturedBCData.get(tableNumber)
    : Object.fromEntries(capturedBCData);

  if (!dataToDownload) {
    console.error(`❌ No data captured for table ${tableNumber}`);
    return;
  }

  const blob = new Blob([JSON.stringify(dataToDownload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${tableNumber || 'allMockData'}.json`;
  link.click();
  URL.revokeObjectURL(url);
  console.log(`Downloaded ${link.download}`);
};

console.log('downloadBCData assigned:', typeof window.downloadBCData);

