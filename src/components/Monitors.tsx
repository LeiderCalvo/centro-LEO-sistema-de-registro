import React from 'react';
import '../styles/Monitor.css';
import { observer } from 'mobx-react';
import store from '../stores/store';

@observer
class Monitor extends React.Component<any, any>{
    render(){
        return(
            <div className="Monitor">
                <div className="saludo-cont">
                    <h3>¡{store.currentUser.nombre}!</h3>
                    <p>Bienvenido al trabajo hoy.</p>
                </div>

                <div className="tipo-lista">
                    <p>Monitores de turno.</p>
                    <span className="btn-cambio">></span>
                </div>

                <div className="list-cont">
                    {
                        store.monitores.map((elem, index)=>{
                            return <div key={index+'monitor'} className="monitor">{elem.nombre}</div>
                        })
                    }
                </div>
            <div className="img-container"><img src="./images/aside.png" alt=""/></div>
            </div>
        );
    }
}

export default Monitor;