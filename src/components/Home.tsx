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
        <div className="first">
          <Progress/>
        </div>
        <div className="second">
        <Navigation/>

        </div>
      </section>
    );
  }
}

export default Home;
