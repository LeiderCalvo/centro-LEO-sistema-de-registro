import React, { Component } from 'react';
import '../../styles/Progress.css'
import store from '../../stores/store';
import { observer } from 'mobx-react';

@observer
class Progress extends Component<any, any> {
    render(){
        return(
        <div className='Progress two-colums'>
            <div className="first"><div className="barra" style={{height: `${store.heightBar}%`}}></div></div>
            <div className="second">
                <h4 className='hora-final'>{store.currentUser.fin}</h4>
                <div className="advices-cont">
                    <h3>¡{store.currentUser.nombre}!</h3>
                    <p>{store.progressAdvice}</p>
                </div>
                <h4 className='hora-inicial'>{store.currentUser.inicio}</h4>
            </div>
            <div className="img-container"><img src="./images/aside.png" alt=""/></div>
        </div>
        );
    }
}

export default Progress;