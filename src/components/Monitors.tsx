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
            op: 1,
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
                    <p>Bienvenida.</p>
                </div>

                <div className="tipo-lista">
                    <p>{this.state.isAllMonitors? 'Todos los monitores': 'Monitores de turno.'}</p>
                    <span className="btn-cambio" 
                    onClick={()=>{
                        this.setState({op: 0});
                        setTimeout(() => {
                            this.setState((prevState : any)=>{return {isAllMonitors: !prevState.isAllMonitors, mar:500, op:1}});
                        }, 700);
                    }}
                    >{this.state.isAllMonitors? '<': '>'}</span>
                </div>

                <div className="list-cont" style={{opacity: this.state.op}}>
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
                            if(elem===undefined)return;
                            return <div key={index+'monitor'}
                            onClick={()=>this.handleSelected(elem)}
                            style={store.monitoresActivos.includes(elem.toLocaleLowerCase())? {opacity: 1}:{opacity: .5}}
                            className={store.monitorSelected === elem? "monitor selected": 'monitor'}>
                                <p>{elem}</p>
                                <span style={store.monitoresActivos.includes(elem.toLocaleLowerCase())?{backgroundColor: '#d6833c'}:{backgroundColor: '#c6c6c6'}}></span>
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