import React from 'react';
import '../styles/Monitor.css';
import { observer } from 'mobx-react';
import store from '../stores/store';

@observer
class Monitor extends React.Component<any, any>{
    constructor(props: any){
        super(props);
        this.state = {
            isAllMonitors: false,
        }
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
                    <span className="btn-cambio" onClick={()=>{
                        this.setState((prevState : any)=>{return {isAllMonitors: !prevState.isAllMonitors}})
                    }}>{this.state.isAllMonitors? '<': '>'}</span>
                </div>

                <div className="list-cont">
                    {this.state.isAllMonitors?
                        store.monitores.map((elem, index)=>{
                            return <div key={index+'monitor'} className="monitor">
                            <p>{elem.nombre}</p>
                            </div>
                        })
                    :
                        store.currentMonitors.map((elem: any, index : number)=>{
                            return <div key={index+'monitor'} className="monitor">
                            <p>{elem}</p>
                            <span></span>
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