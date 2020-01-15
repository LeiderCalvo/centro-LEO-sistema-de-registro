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
      op: 1,
      isSalidaAutoHabilitada: true
    }

    this.handleClickLlegue = this.handleClickLlegue.bind(this);
    this.handleClickTermine = this.handleClickTermine.bind(this);
    this.cerrarSesionAutomatico = this.cerrarSesionAutomatico.bind(this);
    DataBaseFireBase.setActivo(store.currentUser.nombre);
  }

  componentDidMount(){
    DataBaseFireBase.getMyAditionals();
    this.setState({op: 0});
    setTimeout(() => {
        this.setState({op: 1});
    }, 700);

    let llegado = localStorage.getItem('isLlegado');
    let val = llegado !== null ? JSON.parse(llegado) : null;
    val !== null && store.setCurrentUser('llegue',val+'');
    this.setState({isDoneLlegue: val});

    let terminado = localStorage.getItem('isTerminado');
    let val2 = terminado !== null ? JSON.parse(terminado) : null;
    val2 !== null && store.setCurrentUser('termine',val2+'');
    this.setState({isDoneTermine: val2});

    this.cerrarSesionAutomatico();

  }
  
  componentWillUnmount(){
    clearInterval(this.state.intervalId);
  }

  cerrarSesionAutomatico(){
    let intervalId = setInterval(() => {
      if(store.diferenceCurrentAndFinal<-2 && store.currentUser.llegue === 'true'){
        localStorage.setItem('isTerminado', 'false');
        localStorage.setItem('isLlegado', 'false');
        localStorage.setItem('isCurrentUser', 'false');
        localStorage.removeItem('currentUser');

        store.setCurrentUser('termine', 'true');
        store.currentUser.rol === 'monitor'&&DataBaseFireBase.removeActivo(store.currentUser.nombre);

        DataBaseFireBase.setHorasLogradas(Math.abs(store.diferenceCurrentAndInitial/60)-this.state.horasPendientes);
        store.displayToast('Has completado'+(Math.abs(store.diferenceCurrentAndInitial/60)-this.state.horasPendientes)+' horas', 'info');

        DataBaseFireBase.setRegistro(DataBaseFireBase.transfomTimeToNumber(store.fecha.hora+':'+store.fecha.minutos), Date.now(), 'salida');

        store.setAllCurrentUser({horario: null, rol: '', nombre: '', dia: '', inicio: '', fin: '',  llegue:'false', termine:'false'});
        this.props.his.push('/');
      }
    }, 60000/2);
    this.setState({intervalId: intervalId});
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
    store.setCurrentUser('llegue', 'true');
    localStorage.setItem('isLlegado', 'true');

    if(store.diferenceCurrentAndInitial<-7){
      let temp = Math.abs(store.diferenceCurrentAndInitial/60);
      DataBaseFireBase.setHorasPerdidas(temp);
      this.setState({horasPendientes: temp});
      store.displayToast('Llegas tarde, se te agregan '+temp.toFixed(2) +' horas pendientes', 'info');
    }

    DataBaseFireBase.setRegistro(DataBaseFireBase.transfomTimeToNumber(store.fecha.hora+':'+store.fecha.minutos), Date.now(), 'llegada');
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
    if(store.currentUser.inicio === 'null'){
      store.displayToast('No estás en tiempo de monitoria, lo lamentamos', 'warning');
      return;
    }

    if(this.state.isDoneLlegue === false){
      store.displayToast('Primero debes marcar tu llegada', 'warning');
      return;
    }

    if(store.diferenceCurrentAndFinal>LAPSO){
      let time = DataBaseFireBase.transfomNumberToTime(store.diferenceCurrentAndFinal - LAPSO);
      store.displayToast('faltan: ' + time.split(':')[0] + ' Horas y ' + (parseInt(time.split(':')[1])) + ' Minutos, para poder marcar tu Salida', 'warning');
      return;
    }

    this.setState({isDoneTermine: true});
    store.setCurrentUser('termine', 'true');
    localStorage.setItem('isTerminado', 'true');
/*
    if(store.diferenceCurrentAndFinal>LAPSO){
      DataBaseFireBase.setHorasPerdidas(Math.abs(store.diferenceCurrentAndFinal/60));
    }
*/
    DataBaseFireBase.setHorasLogradas(Math.abs(store.diferenceCurrentAndInitial/60)-this.state.horasPendientes);
    store.displayToast('Has completado'+(Math.abs(store.diferenceCurrentAndInitial/60)-this.state.horasPendientes)+' horas', 'info');

    DataBaseFireBase.setRegistro(DataBaseFireBase.transfomTimeToNumber(store.fecha.hora+':'+store.fecha.minutos), Date.now(), 'salida');
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
              style={this.state.isDoneLlegue? {color: '#c6c6c6'} : store.diferenceCurrentAndInitial>=LAPSO? {color: '#88b3ff'} : {color: '#d6833c'}}>{store.currentDate}</p>

              <div className="btn-cont">
                <div className="btn"
                style={this.state.isDoneLlegue || store.diferenceCurrentAndInitial>LAPSO || store.currentUser.inicio === 'null'?
                    {opacity: .5}
                  : 
                    {opacity: 1}}
                onClick={this.handleClickLlegue}>Llegué</div>

                <div className="btn"
                style={this.state.isDoneTermine || this.state.isDoneLlegue === false || store.currentUser.fin === 'null'? 
                  {opacity: .5}
                :
                  {opacity: 1}} 
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
