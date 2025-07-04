'use client';

import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react'; // AG Grid React component
import { ModuleRegistry } from 'ag-grid-community';
import { ClientSideRowModelModule } from 'ag-grid-community';
import { themeAlpine } from 'ag-grid-community';
import { dld_data } from './data'

// Register the required module(s)
ModuleRegistry.registerModules([ClientSideRowModelModule]);

const DubailandTransactionsTable = ({ dld_name }) => {

  // State for grid data
  const [rowData, setRowData] = useState([]);
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const totalPages = Math.ceil(totalRecords / pageSize);
  const [loading, setLoading] = useState(false);

  // 3. Add a handler for pageSize change
  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when page size changes
  };

  const [columnDefs] = useState([
    { headerName: "Area/Community", field: "AREA_EN", sortable: true, filter: true },
    { headerName: "Transaction Date", field: "INSTANCE_DATE", sortable: true, filter: true },
    { headerName: "Usage", field: "USAGE_EN", sortable: true, filter: true },
    { headerName: "Amount", field: "TRANS_VALUE", sortable: true, filter: true },
    { headerName: "Area(sqm)", field: "ACTUAL_AREA", sortable: true, filter: true },
    { headerName: "Room(s)", field: "ROOMS_EN", sortable: true, filter: true },
    { headerName: "Project", field: "PROJECT_EN", sortable: true, filter: true },
  ]);

  // Default column definition with styling options
  const defaultColDef = {
    flex: 1,
    minWidth: 100,
    resizable: false,
    cellStyle: { padding: '10px', borderBottom: '1px solid #eee' },
    headerClass: 'my-custom-header'
  };

  // Helper to format a Date as MM/DD/YYYY
  const formatDate = (date) => {
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  };

  // Function to fetch data for a given page
  const fetchTransactions = async (page) => {
    try {
      setLoading(true); // Start loading
  
      const today = new Date();
      const oneWeekBefore = new Date();
      oneWeekBefore.setDate(today.getDate() - 7);
  
      const P_TO_DATE = formatDate(today);
      const P_FROM_DATE = formatDate(oneWeekBefore);
      const result = dld_data.find(item => item.NAME_EN === dld_name);

      console.log('dld_name', dld_name)
  
      const response = await fetch('https://gateway.dubailand.gov.ae/open-data/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "P_FROM_DATE": P_FROM_DATE,
          "P_TO_DATE": P_TO_DATE,
          "P_GROUP_ID": "",
          "P_IS_OFFPLAN": "",
          "P_IS_FREE_HOLD": "",
          "P_AREA_ID": result?.AREA_ID?.toString(),
          "P_USAGE_ID": "",
          "P_PROP_TYPE_ID": "",
          "P_TAKE": pageSize.toString(),
          "P_SKIP": ((page - 1) * pageSize).toString(),
          "P_SORT": "TRANSACTION_NUMBER_ASC"
        })
      });
  
      const data = await response.json();

      const results = data?.response?.result || [];
      setRowData(results);
  
      if (results.length > 0 && results[0].TOTAL) {
        setTotalRecords(parseInt(results[0].TOTAL));
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } 
    finally {
      setLoading(false); // End loading
    }
  };

  // Fetch data whenever currentPage changes
  useEffect(() => {
    fetchTransactions(currentPage);
  }, [currentPage, pageSize]);

  // Handlers for pagination buttons
  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className='dubailandTransactionsTable'>
      {loading ? (
        <div style={{ height: `${pageSize * 50 + 20}px`, width: '100%' }}>
          {[...Array(pageSize)].map((_, i) => (
            <div key={i} style={{
              height: '50px',
              background: '#f0f0f0',
              borderBottom: '1px solid #ddd',
              animation: 'pulse 1.5s infinite',
              display: 'flex',
              alignItems: 'center',
              padding: '0 10px'
            }}>
              <div style={{ width: '100%', height: '15px', background: '#e0e0e0', borderRadius: '4px' }}></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="ag-theme-alpine" style={{ height: `${pageSize * 50 + 55}px`, width: '100%' }}>
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            rowHeight={50}
            theme={themeAlpine}
          />
        </div>
      )}
      <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'row', justifyContent: "space-between" }}>
        <div>
          <label style={{ marginRight: '10px' }}>Rows per page: </label>
          <select value={pageSize} onChange={handlePageSizeChange}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
        <div>
          <button className='paginationButton' onClick={handlePrevious} disabled={currentPage === 1}>Previous</button>
          <span className='paginationInfo' style={{ margin: '0 10px' }}>
            Page {currentPage} of {totalPages}
          </span>
          <button className='paginationButton' onClick={handleNext} disabled={currentPage === totalPages}>Next</button>
        </div>
        <div>Source: Dubai Land Department</div>
      </div>
    </div>
  );
};

export default DubailandTransactionsTable;