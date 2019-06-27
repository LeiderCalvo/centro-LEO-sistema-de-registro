import React from 'react';
import '../../styles/Navigation.css'
import store from '../../stores/store';
import { observer } from 'mobx-react';
import DataBaseFireBase from '../../utils/DataBaseFireBase';

@observer
class Navigation extends React.Component<any, any>{

    constructor(props: any){
        super(props);
        this.state = {
            navigationItems : ['Inicio', 'Horario', 'Excusas', 'Historial', 'Logout']
        }
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(elem : string){
        if(elem === 'Logout'){
            localStorage.removeItem('currentUser');
            localStorage.setItem('isCurrentUser', 'false');
            store.currentUser.rol === 'monitor'&&DataBaseFireBase.removeActivo(store.currentUser.nombre);
            this.props.his.push('/');
            return;
        }
        store.setNavItemSelected(elem);
    }

    render(){
        return(
            store.currentUser.rol === 'monitor'?
            <div className='Navigation'>
                {this.state.navigationItems.map((elem : string, index: number) => {
                    return <button key={index+' nav-item'}
                    className={store.navItemSelected === elem? 'nav-item sel': 'nav-item'}
                    style={elem === 'Logout'? {marginRight: 0} : {marginRight: '65px'}}
                    onClick={()=>this.handleClick(elem)}>
                    {elem}</button>
                })}
            </div>
            :
            <div className='Navigation'>
                <button className={store.navItemSelected === 'Inicio'? 'nav-item sel': 'nav-item'} style={{marginRight: '65px'}} onClick={()=>this.handleClick('Inicio')}>Inicio</button>
                <button className={store.navItemSelected === 'Horario'? 'nav-item sel': 'nav-item'} style={{marginRight: '65px'}} onClick={()=>this.handleClick('Horario')}>Horario</button>
                <button className='nav-item' onClick={()=>this.handleClick('Logout')}>Logout</button>
            </div>
        );
    }
}

export default Navigation;