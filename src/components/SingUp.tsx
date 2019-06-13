import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react';
import store, { Usuario } from '../stores/store';
import AuthFireBase from '../utils/AuthFireBase';
import '../styles/Sing.css';

@observer
class SingUp extends Component<any, any>{
    
    constructor(props: any){
        super(props);
        let user: Usuario = {nombre: '', password: '', horario: {lunes: [], martes: [], miercoles: [], jueves: [], viernes: []}};
        this.state = {
            step: 0,
            usuario : user
        }

        this.onSingUp = this.onSingUp.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    onSingUp(val : boolean){
        val && this.props.history.push('/Home');
    }
    
    handleClick(){
        switch (this.state.step) {
            case 0:
                if(this.state.usuario.nombre==='' || this.state.usuario.password === ''){store.displayToast('Por favor llene todos los campos', 'warning'); return;}
                if(this.state.usuario.nombre.includes(' ') || this.state.usuario.password.includes(' ')){store.displayToast('Por favor no use espacios', 'warning'); return;}
                if(this.state.usuario.nombre.length<4){store.displayToast('Por favor use mas de 4 caracteres en su usuario', 'info'); return;}
                if(this.state.usuario.password.length<6){store.displayToast('Por favor use mas de 6 caracteres en su contraseña', 'info'); return;}
                this.setState({step: 1});
                break;

            case 2:
                if(this.state.usuario.horario.lunes.length > 0)this.setState({step: 3});
                break;

            case 3:
                if(this.state.usuario.horario.martes.length > 0)this.setState({step: 4});
                break;
            
            case 4:
                if(this.state.usuario.horario.miercoles.length > 0)this.setState({step: 5});
                break;

            case 5:
                if(this.state.usuario.horario.jueves.length > 0)this.setState({step: 6});
                break;

            case 6:
                if(this.state.usuario.horario.viernes.length > 0)AuthFireBase.SingUp(this.state.usuario, this.onSingUp);
                break;
        
            default:
                break;
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
                            <input type="text" placeholder='Mi nombre es ...' value={this.state.usuario.nombre}
                            onChange={(e)=>{
                                this.setState({usuario : {nombre: e.target.value + ''}});
                            }}/>
                            <input type="text" placeholder='Mi contraseña es ...' value={this.state.usuario.password}
                            onChange={(e)=>{
                                this.setState({usuario: {password : e.target.value + ''}});
                            }}/>
                        </div>
                    :this.state.step === 1?
                        <div className="cont">
                            <div className="inp-cont">
                                <h3>¡{this.state.usuario.nombre}!</h3>
                                <p>Para continuar con tu registro, necesitaremos tener a mano los horarios en los que trabajaras cada día</p>
                            </div>
                            <div className="btn-cont">
                                <button className="btn" onClick={()=>{this.setState({step: 2})}}>Next</button>
                                <button className="btn" onClick={()=>{this.setState({step: 0, usuario: {nombre: '', password: ''}})}}>Back</button>
                            </div>
                        </div>
                    :this.state.step >=2 &&
                        <div className="inp-cont">
                            <h3>{this.state.dia}</h3>
                            <input type="text" placeholder='Mi nombre es ...' value={this.state.usuario.nombre}
                            onChange={(e)=>{
                                this.setState({usuario : {nombre: e.target.value + ''}});
                            }}/>
                            <input type="text" placeholder='Mi contraseña es ...' value={this.state.usuario.password}
                            onChange={(e)=>{
                                this.setState({usuario: {password : e.target.value + ''}});
                            }}/>
                        </div>
                    }

                    {this.state.step != 1 && <button className="btn" onClick={this.handleClick}>{this.state.step === 6? 'Done' : 'Next'}</button>}

                    <p className='hora'>{store.fecha.hora + ':' + store.fecha.minutos + ':' + store.fecha.segundos}</p>
                </div>
            </section>
        )
    }
}

export default SingUp;