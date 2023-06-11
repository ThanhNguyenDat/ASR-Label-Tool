import './App.css';
import { Admin, Resource, CustomRoutes, ListGuesser } from "react-admin";
import simpleRestProvider from './dataProvider';
import Dashboard from './pages/dashboard';
import { authProvider } from './authProvider';
import asrLabelling from './pages/projects/asr/labelling';

import { Layout } from './layouts';

let urlAPI = "http://0.0.0.0:6002/api/v1";
const dataProvider = simpleRestProvider(urlAPI)
function App() {
  return (
    <Admin 
      authProvider={authProvider}
      dataProvider={dataProvider} 
      dashboard={Dashboard}
      layout={Layout}
    >
      <Resource name="users" list={ListGuesser}/>
      <Resource name="asr" {...asrLabelling} />
    </Admin>
  );
}

export default App;
