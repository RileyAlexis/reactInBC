import { useEffect, useState } from 'react'
import './App.css'
import { GetMockData } from './Components/GetMockData';

// BC Record Types
export interface BCField {
  id: number;
  name: string;
  type: string;
  value: any;
}

export interface BCPrimaryKey {
  fieldCount: number;
  fields: BCField[];
}

export interface BCRecord {
  id: number;
  name: string;
  company: string;
  position: string;
  recordId: string;
  primaryKey: BCPrimaryKey;
  fields: BCField[];
}

export interface SimpleRecord {
  recordLine: number;
  tableName: string;
  company: string;
  recordId: string;
  [key: string]: any;
}

function App() {
  const [_, setRecords] = useState<SimpleRecord[]>([]);

  useEffect(() => {
    const handler = (e: Event): void => {
      const customEvent = e as CustomEvent;
      setRecords(customEvent.detail);
      console.log(customEvent.detail);
    };
    window.addEventListener('BCData', handler);
    return () => {
      window.removeEventListener('BCData', handler);
    }
  }, []);

  return (
    <div className='primaryContainer'>
      <GetMockData />
    </div>
  )
}

export default App
