import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import './index.css';
import * as serviceWorker from './serviceWorker';
import store from "./store";

import App from './components/App/';

// Import Bootstrap component styles
import 'bootstrap/dist/css/bootstrap.min.css';

const app = (
    <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode>
);

ReactDOM.render(app, document.getElementById('root') );

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
