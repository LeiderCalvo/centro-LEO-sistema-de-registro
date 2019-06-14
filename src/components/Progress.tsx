import React, { Component } from 'react';
import '../styles/Progress.css'
import store from '../stores/store';

class Progress extends Component<any, any> {
    render(){
        return(
        <div className='Progress two-colums'>
            <div className="first"></div>
            <div className="second">
                <h4 className='hora-final'>09:30pm</h4>
                <div className="advices-cont">
                    <h3>¡{store.currentUser.nombre}!</h3>
                    <p>{store.progressAdvice}</p>
                </div>
                <h4 className='hora-inicial'>09:30pm</h4>
            </div>
            <div className="img-container"><img src="./images/aside.png" alt=""/></div>
        </div>
        );
    }
}

export default Progress;