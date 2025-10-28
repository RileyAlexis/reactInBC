import {useEffect, useState } from 'react'
import './App.css'

function App() {
  const [bcData, setBcData] = useState<any | null>(null);

  useEffect(() => {
  const handler = (e: Event): void => {
    const customEvent = e as CustomEvent;
    setBcData(customEvent.detail);
    console.log(bcData);
  };
  window.addEventListener('BCData', handler);
  return () => {
    window.removeEventListener('BCData', handler);
  }
}, [bcData]);

  return (
    <div>
      <ul>
      {bcData &&
      bcData.map((item:any) => {
        <li>{item}</li>
      })
    }
    </ul>
      </div>
  )
}

export default App
