import React, { Component } from "react";
import { observer } from "mobx-react";
import store from "../stores/store";
import Monitor from "./Monitors";
import Navigation from "./monitor/Navigation";
import DataBaseFireBase from "../utils/DataBaseFireBase";
import Horario from "./monitor/Horario";

@observer
class HomeAdmin extends Component <any, any>{
    constructor(props: any){
        super(props);
        DataBaseFireBase.getActivos();
    }

    render(){
        return(
            <section className="Home two-colums">
                <div className="first">
                    <Monitor/>
                </div>
        
                <div className="second">
                <Navigation his={this.props.his}/>

                {store.navItemSelected === 'Inicio'? 
                    <div className="workArea uno">
                        <p className='time' style={{color: '#88b3ff'}}>{store.currentTime.split(':')[0] + ' : '+store.currentTime.split(':')[1]}</p>
                        <p className='date' style={{color: '#88b3ff'}}>{store.currentDate}</p>
                    </div>
                :store.navItemSelected === 'Horario'&&
                    <Horario/>
                }
                </div>
            </section>
        );
    }
}

export default HomeAdmin;