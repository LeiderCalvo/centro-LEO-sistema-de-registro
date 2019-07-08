import {
    HashRouter as Router,
    Route,
    Switch,
} from 'react-router-dom';

import React from 'react';
import ReactDOM from 'react-dom';

import './styles/index.css';
import * as serviceWorker from './serviceWorker';

import Login from './components/Login';
import ToastProv from './components/ToastProvider';
import SingUp from './components/SingUp';
import App from './components/App';


const routing = (
    <Router>
        <ToastProv/>
        <Switch>
            <Route exact path="/" component={Login} />
            <Route exact path="/SingUp" component={SingUp} />
            <Route exact path="/Home" component={App} />
        </Switch>
    </Router>
  )

ReactDOM.render(routing, document.getElementById('root'));
serviceWorker.unregister();
