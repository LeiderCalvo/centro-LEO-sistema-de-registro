import React, { Component } from 'react';
import { observer } from 'mobx-react';
import '../../styles/Excusas.css';
import store from '../../stores/store';
import DataBaseFireBase from '../../utils/DataBaseFireBase';

@observer
class Excusas extends Component<any, any> {

    constructor(props: any){
        super(props);
        this.state = {
            razon: '',
            fecha: '',
            inicio: '',
            fin: ''
        }

        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount(){
        DataBaseFireBase.getExcuces(store.currentUser.nombre);
    }

    handleClick(){
        if(this.state.razon === '' || this.state.fecha === '' || this.state.inicio === '' || this.state.fin === ''){
            store.displayToast('Porfavor llene todos los campos', 'warning');
            return;
        }

        DataBaseFireBase.addNewExcuse(Date.now(), {razon: this.state.razon, fecha: this.state.fecha, inicio: this.state.inicio, fin: this.state.fin});
        this.setState({razon: '', fecha: '', inicio: '', fin: ''});
    }

    render(){
        return(
            <div className="workArea Excusas">
                <input type="text" placeholder='Razón de la falta' id='inp0' value={this.state.razon}
                onChange={(e)=>{
                    this.setState({razon :e.target.value + ''});
                }}/>

                <div className="inps-cont">
                    <div className="label-cont" id='esp'>
                        <h3 className='label'>Fecha</h3>
                        <input type="date" value={this.state.fecha}
                        onChange={(e)=>{
                            this.setState({fecha :e.target.value + ''});
                        }}/>
                    </div>

                    <div className="label-cont">
                        <h3 className='label'>Desde</h3>
                        <input type="time" value={this.state.inicio}
                        onChange={(e)=>{
                            this.setState({inicio :e.target.value + ''});
                        }}/>
                    </div>

                    <div className="label-cont">
                        <h3 className='label'>Hasta</h3>
                        <input type="time" value={this.state.fin}
                        onChange={(e)=>{
                            this.setState({fin :e.target.value + ''});
                        }}/>
                    </div>
                </div>

                <div className="soporte-cont">
                    <h3>Subir soporte fotográfico</h3>
                    <div className="btn" onClick={this.handleClick}>Send</div>
                </div>

                <h2 className='titulo'>Anteriores</h2>
                <div className="anteriores">
                    <div className="exc-row">
                        <p className="id tit">#</p>
                        <p className="razon tit">Rrazón</p>
                        <p className="fecha tit">Fecha</p>
                        <p className="inicio tit">Inicio</p>
                        <p className="fin tit">Fin</p>
                    </div>

                    {store.excusas.map((elem, index)=>{
                        return <div key={index+'excuces'} className="exc-row">
                            <p className="id item">{index}</p>
                            <p className="razon item">{elem.razon}</p>
                            <p className="fecha item">{elem.fecha}</p>
                            <p className="inicio item">{elem.inicio}</p>
                            <p className="fin item">{elem.fin}</p>
                        </div> 
                    })}
                </div>
            </div>
            );
    }
}

export default Excusas;