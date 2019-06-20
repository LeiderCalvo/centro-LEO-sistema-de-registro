import React, { Component } from "react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { ViewState } from "@devexpress/dx-react-scheduler";
import '../../styles/Historial.css';
import {
    Scheduler,
    MonthView,
    Appointments,
    Toolbar,
    DateNavigator
} from "@devexpress/dx-react-scheduler-material-ui";
import { blue } from "@material-ui/core/colors";
import store from "../../stores/store";
import { observer } from "mobx-react";
import DataBaseFireBase from "../../utils/DataBaseFireBase";
const theme = createMuiTheme({ palette: { type: "light", primary: blue } });

@observer
class Historial extends Component<any, any>{

    constructor(porps: any){
        super(porps);
        let Appointments = [{title: 'holi', startDate: new Date(2019, 5, 20, 9, 30), endDate: new Date(2019, 6, 20, 11, 30)}];

        this.state = {
            dia: Date.now(),
            data : Appointments
        }
    }

    componentDidMount(){
        DataBaseFireBase.updateHoras(store.currentUser.nombre);
    }

    render(){
        const { data } = this.state;
        return(
            <div className="workArea Historial">
                <div className="horas">
                    <div className="hora-cont">
                        <h2>{store.horasLogradas % Math.floor(store.horasLogradas) === 0? store.horasLogradas : store.horasLogradas.toFixed(1)}</h2>
                        <p>Logradas</p>
                    </div>
                    <div className="hora-cont">
                        <h2>{store.horasAdiconales === 0? '0' : store.horasAdiconales % Math.floor(store.horasAdiconales) === 0? store.horasAdiconales : store.horasAdiconales.toFixed(1)}</h2>
                        <p>Adicionales</p>
                    </div>
                    <div className="hora-cont">
                        <h2 id='perdidas'>{store.horasPerdidas % Math.floor(store.horasPerdidas) === 0? store.horasPerdidas : store.horasPerdidas.toFixed(1)}</h2>
                        <p>Perdidas</p>
                    </div>
                </div>

                <div className="scheduler">
                    <MuiThemeProvider theme={theme}>
                        <Scheduler data={data}>
                            <ViewState defaultCurrentDate={this.state.dia} />
                            <MonthView />
                            <Toolbar />
                            <DateNavigator />
                            <Appointments />
                        </Scheduler>
                    </MuiThemeProvider>
                </div>
            </div>
        );
    }
}

export default Historial;