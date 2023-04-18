// import express from "express";
const path = require('path');

const express = require('express')
var cors = require('cors')
// const React = require( 'react')
// const ReactDOMServer = require( 'react-dom/server')
// const { matchPath } = require( "react-router-dom")
// const { StaticRouter } = require( 'react-router-dom/server')
// const App = require( "./App")

const app = express();
app.use(cors())
app.use(express.static('build'));

app.get('*', (req, res) => {
    // const context = {}

    // const content = ReactDOMServer.renderToString(
    //     <StaticRouter location={req.url} context={context}>
    //         <App />
    //     </StaticRouter>
    // )

    // const html = `
    // <!doctype html>
    // <html>
    //     <head>
    //     <title>My App</title>
    //     </head>
    //     <body>
    //     <div id="root">${content}</div>
    //     <script src="/bundle.js"></script>
    //     </body>
    // </html>
    // `;

    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const port = process.env.PORT || 4444;

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});