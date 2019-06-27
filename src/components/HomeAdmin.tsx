import React, { Component } from "react";
import { observer } from "mobx-react";
import store from "../stores/store";
import Monitor from "./Monitors";
import Navigation from "./monitor/Navigation";
import DataBaseFireBase from "../utils/DataBaseFireBase";
import Horario from "./monitor/Horario";
import Historial from "./monitor/Historial";
import Slider from "./Slider";

@observer
class HomeAdmin extends Component <any, any>{
    constructor(props: any){
        super(props);
        this.state = {
            selected: null,
            op: 1,
        }
        DataBaseFireBase.getActivos();
        setTimeout(function () {
            DataBaseFireBase.getAllExcuces();
        }, 4000);
    }

    componentDidMount(){
        this.setState({op: 0});
        setTimeout(() => {
            this.setState({op: 1});
        }, 700);
    }

    render(){
        return(
            <section className="Home two-colums" style={{opacity: this.state.op}}>
                <div className="first">
                    <Monitor/>
                </div>
        
                <div className="second">
                <Navigation his={this.props.his}/>

                {store.monitorSelected !== null?
                    <Historial/>
                :store.navItemSelected === 'Inicio'? 
                    <div className="workArea uno">
                        <p className='time' style={{color: '#88b3ff'}}>{store.currentTime.split(':')[0] + ' : '+store.currentTime.split(':')[1]}</p>
                        <p className='date' style={{color: '#88b3ff'}}>{store.currentDate}</p>
                        <Slider/>
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