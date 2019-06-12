import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react';
import store from '../stores/store';
import AuthFireBase from '../utils/AuthFireBase';
import '../styles/Login.css';

@observer
class Login extends Component<any, any>{
    
    constructor(props: any){
        super(props);
        this.state = {
            usuario : '',
            password : ''
        }

        this.onLogin = this.onLogin.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    onLogin(val : boolean){
        val && this.props.history.push('/Home');
    }
    
    handleClick(){
        AuthFireBase.Login(this.state.email+'@gmail.com',  this.state.password, this.onLogin);
    }

    render(){
        return(
            <section className='Login two-colums'>
                <div className="colum first">
                    <div className="img-container"><img src="./images/banner.png" alt=""/></div>
                </div>
                <div className="colum second">
                    <Link to={'/SingUp'} className='btn-nav'>Sing Up</Link>
                    <h2 className='titulo'>Login</h2>
                    <div className="inp-cont">
                        <input type="text" placeholder='Mi nombre es ...' value={this.state.usuario}
                        onChange={(e)=>{
                            this.setState({usuario : e.target.value + ''});
                        }}/>
                        <input type="text" placeholder='Mi contraseña es ...' value={this.state.password}
                        onChange={(e)=>{
                            this.setState({password : e.target.value + ''})
                        }}/>
                    </div>
                    <button className="btn" onClick={this.handleClick}>Login</button>
                    <p className='hora'>{store.fecha.hora + ':' + store.fecha.minutos + ':' + store.fecha.segundos}</p>
                </div>
            </section>
        )
    }
}

export default Login;