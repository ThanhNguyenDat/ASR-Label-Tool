import logo from './logo.svg';
import './App.css';
import { Admin, Resource } from "react-admin";
// import jsonServerProvider from "ra-data-json-server";
import jsonServerProvider from './dataProvider.ts';

import UserList from './components/UserList';
import UserEdit from './components/UserEdit';
import UserCreate from './components/UserCreate';

let urlAPI;
// urlAPI = "https://jsonplaceholder.typicode.com";
urlAPI = "http://0.0.0.0:6002/api/v1";

const dataProvider = jsonServerProvider(urlAPI);

function App() {
  return (
    <div className="App">
      <Admin dataProvider={dataProvider}>
        <Resource name="users" list={UserList} create={UserCreate} edit={UserEdit}/>
      </Admin>
    </div>
  );
}

export default App;
