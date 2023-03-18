import classNames from "classnames/bind";

import styles from "./App.scss";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { publicRoutes } from "./routes/routes";
import { Fragment } from "react";
import DefaultLayout from "./layouts";
import useScript from "./hooks/useScript";

const cx = classNames.bind(styles)

function App() {
    // useScript({ url: "https://label.lab.zalo.ai/ui/ailab_ui_api.js", head: true });
    // useScript({ url: process.env.PUBLIC_URL + "/static/ailab_ui_api.js" })
    console.log(process.env);
    return (
        <Router>
            <div className={cx("App")}>
                <Routes>
                    {publicRoutes.map((route, index) => {
                        const Page = route.component;
                        let Layout = DefaultLayout;
                        if (route.layout) {
                            Layout = route.layout;
                        } else if (route.layout === null) {
                            Layout = Fragment;
                        }

                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    <Layout>
                                        <Page />
                                    </Layout>
                                }
                            />
                        );
                    })}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
