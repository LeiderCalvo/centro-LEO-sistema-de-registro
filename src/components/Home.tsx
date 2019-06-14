import React, { Component }from 'react';
import '../styles/Home.css';
import { observer } from 'mobx-react';
import Navigation from './monitor/Navigation';
import Progress from './monitor/Progress';
import store from '../stores/store';

@observer
class Home extends  Component <any, any>{
  render(){
    return (
      store.currentUser.rol === 'monitor'?
      <section className="Home two-colums">
        <div className="first">
          <Progress/>
        </div>
        <div className="second">
          <Navigation/>
        </div>
      </section>
      :store.currentUser.rol === 'admin'&&
      <section className="Home two-colums">
        admin
      </section>
    );
  }
}

export default Home;
