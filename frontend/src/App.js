import './App.css';
import { Admin, Resource, CustomRoutes, ListGuesser } from "react-admin";
import simpleRestProvider from './dataProvider';
import Dashboard from './pages/dashboard';
import { authProvider } from './authProvider';
import { Layout } from './layouts';

import users from './pages/users';
import asrSegments from './pages/projects/asr/asr_segments';
import asrLabel from './pages/projects/asr/asr_label';
import routes from './config/routes';

let urlAPI = "http://0.0.0.0:6002/api/v1"; // native
// let urlAPI = "http://0.0.0.0:8000/react_admin/api" // Kong

// let urlAPI = "http://10.40.34.15:7223";

const dataProvider = simpleRestProvider(urlAPI)
function App() {
  return (
    <Admin 
      authProvider={authProvider}
      dataProvider={dataProvider} 
      dashboard={Dashboard}
      layout={Layout}
    >
      <Resource name={routes.users.name} {...users}/>

      <Resource name={routes.asr_segments.name} {...asrSegments} />
      <Resource name={routes.asr_label.name} {...asrLabel}/>
    </Admin>
  );
}

export default App;
