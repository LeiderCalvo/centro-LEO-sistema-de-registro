import React from 'react';
import '../styles/Monitor.css';
import { observer } from 'mobx-react';
import store from '../stores/store';

@observer
class Monitor extends React.Component<any, any>{
    constructor(props: any){
        super(props);
        this.state = {
            isAllMonitors: false
        }

        this.handleSelected = this.handleSelected.bind(this);
    }

    handleSelected(val : string){
        val === store.monitorSelected? 
            store.setMonitorSelected(null)
        :
            store.setMonitorSelected(val);
    }

    render(){
        return(
            <div className="Monitor">
                <div className="saludo-cont">
                    <h3>¡{store.currentUser.nombre}!</h3>
                    <p>Bienvenido al trabajo hoy.</p>
                </div>

                <div className="tipo-lista">
                    <p>{this.state.isAllMonitors? 'Todos los monitores': 'Monitores de turno.'}</p>
                    <span className="btn-cambio" 
                    onClick={()=>{
                        this.setState((prevState : any)=>{return {isAllMonitors: !prevState.isAllMonitors}})
                    }}
                    >{this.state.isAllMonitors? '<': '>'}</span>
                </div>

                <div className="list-cont">
                    {this.state.isAllMonitors?
                        store.monitores.map((elem, index)=>{
                            return <div key={index+'monitor'}
                            className={store.monitorSelected === elem.nombre? "monitor selected": 'monitor'}
                            onClick={()=>this.handleSelected(elem.nombre)}>
                            <p>{elem.nombre}</p>
                            </div>
                        })
                    :
                        store.currentMonitors.map((elem: any, index : number)=>{
                            return <div key={index+'monitor'}
                            onClick={()=>this.handleSelected(elem.nombre)}
                            style={store.monitoresActivos.includes(elem)? {opacity: 1}:{opacity: .5}}
                            className={store.monitorSelected === elem.nombre? "monitor selected": 'monitor'}>
                                <p>{elem}</p>
                                <span style={store.monitoresActivos.includes(elem)?{backgroundColor: '#d6833c'}:{backgroundColor: '#c6c6c6'}}></span>
                            </div>
                        })
                    }
                </div>
            <div className="img-container"><img src="./images/aside.png" alt=""/></div>
            </div>
        );
    }
}

export default Monitor;