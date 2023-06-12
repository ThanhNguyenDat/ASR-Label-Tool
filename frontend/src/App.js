import './App.css';
import { Admin, Resource, CustomRoutes, ListGuesser } from "react-admin";
import simpleRestProvider from './dataProvider';
import Dashboard from './pages/dashboard';
import { authProvider } from './authProvider';
import asrLabelling from './pages/projects/asr/labelling';

import { Layout } from './layouts';
import users from './pages/users';

let urlAPI = "http://0.0.0.0:6005/api/v1";
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
    </Admin>
  );
}

export default App;
