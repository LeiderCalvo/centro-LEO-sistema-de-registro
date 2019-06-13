import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react';
import store from '../stores/store';
import AuthFireBase from '../utils/AuthFireBase';
import '../styles/Sing.css';

@observer
class SingUp extends Component<any, any>{
    
    constructor(props: any){
        super(props);
        this.state = {
            step: 0,
            nombre : '',
            password: '',
            horario: [],
            temp: '',
            temp2: '',
            dias : ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes']
        }

        this.onSingUp = this.onSingUp.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    onSingUp(val : boolean){
        val? this.props.history.push('/Home') : this.setState({
            step: 0,
            nombre : '',
            password: '',
            horario: [],
            temp: '',
            temp2: '',
            dias : ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes']
        });
    }
    
    handleClick(){
        if(this.state.step === 0){
            if(this.state.nombre==='' || this.state.password === ''){store.displayToast('Por favor llene todos los campos', 'warning'); return;}
            if(this.state.nombre.includes(' ') || this.state.password.includes(' ')){store.displayToast('Por favor no use espacios', 'warning'); return;}
            if(this.state.nombre.length<4){store.displayToast('Por favor use mas de 4 caracteres en su usuario', 'info'); return;}
            if(this.state.password.length<6){store.displayToast('Por favor use mas de 6 caracteres en su contraseña', 'info'); return;}
            this.setState({step: 1});
        }
        if(this.state.step >=2){
            let hor = this.state.horario;
            let ini = this.state.temp;
            let fi = this.state.temp2;
            let step = this.state.step;
            if(ini !== '' && fi !== ''){
                if(hor.length === 0) {this.setState({horario : [{inicio: ini, fin: fi}], step: step+1, temp: '', temp2: ''}); return;}
                this.setState({horario : [...hor, {inicio: ini, fin: fi}], step: step+1, temp: '', temp2: ''});
            }else{
                store.displayToast('Por favor llene todos los campos', 'warning'); return;
            }
            if(this.state.step === 6){
                AuthFireBase.SingUp(
                    {
                        nombre: this.state.nombre,
                        password: this.state.password,
                        horario: {
                            lunes: this.state.Lunes,
                            martes: this.state.Martes,
                            miercoles: this.state.Miercoles,
                            jueves: this.state.Jueves,
                            viernes: this.state.Viernes,
                        }
                    },
                this.onSingUp);
            }
        }
    }

    render(){
        return(
            <section className='Sing Singup two-colums'>
                <div className="colum first">
                    <div className="img-container"><img src="./images/banner.png" alt=""/></div>
                </div>
                <div className="colum second">
                    <Link to={'/'} className='btn-nav'>Login</Link>
                    <h2 className='titulo'>Sing Up</h2>
                    
                    {this.state.step === 0?
                        <div className="inp-cont">
                            <input type="text" placeholder='Mi nombre es ...' value={this.state.nombre}
                            onChange={(e)=>{
                                this.setState({nombre: e.target.value + ''});
                            }}/>
                            <input type="password" placeholder='Mi contraseña es ...' value={this.state.password}
                            onChange={(e)=>{
                                this.setState({password : e.target.value + ''});
                            }}/>
                        </div>
                    :this.state.step === 1?
                        <div className="cont">
                            <div className="inp-cont">
                                <h3>¡{this.state.nombre}!</h3>
                                <p>Para continuar con tu registro, necesitaremos tener a mano los horarios en los que trabajaras cada día</p>
                            </div>
                            <div className="btn-cont">
                                <button className="btn" onClick={()=>{this.setState({step: 2})}}>Next</button>
                                <button className="btn" onClick={()=>{this.setState({step: 0, nombre: '', password: ''})}}>Back</button>
                            </div>
                        </div>
                    :this.state.step >=2 &&
                        <div className="inp-cont horarios">
                            <h3>{this.state.dias[this.state.step-2]}</h3>
                            <div className="label-cont">
                                <h3 className='label'>Comienzo de Jornada</h3>
                                <input type="time" value={this.state.temp}
                                onChange={(e)=>{
                                    this.setState({temp :e.target.value + ''});
                                }}/>
                            </div>
                            <div className="label-cont">
                                <h3 className='label'>Fin de Jornada</h3>
                                <input type="time" value={this.state.temp2}
                                onChange={(e)=>{
                                    this.setState({temp2:e.target.value + '' });
                                }}/>
                            </div>
                        </div>
                    }

                    {this.state.step !== 1 && <button className="btn" onClick={this.handleClick}>{this.state.step === 6? 'Done' : 'Next'}</button>}

                    <p className='hora'>{store.fecha.hora + ':' + store.fecha.minutos + ':' + store.fecha.segundos}</p>
                </div>
            </section>
        )
    }
}

export default SingUp;