import { Routes, Route } from 'react-router-dom'
import Create from './Create';
import CustomTable from './CustomTable';

function App(){
    return (
         <Routes>
             <Route path='/' element={<CustomTable />} />
             <Route path='/create' element={<Create />}/>
         </Routes>
    )
}

export default App;
