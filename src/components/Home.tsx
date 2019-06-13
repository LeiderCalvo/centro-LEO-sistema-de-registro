import React, { Component }from 'react';
import '../styles/Home.css';
import { observer } from 'mobx-react';
import Navigation from './Navigation';
import Progress from './Progress';

@observer
class Home extends  Component <any, any>{
  render(){
    return (
      <section className="Home two-colums">
        here Home
        <Navigation/>
        <div className="first">
          <Progress/>
        </div>
        <div className="second">

        </div>
      </section>
    );
  }
}

export default Home;
