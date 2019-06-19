import React from 'react';
import '../../styles/Navigation.css'
import store from '../../stores/store';
import { observer } from 'mobx-react';

@observer
class Navigation extends React.Component<any, any>{

    constructor(props: any){
        super(props);
        this.state = {
            navigationItems : ['Inicio', 'Horario', 'Excusas', 'Logout', 'Historial']
        }
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(elem : string){
        console.log(elem);
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
            <div className='Navigation'>
                {this.state.navigationItems.map((elem : string, index: number) => {
                    return <div key={index+' nav-item'}
                    className={elem === 'Historial'? 'nav-item btn' : store.navItemSelected === elem? 'nav-item sel': 'nav-item'}
                    onClick={()=>this.handleClick(elem)}>
                    {elem}</div>
                })}
            </div>
        );
    }
}

export default Navigation;