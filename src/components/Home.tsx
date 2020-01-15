import React, { Component }from 'react';
import '../styles/Home.css';
import { observer } from 'mobx-react';
import Navigation from './monitor/Navigation';
import Progress from './monitor/Progress';
import store from '../stores/store';
import DataBaseFireBase from '../utils/DataBaseFireBase';
import Horario from './monitor/Horario';
import Excusas from './monitor/Excusas';
import Historial from './monitor/Historial';

const LAPSO = 7;

@observer
class Home extends  Component <any, any>{

  constructor(props: any){
    super(props);
    this.state = {
      isDoneLlegue: false,
      isDoneTermine: false,
      horasPendientes: 0,
      op: 1
    }

    this.handleClickLlegue = this.handleClickLlegue.bind(this);
    this.handleClickTermine = this.handleClickTermine.bind(this);
    DataBaseFireBase.setActivo(store.currentUser.nombre);
  }

  componentDidMount(){
    DataBaseFireBase.getMyAditionals();
    this.setState({op: 0});
    setTimeout(() => {
        this.setState({op: 1});
    }, 700);

    let llegado = localStorage.getItem('isLlegado');
    let val = llegado !== null && JSON.parse(llegado);
    val !== null && store.setCurrentUser('llegue',val+'');
    this.setState({isDoneLlegue: val});

    let terminado = localStorage.getItem('isTerminado');
    let val2 = terminado !== null && JSON.parse(terminado);
    val2 !== null && store.setCurrentUser('termine',val2+'');
    this.setState({isDoneTermine: val2});
  }

  handleClickLlegue(){
    if(this.state.isDoneLlegue === true) return;
    if(store.currentUser.nombre === '')return;

    if(store.diferenceCurrentAndInitial>LAPSO){
      let time = DataBaseFireBase.transfomNumberToTime(store.diferenceCurrentAndInitial - LAPSO);
      store.displayToast('faltan: ' + time.split(':')[0] + ' Horas y ' + (parseInt(time.split(':')[1])) + ' Minutos, para poder marcar tu llegada', 'warning');
      return;
    }

    if(store.currentUser.inicio === 'null'){
      store.displayToast('No estás en tiempo de monitoria, lo lamentamos', 'warning');
      return;
    }
/*
    if(store.diferenceCurrentAndFinal<LAPSO){
      return;
    }
  */  
    this.setState({isDoneLlegue: true});

    if(store.diferenceCurrentAndInitial<-7){
      let temp = Math.abs(store.diferenceCurrentAndInitial/60);
      DataBaseFireBase.setHorasPerdidas(temp);
      this.setState({horasPendientes: temp});
      store.displayToast('Llegas tarde, se te agregan '+temp.toFixed(2) +' horas pendientes', 'info');
    }

    DataBaseFireBase.setRegistro(DataBaseFireBase.transfomTimeToNumber(store.fecha.hora+':'+store.fecha.minutos), Date.now(), 'llegada');
    store.setCurrentUser('llegue', 'true');
    localStorage.setItem('isLlegado', 'true');
  }

  handleClickTermine(){
    if(this.state.isDoneTermine === true) return;
    if(store.currentUser.nombre === '')return; 
    /*
    if(store.diferenceCurrentAndFinal<-LAPSO){
      store.displayToast('Aun no puedes marcar tu salida', 'warning');
      return;
    }
*/
    if(this.state.isDoneLlegue === false){
      store.displayToast('Primero debes marcar tu llegada', 'warning');
      return;
    }

    if(store.diferenceCurrentAndFinal>LAPSO){
      let time = DataBaseFireBase.transfomNumberToTime(store.diferenceCurrentAndFinal - LAPSO);
      store.displayToast('faltan: ' + time.split(':')[0] + ' Horas y ' + (parseInt(time.split(':')[1])) + ' Minutos, para poder marcar tu Salida', 'warning');
      return;
    }

    if(store.currentUser.inicio === 'null'){
      store.displayToast('No estás en tiempo de monitoria, lo lamentamos', 'warning');
      return;
    }
    this.setState({isDoneTermine: true});
/*
    if(store.diferenceCurrentAndFinal>LAPSO){
      DataBaseFireBase.setHorasPerdidas(Math.abs(store.diferenceCurrentAndFinal/60));
    }
*/
    DataBaseFireBase.setHorasLogradas(Math.abs(store.diferenceCurrentAndInitial/60)-this.state.horasPendientes);
    store.displayToast('Has completado'+(Math.abs(store.diferenceCurrentAndInitial/60)-this.state.horasPendientes)+' horas', 'info');

    DataBaseFireBase.setRegistro(DataBaseFireBase.transfomTimeToNumber(store.fecha.hora+':'+store.fecha.minutos), Date.now(), 'salida');
    store.setCurrentUser('termine', 'true');
    localStorage.setItem('isTerminado', 'true');
  }

  render(){
    return (
      <section className="Home two-colums" style={{opacity: this.state.op}}>
        <div className="first">
          <Progress/>
        </div>

        <div className="second">
          <Navigation his={this.props.his}/>

          {store.navItemSelected === 'Inicio'? 
            <div className="workArea uno">
              <p className='time'
              style={this.state.isDoneLlegue? {color: '#c6c6c6'} : store.diferenceCurrentAndInitial>=LAPSO? {color: '#88b3ff'} : {color: '#d6833c'}}>{store.currentTime.split(':')[0] + ' : '+store.currentTime.split(':')[1]}</p>
              <p className='date' 
              style={this.state.isDoneLlegue? {color: '#c6c6c6'} :store.diferenceCurrentAndInitial>=LAPSO? {color: '#88b3ff'} : {color: '#d6833c'}}>{store.currentDate}</p>

              <div className="btn-cont">
                <div className="btn"
                style={store.diferenceCurrentAndFinal<LAPSO? {opacity: .5} : store.currentUser.inicio === 'null'? {opacity: .5}:store.diferenceCurrentAndInitial>LAPSO? {opacity: .5} : this.state.isDoneLlegue? {opacity: .5} : {opacity: 1}}
                onClick={this.handleClickLlegue}>
                  Llegué</div>

                <div className="btn"
                style={store.diferenceCurrentAndFinal<LAPSO? {opacity: .5} : store.currentUser.fin === 'null'? {opacity: .5}: store.diferenceCurrentAndFinal>LAPSO? {opacity: .5} : this.state.isDoneTermine? {opacity: .5} : {opacity: 1}} 
                onClick={this.handleClickTermine}>
                  Terminé</div>
              </div>
            </div>
          :store.navItemSelected === 'Horario'?
            <Horario/>
          :store.navItemSelected === 'Excusas'?
            <Excusas/>
          :store.navItemSelected === 'Historial'&&
            <Historial/>
        }
        </div>
      </section>
    );
  }
}

export default Home;
