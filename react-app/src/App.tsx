import {useEffect, useState } from 'react'
import './App.css'

function App() {
  const [bcData, setBcData] = useState<any | null>(null);

interface BCDataType {
  [key: string]: any;
}

  useEffect(() => {
    const handler = (e: Event): void => {
      const customEvent = e as CustomEvent;
      setBcData(customEvent.detail);
      console.log(customEvent.detail);
    };
    window.addEventListener('BCData', handler);
    return () => {
      window.removeEventListener('BCData', handler);
    }
  }, []);

  return (
    <div className='primaryContainer'>
      <ul>
        {bcData.length > 0 ? (
          bcData.map((item: BCDataType, index: number) => (
            <li key={index}>{item.ItemNo} - {item.LocationCode}</li>
          ))
        ) : (
          <li>No data received</li>
        )}
      </ul>
      </div>
  )
}

export default App
