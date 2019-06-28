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

const Appointment = ({children, style, ...restProps}: any) => (
    <Appointments.Appointment
      {...restProps}
      style={{
        ...style,
        backgroundColor: children[1].props.data.title === 'excusa'? '#c6c6c6' : children[1].props.data.title === 'adicional'? '#d6833c':'#88b3ff',
        borderRadius: '8px',
      }}
    >
      {children}
    </Appointments.Appointment>
  );

@observer
class Historial extends Component<any, any>{

    constructor(porps: any){
        super(porps);

        this.state = {
            dia: Date.now()
        }
    }

    formatRegistro(){
        let raw : any = store.registros && store.registros;
        
        let temp : {title: string, startDate: Date, endDate: Date,}[] = [];

        for (let prop in raw) {
            if (raw.hasOwnProperty(prop)) {
                let elem = raw[prop];
                if(elem.fecha === null || elem.fecha === undefined)break;
                
                let ini = DataBaseFireBase.transfomNumberToTime(elem.hora);
                let fi = DataBaseFireBase.transfomNumberToTime(elem.hora + 30);

                elem.fecha = elem.fecha.replace(' de', '');

                let fecIni = new Date(elem.fecha);
                fecIni.setHours(parseInt(ini.split(':')[0]));
                fecIni.setMinutes(parseInt(ini.split(':')[1]));

                let fecFin = new Date(elem.fecha);
                fecFin.setHours(parseInt(fi.split(':')[0]));
                fecFin.setMinutes(parseInt(fi.split(':')[1]));

                temp.push({
                    title: elem.tipo,
                    startDate: fecIni,
                    endDate: fecFin
                });
            }
        }
        return temp;
    }

    componentDidMount(){
        DataBaseFireBase.updateHoras(store.currentUser.nombre);
        DataBaseFireBase.updateRegistro(store.currentUser.nombre);
    }

    render(){
        return(
            <div className="workArea Historial">
                <div className="horas">
                    <div className="hora-cont">
                        <h2>{store.horasLogradas === 0? '0' :store.horasLogradas % Math.floor(store.horasLogradas) === 0? store.horasLogradas : store.horasLogradas.toFixed(1)}</h2>
                        <p>Logradas</p>
                    </div>
                    <div className="hora-cont">
                        <h2>{store.horasAdiconales === 0? '0' : store.horasAdiconales % Math.floor(store.horasAdiconales) === 0? store.horasAdiconales : store.horasAdiconales.toFixed(1)}</h2>
                        <p>Adicionales</p>
                    </div>
                    <div className="hora-cont">
                        <h2 id='perdidas'>{store.horasPerdidas === 0? '0' :store.horasPerdidas % Math.floor(store.horasPerdidas) === 0? store.horasPerdidas : store.horasPerdidas.toFixed(1)}</h2>
                        <p>Pendientes</p>
                    </div>
                </div>

                <div className="scheduler">
                    <MuiThemeProvider theme={theme}>
                        <Scheduler data={this.formatRegistro()}>
                            <ViewState defaultCurrentDate={this.state.dia} />
                            <MonthView />
                            <Toolbar />
                            <DateNavigator />
                            <Appointments appointmentComponent={Appointment}/>
                        </Scheduler>
                    </MuiThemeProvider>
                </div>
            </div>
        );
    }
}

export default Historial;