import './App.css';
import { Admin, Resource, CustomRoutes, ListGuesser } from "react-admin";
import simpleRestProvider from './dataProvider';
import Dashboard from './pages/dashboard';
import { authProvider } from './authProvider';
import { Layout } from './layouts';

import users from './pages/users';
import asrLabelling from './pages/projects/asr/labelling';
import bigTable from './pages/projects/asr/bigTable';

let urlAPI = "http://0.0.0.0:6002/api/v1"; // native
// let urlAPI = "http://0.0.0.0:8000/react_admin/api" // Kong

const dataProvider = simpleRestProvider(urlAPI)
function App() {
  return (
    <Admin 
      authProvider={authProvider}
      dataProvider={dataProvider} 
      dashboard={Dashboard}
      layout={Layout}
    >
      <Resource name="users" {...users}/>
      <Resource name="asr_segments" {...asrLabelling} />
      <Resource name="asr_big_table" {...bigTable}/>
    </Admin>
  );
}

export default App;
