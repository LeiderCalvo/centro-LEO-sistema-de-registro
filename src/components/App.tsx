import React, { Component } from "react";
import { observer } from "mobx-react";
import store from "../stores/store";
import Home from "./Home";
import HomeAdmin from "./HomeAdmin";
import AuthFireBase from "../utils/AuthFireBase";
import DataBaseFireBase from "../utils/DataBaseFireBase";

@observer
class App extends Component <any, any>{
    componentDidMount(){
        setTimeout(() => {
            if(AuthFireBase.ReadLocal() === false)this.props.history.push('/');

            if(store.currentUser.rol === 'admin'){
                DataBaseFireBase.getHorarioGen();
                DataBaseFireBase.getMonitores();
            }
            
        }, 3000);
    }

    render(){
        return(
            store.currentUser.rol === 'monitor'?
                <Home his={this.props.history}/>
            :
            store.currentUser.rol === 'admin'?
                <HomeAdmin his={this.props.history}/>
            :
                <div className="loading">

                </div>
        );
    }
}

export default App;