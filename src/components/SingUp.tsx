import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react';
import store from '../stores/store';
import AuthFireBase from '../utils/AuthFireBase';
import '../styles/Sing.css';
import DataBaseFireBase from '../utils/DataBaseFireBase';

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
            temp2: ''
        }

        this.onSingUp = this.onSingUp.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleClickSkip = this.handleClickSkip.bind(this);
        this.handleClickMas = this.handleClickMas.bind(this);
    }

    componentDidMount(){
        if(AuthFireBase.ReadLocal() === true) this.props.history.push('/Home');
    }

    onSingUp(val : boolean){
        val? this.props.history.push('/Home') : this.setState({
            step: 0,
            isMas: false,
            nombre : '',
            password: '',
            horario: [],
            temp: '',
            temp2: ''
        });
    }
    
    wrapInformationToSingUp(){
        setTimeout(()=>{
            AuthFireBase.SingUp(
                {
                    nombre: this.state.nombre,
                    password: this.state.password,
                    horario: {
                        lunes: this.state.horario[0],
                        martes: this.state.horario[1],
                        miercoles: this.state.horario[2],
                        jueves: this.state.horario[3],
                        viernes: this.state.horario[4],
                    }
                },
            this.onSingUp);
        }, 1500);
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
                let inicio = DataBaseFireBase.transfomTimeToNumber(ini);
                let final = DataBaseFireBase.transfomTimeToNumber(fi);

                if(hor.length === 0) {this.setState({horario : [[{inicio: inicio, fin: final}]], step: step+1, temp: '', temp2: ''}); return;}
                if(this.state.isMas){
                    hor[hor.length-1].push({inicio: inicio, fin: final});
                    this.setState({horario : [...hor], temp: '', temp2: '', isMas: false, step: step+1});
                    return;
                }
                this.setState({horario : [...hor, [{inicio: inicio, fin: final}]], step: step+1, temp: '', temp2: ''});
            }else{
                store.displayToast('Por favor llene todos los campos', 'warning'); return;
            }
            
            if(this.state.step === 6){
                this.wrapInformationToSingUp();
            }
        }
    }

    handleClickSkip(){
        let hor = this.state.horario;
        let step = this.state.step;

        if(hor.length === 0) {this.setState({horario : [[{inicio: null, fin: null}]], step: step+1}); return;}
        
        this.setState({horario : [...hor, [{inicio: null, fin: null}]], step: step+1});

        if(this.state.step === 6)this.wrapInformationToSingUp();
    }

    handleClickMas(){
        let hor = this.state.horario;        
        let ini = this.state.temp;
        let fi = this.state.temp2;

        
        if(ini !== '' && fi !== ''){
            let inicio = (parseInt(ini.split(':')[0])  * 60 ) + parseInt(ini.split(':')[1]);
            let final = (parseInt(fi.split(':')[0])  * 60 ) + parseInt(fi.split(':')[1]);

            if(hor.length === 0) {this.setState({horario : [[{inicio: inicio, fin: final}]], isMas: true, temp: '', temp2: ''}); return;}

            hor[hor.length-1].push({inicio: inicio, fin: final});
            this.setState({horario : [...hor], temp: '', temp2: '', isMas: true});
        }else{
            store.displayToast('Por favor llene todos los campos', 'warning'); return;
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
                        <div className="new-cont">
                            <div className="inp-cont">
                                <h3>¡{this.state.nombre}!</h3>
                                <p>Para continuar con tu registro, necesitas tener a mano tus horarios de monitoría.</p>
                            </div>
                            <div className="btn-cont">
                                <button className="btn" onClick={()=>{this.setState({step: 0, nombre: '', password: ''})}}>Back</button>
                                <button className="btn" onClick={()=>{this.setState({step: 2})}}>Next</button>
                            </div>
                        </div>
                    :this.state.step === 7?
                        <div className="loading">
                            <h3>Cargando</h3>
                        </div>
                    :this.state.step >=2 &&
                    <div className="new-cont-2">
                        <div className="inp-cont horarios">
                            <h3 className='titulo-dia'>{store.dias[this.state.step-2]}</h3>
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
                            <p className='btn-mas' onClick={this.handleClickMas}>Más</p>
                        </div>
                        <div className="btn-cont">
                            <button className="btn" onClick={this.handleClickSkip}>Skip</button>
                            <button className="btn" onClick={this.handleClick}>{this.state.step === 6? 'Done' : 'Next'}</button>
                        </div>
                    </div>
                    }

                    {this.state.step === 0 && this.state.step <7 && <button className="btn" onClick={this.handleClick}>Next</button>}

                    <p className='hora'>{store.currentTime}</p>
                </div>
            </section>
        )
    }
}

export default SingUp;