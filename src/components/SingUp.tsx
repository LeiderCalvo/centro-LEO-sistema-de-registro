import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react';
import store from '../stores/store';
import AuthFireBase from '../utils/AuthFireBase';
import '../styles/Sing.css';

@observer
class SingUp extends Component<any, any>{

    constructor(props: any) {
        super(props);
        this.state = {
            nombre: '',
            password: '',
            op: 1
        }

        this.onSingUp = this.onSingUp.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        if (AuthFireBase.ReadLocal() === true) this.props.history.push('/Home');
        this.setState({ op: 0 });
        setTimeout(() => {
            this.setState({ op: 1 });
        }, 700);
    }

    onSingUp(val: boolean) {
        val ? this.props.history.push('/Home') : this.setState({
            nombre: '',
            password: '',
        });
    }

    handleClick() {
        if (this.state.nombre === '' || this.state.password === '') { store.displayToast('Por favor llene todos los campos', 'warning'); return; }
        if (this.state.nombre.includes(' ') || this.state.password.includes(' ')) { store.displayToast('Por favor no use espacios', 'warning'); return; }
        if (this.state.nombre.length < 4) { store.displayToast('Por favor use mas de 4 caracteres en su usuario', 'info'); return; }
        if (this.state.password.length < 6) { store.displayToast('Por favor use mas de 6 caracteres en su contraseña', 'info'); return; }

        AuthFireBase.SingUp(
            {
                nombre: this.state.nombre,
                password: this.state.password,
            },
            this.onSingUp);
    }

    render() {
        return (
            <section className='Sing Singup two-colums' style={{ opacity: this.state.op }}>
                <div className="colum first">
                    <div className="img-container"><img src="./images/banner.png" alt="" /></div>
                </div>
                <div className="colum second">
                    <Link to={'/'} className='btn-nav'>Inicia Sesión</Link>
                    <h2 className='titulo'>Registro</h2>

                    <div className="inp-cont">
                        <input type="text" placeholder='Mi nombre es ...' value={this.state.nombre}
                            onChange={(e) => {
                                this.setState({ nombre: e.target.value + '' });
                            }} />
                        <input type="password" placeholder='Mi contraseña es ...' value={this.state.password}
                            onChange={(e) => {
                                this.setState({ password: e.target.value + '' });
                            }} />
                    </div>

                    <button className="btn" onClick={this.handleClick}>Registrar</button>

                    <p className='hora'>{store.currentTime}</p>
                </div>
            </section>
        )
    }
}

export default SingUp;