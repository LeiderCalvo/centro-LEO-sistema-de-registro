import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react';
import store from '../stores/store';
import AuthFireBase from '../utils/AuthFireBase';
import '../styles/Sing.css';

@observer
class Login extends Component<any, any>{
    
    constructor(props: any){
        super(props);
        this.state = {
            usuario : '',
            password : '',
            op: 1,
        }

        this.onLogin = this.onLogin.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount(){
        if(AuthFireBase.ReadLocal() === true) this.props.history.push('/Home');
        this.setState({op: 0});
        setTimeout(() => {
            this.setState({op: 1});
        }, 300);
    }

    onLogin(val : boolean){
        val? this.props.history.push('/Home') : this.setState({
            usuario : '',
            password : ''
        });
    }
    
    handleClick(){
        if(this.state.usuario==='' || this.state.password === ''){store.displayToast('Por favor llene todos los campos', 'warning'); return;}
        if(this.state.usuario.includes(' ') || this.state.password.includes(' ')){store.displayToast('Por favor no use espacios', 'warning'); return;}
        if(this.state.usuario.length<4){store.displayToast('Por favor use mas de 4 caracteres en su usuario', 'info'); return;}
        if(this.state.password.length<6){store.displayToast('Por favor use mas de 6 caracteres en su contraseña', 'info'); return;}
        AuthFireBase.Login(this.state.usuario,  this.state.password, this.onLogin);
    }

    render(){
        return(
            <section className='Sing Login two-colums' style={{opacity: this.state.op}}>
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
                        <input type="password" placeholder='Mi contraseña es ...' value={this.state.password}
                        onChange={(e)=>{
                            this.setState({password : e.target.value + ''})
                        }}/>
                    </div>
                    <button className="btn" onClick={this.handleClick}>Login</button>
                    <p className='hora'>{store.currentTime}</p>
                </div>
            </section>
        )
    }
}

export default Login;