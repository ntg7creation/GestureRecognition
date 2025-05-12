import React from 'react';
import ReactDOM from "react-dom";
import App from "./App";
import App2 from "./App2";
import App3 from "./components/App3";
import "./index.css";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
  <React.StrictMode>{/* <App /> */ <App3 />}</React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
