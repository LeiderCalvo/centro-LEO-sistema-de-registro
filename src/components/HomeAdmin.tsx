import React, { Component } from "react";
import { observer } from "mobx-react";
import store from "../stores/store";
import Monitor from "./Monitors";
import Navigation from "./monitor/Navigation";
import DataBaseFireBase from "../utils/DataBaseFireBase";
import Horario from "./monitor/Horario";
import Historial from "./monitor/Historial";
import Slider from "./Slider";

@observer
class HomeAdmin extends Component<any, any>{
    constructor(props: any) {
        super(props);
        this.state = {
            selected: null,
            isNewHorario: false,
            horario: false,
            op: 1,
            op2: 0,
            wid: 70,
            fecha: '',
            inicio: '',
            fin: ''
        }
        DataBaseFireBase.getActivos();
        setTimeout(function () {
            DataBaseFireBase.getAllExcuces();
        }, 4000);

        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        this.setState({ op: 0 });
        setTimeout(() => {
            this.setState({ op: 1 });
        }, 700);

        if(store.currentUser.rol === 'admin'){
            store.setMonitorSelected(null);
        }
    }

    handleClick() {
        if (this.state.isNewHorario) {
            if (this.state.razon === '' || this.state.fecha === '' || this.state.inicio === '' || this.state.fin === '') {
                store.displayToast('Porfavor llene todos los campos', 'error');
                this.setState({ isNewHorario: false, op2: 0 });
                setTimeout(() => {
                    this.setState({ op2: 1 });
                }, 500);
                return;
            }

            let plaso = new Date();
            plaso.setHours(this.state.inicio.split(':')[0]);
            plaso.setMonth(parseInt(this.state.fecha.split('-')[1]) - 1);
            plaso.setDate(this.state.fecha.split('-')[2]);
            plaso.setMinutes(this.state.inicio.split(':')[1]);

            let date = Date.now();

            if (plaso.getTime() - date < 0) {
                store.displayToast('La fecha es anterior al día de hoy', 'error');
                return;
            }

            //let temp = store.dias[plaso.getDay() - 1] + ', ' + plaso.getDate() + ' de ' + store.meses[plaso.getMonth()] + ' ' + plaso.getFullYear();

            store.monitorSelected&&DataBaseFireBase.setHoraAdicional(store.monitorSelected, DataBaseFireBase.transfomTimeToNumber(this.state.inicio),
            DataBaseFireBase.transfomTimeToNumber(this.state.fin),plaso.getTime()+'');

            store.monitorSelected&&DataBaseFireBase.setRegistroEsp(store.monitorSelected, DataBaseFireBase.transfomTimeToNumber(store.fecha.hora+':'+store.fecha.minutos), plaso.getTime(), 'adicional');
            this.setState({ fecha: '', inicio: '', fin: '', isNewHorario: false});
        } else {
            this.setState({ isNewHorario: true, op2: 0 });
            setTimeout(() => {
                this.setState({ op2: 1 });
            }, 500);
        }
    }

    render() {
        return (
            <section className="Home two-colums" style={{ opacity: this.state.op }}>
                <div className="first">
                    <Monitor />
                </div>

                <div className="second">
                    <Navigation his={this.props.his} />

                    {store.monitorSelected !== null ?
                            this.state.horario?
                            <Horario />
                            :
                            <Historial />
                    : store.navItemSelected === 'Inicio' ?
                        <div className="workArea uno">
                            <p className='time' style={{ color: '#88b3ff' }}>{store.currentTime.split(':')[0] + ' : ' + store.currentTime.split(':')[1]}</p>
                            <p className='date' style={{ color: '#88b3ff' }}>{store.currentDate}</p>
                            <Slider />
                        </div>
                    : store.navItemSelected === 'Horario' &&
                        <Horario />
                    }

                    {store.monitorSelected !== null &&
                        <div className="adicHour">
                            {this.state.isNewHorario ?
                                <div className="inps-cont" style={{ width: this.state.wid + '%', opacity: this.state.op2 }}>
                                    <div className="label-cont" id='esp'>
                                        <h3 className='label'>Fecha</h3>
                                        <input type="date" value={this.state.fecha}
                                            onChange={(e) => {
                                                this.setState({ fecha: e.target.value + '' });
                                            }} />
                                    </div>

                                    <div className="label-cont">
                                        <h3 className='label'>Desde</h3>
                                        <input type="time" value={this.state.inicio}
                                            onChange={(e) => {
                                                this.setState({ inicio: e.target.value + '' });
                                            }} />
                                    </div>

                                    <div className="label-cont">
                                        <h3 className='label'>Hasta</h3>
                                        <input type="time" value={this.state.fin}
                                            onChange={(e) => {
                                                this.setState({ fin: e.target.value + '' });
                                            }} />
                                    </div>
                                </div>
                            : 
                                <div className="btn" onClick={()=>{
                                    this.props.his.push('/editarHorario');
                                }}>Editar Horario</div>                                  
                            }

                            <div className="btn" onClick={this.handleClick}>{this.state.isNewHorario ? 'Listo' : 'Añadir Horas'}</div>

                            <div className="btn change" onClick={()=>{
                                this.setState((prev: any)=>{return {horario: !prev.horario}})
                            }}>></div>
                        </div>
                    }
                </div>
            </section>
        );
    }
}

export default HomeAdmin;