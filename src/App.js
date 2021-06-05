import React, { useEffect, useState } from 'react';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import './App.css';

function App() {
  const [gridApi, setGridApi] = useState(null);
  const perPage = 3;

  const onGridReady = (params) => {
    setGridApi(params.api);
  };

  useEffect(() => {
    if (gridApi) {
      const dataSource = {
        getRows: (params) => {
          // Use startRow and endRow for sending pagination to Backend
          // params.startRow : Start Page
          // params.endRow : End Page

          const page = params.endRow / perPage;
          fetch(`https://reqres.in/api/users?per_page=${perPage}&page=${page}`)
            .then(resp => resp.json())
            .then(res => {
              params.successCallback(res.data, res.total);
            }).catch(err => {
              params.successCallback([], 0);
            });
        }
      }

      gridApi.setDatasource(dataSource);
    }
  }, [gridApi]);

  const avatarFormatter = ({ value }) => {
    return <img src={value} width="50px" height="50px" />
  }

  return (
    <div className="App">
      <h2>Server side pagination in the React AG Grid - <a href="https://www.cluemediator.com" target="_blank">Clue Mediator</a></h2>
      <div className="ag-theme-alpine ag-style">
        <AgGridReact
          pagination={true}
          rowModelType={'infinite'}
          paginationPageSize={perPage}
          cacheBlockSize={perPage}
          onGridReady={onGridReady}
          rowHeight={60}
          defaultColDef={{ flex: 1 }}
        >
          <AgGridColumn field="first_name" headerName="First Name" cellClass="vertical-middle" />
          <AgGridColumn field="last_name" headerName="Last Name" cellClass="vertical-middle" />
          <AgGridColumn field="email" headerName="Email" cellClass="vertical-middle" />
          <AgGridColumn field="avatar" headerName="Avatar" cellRendererFramework={avatarFormatter} cellClass="vertical-middle" />
        </AgGridReact>
      </div>
    </div>
  );
}

export default App;
