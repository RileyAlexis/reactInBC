import type React from "react";
import { useState } from "react";

import { getTableData } from "../modules/bcCalls";


export const GetMockData: React.FC = () => {

    const [table, setTable] = useState<number>(0);
    const [maxRecords, setMaxRecords] = useState<number>(5);

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        getTableData(table, maxRecords);
    }

    const handleDownload = () => {
        window.downloadBCData(table);
    }

    return (
        <div style={{ margin: '2em' }}>
            <form>
                <label>Table Number:</label>
                <input placeholder="Table Number" value={table} onChange={(e) => setTable(Number(e.target.value))} />
                <label>Max # of Records</label>
                <input placeholder="Max # of Records" value={maxRecords} onChange={(e) => setMaxRecords(Number(e.target.value))} />
                <button type="submit" onClick={handleSubmit}>Submit</button>
            </form>
            <button onClick={handleDownload}>Download</button>
        </div>
    )
}