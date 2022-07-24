import './App.scss';
import { Loading } from './components/Loading/Loading';
import { Table } from './components/Table/Table';
import { useFetch } from './hooks/useFetch';
import { filterTable } from './utils/filter';
import { sortTable } from './utils/sortTable';


function App() {
  const host = "http://localhost:8081/api/table";
  const [table] = useFetch(host);

  const filter = filterTable;

  const sortFunc = sortTable;

  
  return (
    <div className="main">
      {table?
      <Table table={table.table} 
              columns={table.columns} 
              filterFunc={filter} 
              sortFunc={sortFunc}
              sortedColumnNumber={1}
                        />
        :
        <Loading/>
        }
    </div>
  );
}

export default App;
