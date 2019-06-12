import {
    BrowserRouter as Router,
    Route,
    Switch,
} from 'react-router-dom';

import React from 'react';
import ReactDOM from 'react-dom';

import './styles/index.css';
import * as serviceWorker from './serviceWorker';

//import App from './components/App';
import Login from './components/Login';
import ToastProv from './components/ToastProvider';


const routing = (
    <Router>
        <ToastProv/>
        <Switch>
            <Route exact path="/" component={Login} />
        </Switch>
    </Router>
  )

ReactDOM.render(routing, document.getElementById('root'));
serviceWorker.unregister();
