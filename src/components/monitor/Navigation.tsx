import React from 'react';
import '../../styles/Navigation.css'
import store from '../../stores/store';
import { observer } from 'mobx-react';

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
                    return <div key={index+' nav-item'}
                    className={store.navItemSelected === elem? 'nav-item sel': 'nav-item'}
                    onClick={()=>this.handleClick(elem)}>
                    {elem}</div>
                })}
            </div>
            :
            <div className='Navigation'>
                <div className='nav-item' onClick={()=>this.handleClick('Inicio')}>Inicio</div>
                <div className='nav-item' onClick={()=>this.handleClick('Horario')}>Horario</div>
                <div className='nav-item' onClick={()=>this.handleClick('Logout')}>Logout</div>
            </div>
        );
    }
}

export default Navigation;