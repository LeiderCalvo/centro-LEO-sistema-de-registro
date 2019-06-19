import React, { Component }from 'react';
import '../styles/Home.css';
import { observer } from 'mobx-react';
import Navigation from './monitor/Navigation';
import Progress from './monitor/Progress';
import store from '../stores/store';
import DataBaseFireBase from '../utils/DataBaseFireBase';
import Horario from './monitor/Horario';
import Excusas from './monitor/Excusas';

@observer
class Home extends  Component <any, any>{

  constructor(props: any){
    super(props);
    this.state = {
      isDoneLlegue: false,
      isDoneTermine: false
    }

    this.handleClickLlegue = this.handleClickLlegue.bind(this);
    this.handleClickTermine = this.handleClickTermine.bind(this);
  }

  handleClickLlegue(){
    if(store.diferenceCurrentAndInitial>5){
      let time = DataBaseFireBase.transfomNumberToTime(store.diferenceCurrentAndInitial - 5);
      store.displayToast('faltan: ' + time.split(':')[0] + ' Horas y ' + (parseInt(time.split(':')[1])) + ' Minutos, para poder marcar tu llegada', 'warning');
      return;
    }
    if(this.state.isDoneLlegue === true) return;
    this.setState({isDoneLlegue: true});

    if(store.diferenceCurrentAndInitial<-5){
      DataBaseFireBase.setHorasPerdidas(Math.abs(store.diferenceCurrentAndInitial/60));
    }

    DataBaseFireBase.setRegistro(DataBaseFireBase.transfomTimeToNumber(store.fecha.hora+':'+store.fecha.minutos), store.currentDate, 'llegada');
    store.setCurrentUser('llegue', 'true');
  }

  handleClickTermine(){
    console.log(store.diferenceCurrentAndFinal);
    if(store.diferenceCurrentAndFinal>5){
      let time = DataBaseFireBase.transfomNumberToTime(store.diferenceCurrentAndFinal - 5);
      store.displayToast('faltan: ' + time.split(':')[0] + ' Horas y ' + (parseInt(time.split(':')[1])) + ' Minutos, para poder marcar tu Salida', 'warning');
      return;
    }
    if(this.state.isDoneTermine === true) return;
    this.setState({isDoneTermine: true});
  }

  render(){
    return (
     // store.currentUser.rol === 'monitor'?

      <section className="Home two-colums">
        <div className="first">
          <Progress/>
        </div>
        <div className="second">
          <Navigation/>
          {store.navItemSelected === 'Inicio'? 
            <div className="workArea uno">
              <p className='time'
              style={this.state.isDoneLlegue? {color: '#c6c6c6'} : store.diferenceCurrentAndInitial>=5? {color: '#88b3ff'} : {color: '#d6833c'}}>{store.currentTime.split(':')[0] + ' : '+store.currentTime.split(':')[1]}</p>
              <p className='date' 
              style={this.state.isDoneLlegue? {color: '#c6c6c6'} :store.diferenceCurrentAndInitial>=5? {color: '#88b3ff'} : {color: '#d6833c'}}>{store.currentDate}</p>

              <div className="btn-cont">
                <div className="btn"
                style={store.diferenceCurrentAndInitial>5? {opacity: .5} : this.state.isDoneLlegue? {opacity: .5} : {opacity: 1}}
                onClick={this.handleClickLlegue}>
                  Llegué</div>

                <div className="btn"
                style={store.diferenceCurrentAndFinal>5? {opacity: .5} : this.state.isDoneTermine? {opacity: .5} : {opacity: 1}} 
                onClick={this.handleClickTermine}>
                  Terminé</div>
              </div>

            </div>
          :store.navItemSelected === 'Horario'?
            <Horario/>
          :store.navItemSelected === 'Excusas'?
            <Excusas/>
          :
            <div className="workArea dos">
            </div>
        }
        </div>
      </section>
  /*
      :store.currentUser.rol === 'admin'&&

      <section className="Home two-colums">
        admin
      </section>
      */
    );
  }
}

export default Home;
