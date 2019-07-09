import React, { Component } from "react";
import { ViewState } from "@devexpress/dx-react-scheduler";
import {
  Scheduler,
  WeekView,
  DayView,
  Appointments,
  AppointmentTooltip,
  ViewSwitcher,
  Toolbar,
  DateNavigator
} from "@devexpress/dx-react-scheduler-material-ui";
import { withStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { blue } from "@material-ui/core/colors";
import store from "../../stores/store";
import { observer } from 'mobx-react';
import { toJS } from "mobx";
import DataBaseFireBase from "../../utils/DataBaseFireBase";

const theme = createMuiTheme({ palette: { type: "light", primary: blue } });
const style = (theme: any) => {
  return ({
    todayCell: {
      backgroundColor: fade(theme.palette.primary.main, 0.1),
      '&:hover': {
        backgroundColor: fade(theme.palette.primary.main, 0.14),
      },
      '&:focus': {
        backgroundColor: fade(theme.palette.primary.main, 0.16),
      },
    },
    weekendCell: {
      backgroundColor: fade(theme.palette.action.disabledBackground, 0.04),
      '&:hover': {
        backgroundColor: fade(theme.palette.action.disabledBackground, 0.04),
      },
      '&:focus': {
        backgroundColor: fade(theme.palette.action.disabledBackground, 0.04),
      },
    },
    today: {
      backgroundColor: fade(theme.palette.primary.main, 0.16),
    },
    weekend: {
      backgroundColor: fade(theme.palette.action.disabledBackground, 0.06),
    },
  })
};

const TimeTableCellBase = ({ classes, ...restProps }: any) => {
  const { startDate } = restProps;
  const date = new Date(startDate);
  if (date.getDate() === new Date().getDate()) {
    return <WeekView.TimeTableCell {...restProps} className={classes.todayCell} />;
  } if (date.getDay() === 0 || date.getDay() === 6) {
    return <WeekView.TimeTableCell {...restProps} className={classes.weekendCell} />;
  } return <WeekView.TimeTableCell {...restProps} />;
};

const TimeTableCell: any = withStyles(style, { name: 'TimeTableCell' })(TimeTableCellBase);

const DayScaleCellBase = ({ classes, ...restProps }: any) => {
  const { startDate, today } = restProps;
  if (today) {
    return <WeekView.DayScaleCell {...restProps} className={classes.today} />;
  } if (startDate.getDay() === 0 || startDate.getDay() === 6) {
    return <WeekView.DayScaleCell {...restProps} className={classes.weekend} />;
  } return <WeekView.DayScaleCell {...restProps} />;
};

const DayScaleCell: any = withStyles(style, { name: 'DayScaleCell' })(DayScaleCellBase);

let names: string[] = [];
let colors: string[] = ['#88b3ff', '#d6833c', '#f0c85e', '#a6c6e1', '#008057', '#365374', '#c44131', '#fef160', 'ac96c1', 'ab619d', '00967f', '544199'];
let cont: number = 0;

const Appointment = ({ children, style, ...restProps }: any) => {
  if (names.indexOf(children[1].props.data.title) === -1) {
    names.push(children[1].props.data.title);
  }

  cont = names.indexOf(children[1].props.data.title);
  if (colors.length === cont) cont = 0;

  return (<Appointments.Appointment
    {...restProps}
    style={{
      ...style,
      backgroundColor: colors[cont],
      opacity: .8,
      borderRadius: '8px',
      fontSize: '14px',
    }}
  >
    {children}
    {}
  </Appointments.Appointment>
  )
};

@observer
class Horario extends Component<any, any>{

  constructor(props: any) {
    super(props);

    this.state = {
      currentDate: '2018-06-25',
      viewName: "Week",
      todays: new Date('2018-06-25'),
    };

    this.currentDateChange = this.currentDateChange.bind(this);
  }

  currentDateChange(currentDate: any) {
    let a = new Date(currentDate);

    if(a.getTime() - this.state.todays.getTime() > 604800000) return;
    if(a.getTime() - this.state.todays.getTime() <0) return;

    this.setState({ currentDate });
  }

  formatHorario() {
    let raw: any = store.currentUser.horario && toJS(store.currentUser.horario);
    let temp: { title: string, startDate: Date, endDate: Date, }[] = [];

    for (let prop in raw) {
      if (raw.hasOwnProperty(prop)) {
        let day = prop === 'lunes' ? 25 : prop === 'martes' ? 26 : prop === 'miercoles' ? 27 : prop === 'jueves' ? 28 : prop === 'viernes' ? 29 : prop === 'sabado' ? 30 : 0;

        raw[prop].forEach((elem: any) => {
          let ini = DataBaseFireBase.transfomNumberToTime(elem.inicio);
          let fi = DataBaseFireBase.transfomNumberToTime(elem.fin);
          temp.push({
            title: store.currentUser.rol === 'admin' ? elem.monitor : store.currentUser.nombre,
            startDate: new Date(2018, 5, day, parseInt(ini.split(':')[0]), parseInt(ini.split(':')[1])),
            endDate: new Date(2018, 5, day, parseInt(fi.split(':')[0]), parseInt(fi.split(':')[1]))
          });
        });
      }
    }
    return temp;
  }

  render() {
    const { currentDate, viewName } = this.state;
    return (
      <div className="workArea Horario" style={store.currentUser.rol === 'admin' ? { height: '90%' } : { height: '90%', paddingTop: '5%' }}>
        <MuiThemeProvider theme={theme}>

          <Scheduler data={this.formatHorario()}>
            <ViewState currentDate={currentDate}
            onCurrentDateChange={this.currentDateChange}
            currentViewName={viewName}
            onCurrentViewNameChange={(viewName: any)=>{
              this.setState({viewName: viewName});
            }}/>


            <DayView startDayHour={7} endDayHour={18} />

            <WeekView startDayHour={7} endDayHour={18}
              cellDuration={30}
              timeTableCellComponent={TimeTableCell}
              dayScaleCellComponent={DayScaleCell} />
            {store.currentUser.rol === 'admin' &&
              <Toolbar />
            }
            {store.currentUser.rol === 'admin' &&
              <ViewSwitcher />
            }
            {store.currentUser.rol === 'admin' && this.state.viewName === 'Day' &&
              <DateNavigator />
            }
            <Appointments appointmentComponent={Appointment} />
            <AppointmentTooltip
              showCloseButton
            />
          </Scheduler>

        </MuiThemeProvider>
      </div>);
  }
}

export default Horario;