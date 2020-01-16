import React, { Component } from 'react';
import { observer } from 'mobx-react';
import '../../styles/Excusas.css';
import store from '../../stores/store';
import DataBaseFireBase from '../../utils/DataBaseFireBase';

@observer
class Opiniones extends Component<any, any> {

    constructor(props: any){
        super(props);
        this.state = {
            opinion: ''
        }

        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount(){
        DataBaseFireBase.getOpiniones(store.currentUser.nombre);
    }

    handleClick(){
        
        if(this.state.opinion === ''){
            store.displayToast('Porfavor llene todos los campos', 'warning');
            return;
        }

        let date: any = new Date();
        let hora = DataBaseFireBase.transfomTimeToNumber(store.fecha.hora+':'+store.fecha.minutos);

        DataBaseFireBase.addNewOpinion({opinion: this.state.opinion, fecha: date.getTime()});
        DataBaseFireBase.setRegistro(hora, date.getTime(), 'opinion');

        this.setState({opinion: ''});
        
    }

    render(){
        return(
            <div className="workArea Excusas Opiniones">
                <div className="cont-inp">
                    <input type="text" placeholder='Cuentame tu experiencia' id='inp0' value={this.state.opinion}
                    onChange={(e)=>{
                        this.setState({opinion: e.target.value + ''});
                    }}/>
                    
                    <div className="btn" onClick={this.handleClick}>Send</div>
                </div>

                <h2 className='titulo'>Anteriores</h2>
                <div className="anteriores">
                    <div className="exc-row">
                        <p className="id tit">#</p>
                        <p className="razon tit">Opinión</p>
                        <p className="fecha tit">Fecha</p>
                    </div>

                    {store.opiniones.reverse().map((elem, index)=>{
                        let fecha = new Date(elem.fecha);
                        let temp = fecha.getDate() + ' de ' + store.meses[fecha.getMonth()] + ' ' + fecha.getFullYear();

                        return <div key={index+'excuces'} className="exc-row">
                            <p className="id item">{index}</p>
                            <p className="razon item">{elem.opinion}</p>
                            <p className="fecha item">{temp}</p>
                        </div> 
                    })}
                </div>
            </div>
            );
    }
}

export default Opiniones;