import "./App.css";
import { Admin, Resource } from "react-admin";
import simpleRestProvider from "./dataProvider";
import Dashboard from "./pages/dashboard";
import { authProvider } from "./authProvider";
import { Layout } from "./layouts";

import users from "./pages/users";
import asrSegments from "./pages/projects/asr/asr_segments";
import asrLabel from "./pages/projects/asr/asr_label";
import asrBenchmark from "./pages/projects/asr/asr_benchmark";

let urlAPI = "http://0.0.0.0:6002/api/v1"; // native
// let urlAPI = "http://0.0.0.0:8000/react_admin/api" // Kong

// let urlAPI = "http://10.40.34.15:7223";

const dataProvider = simpleRestProvider(urlAPI);
function App() {
    return (
        <Admin
            authProvider={authProvider}
            dataProvider={dataProvider}
            dashboard={Dashboard}
            layout={Layout}
        >
            <Resource name={"users"} {...users} />

            <Resource name={"asr_label"} {...asrLabel} />
            <Resource name={"asr_segments"} {...asrSegments} />
            <Resource name={"asr_benchmark"} {...asrBenchmark} />
        </Admin>
    );
}

export default App;
