import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react';
import store from '../stores/store';
import AuthFireBase from '../utils/AuthFireBase';
import '../styles/Sing.css';
import DataBaseFireBase from '../utils/DataBaseFireBase';

@observer
class EditSchedule extends Component<any, any>{
    constructor(props: any) {
        super(props);
        this.state = {
            horario: [[{inicio: '', fin: ''}],[{inicio: '', fin: ''}],[{inicio: '', fin: ''}],[{inicio: '', fin: ''}],[{inicio: '', fin: ''}],[{inicio: '', fin: ''}]],
            op: 1,
        }

        //console.log(store.monitorSelected);
        this.wrapInformationToHorario = this.wrapInformationToHorario.bind(this);
    }
    
    componentDidMount() {
        if (store.monitorSelected === null) this.props.history.push('/Home');
        this.setState({ op: 0 });
        setTimeout(() => {
            this.setState({ op: 1 });
        }, 700);
    }
    
    wrapInformationToHorario() {
        setTimeout(() => {
            let temp : any =  {};
            for (let i = 0; i < this.state.horario.length; i++) {
                let dia = store.dias[i].toLocaleLowerCase();
                for (let j = 0; j < this.state.horario[i].length; j++) {
                    const jornada = this.state.horario[i][j];
                    if (jornada.inicio === '' || jornada.fin === '') break;
                    temp[dia] = this.state.horario[i];
                }
            }

            store.monitorSelected && DataBaseFireBase.setHorario(store.monitorSelected, temp);
            store.displayToast('horario actualizado', 'success');
            this.props.history.push('/Home');
        }, 1500);
    }

    render() {
        return (
            <section className='Sing Singup' style={{ opacity: this.state.op }}>
                <Link to={'/Home'} className='btn-nav'>Regresar</Link>
                <h2 className='titulo'>Editar horario de {store.monitorSelected}</h2>

                <p>Recuerda que reemplazarás completamente el horario de este monitor</p>
                                
                {
                    this.state.horario.map((jornadas: [], i: number)=>{
                        return <div className="cont" key={i}>
                            <h3 className='titulo-dia'>{store.dias[i]}</h3>
                            {
                                jornadas.map((jornada: {inicio: number, fin: number}, j: number)=>{
                                    return <div className="inp-cont horarios" key={i+'-'+j}>
                                    <h3>{i+'.'+j}</h3>
                                        <div className="label-cont">
                                            <h3 className='label'>Comienzo de Jornada</h3>
                                            <input type="time"
                                                onChange={(e) => {
                                                    let raw = e.target.value+'';
                                                    let val = ( parseInt(raw.split(':')[0]) * 60) + parseInt(raw.split(':')[1]);
                                                    let temp = [...this.state.horario];
                                                    temp[i][j].inicio = val;
                                                    this.setState({ horario: temp });
                                                }} />
                                        </div>
                                        <div className="label-cont">
                                            <h3 className='label'>Fin de Jornada</h3>
                                            <input type="time"
                                                onChange={(e) => {
                                                    let temp = [...this.state.horario];
                                                    let raw = e.target.value+'';
                                                    let val = (parseInt(raw.split(':')[0]) * 60) + parseInt(raw.split(':')[1]);
                                                    //temp[dia] === undefined? temp[dia] = [{inicio: '', fin: val }] : temp[dia][0].fin = val; 
                                                    temp[i][j].fin = val;
                                                    this.setState({ horario: temp });
                                                }} />
                                        </div>
                                        
                                    </div>
                                })
                            }
                            <p className='btn-mas' onClick={()=>{
                                let temp = [...this.state.horario];
                                temp[i].push({inicio: '', fin: ''});
                                this.setState({horario: temp});
                            }}>Más</p>
                        </div>
                    })
                }
                
                <button className="btn" onClick={this.wrapInformationToHorario}>Guardar</button>
                <p className='hora'>{store.currentTime}</p>
            </section>
        )
    }
}

export default EditSchedule;