import { observable, computed, action } from 'mobx';
import DataBaseFireBase from '../utils/DataBaseFireBase';

export type Dia = {inicio: string, fin: string};
export type Horario = {lunes: Dia[], martes: Dia[], miercoles: Dia[], jueves: Dia[], viernes: Dia[], sabado: Dia[]};
export type Usuario = {nombre: string, password: string, horario: Horario};

class Store {

    @observable dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    @observable meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    @observable fecha : {year: number,mes: number,fecha: number,dia: number,hora: number,minutos: number,segundos: number, date: any} = {year: 0,mes: 0,fecha: 0,dia: 0,hora: 0,minutos: 0,segundos: 0, date : 0};
    @observable isLoged : boolean = false;
    @observable isLoging : boolean = false;
    @observable callbackToast: any = null;
    @observable excusas : any[] = [];
    @observable opiniones : any[] = [];
    @observable navItemSelected: string = 'Inicio';
    @observable horasLogradas: number = 0;
    @observable horasAdiconales: number = 0;
    @observable horasPerdidas: number = 0;
    @observable horasTotales: number = 0;
    @observable registros: any = {};
    @observable monitoresActivos : string[] = [];
    @observable monitores: {nombre: string, activo: boolean}[] = [];
    @observable monitorSelected : string | null = null;
    @observable currentUser: {horario: Horario | null, rol: string, nombre: string, dia: string, inicio: string, fin: string, llegue: string, termine:string} = {horario: null, rol: '', nombre: '', dia: '', inicio: '', fin: '',  llegue:'false', termine:'false'};

    constructor(){
        setInterval(()=>{
            var date = new Date();
            this.fecha = {
                year: date.getFullYear(),
                mes: date.getMonth(),
                fecha: date.getDate(),
                dia: date.getDay(),
                hora: date.getHours(),
                minutos: date.getMinutes(),
                segundos: date.getSeconds(),
                date: date
            }
        }, 1000);
    }

    @action setCurrentUser(attribute: string, val: string){
        switch (attribute) {
            case 'rol':
                this.currentUser.rol = val;
                break;

            case 'nombre':
                this.currentUser.nombre = val;
                break;

            case 'dia':
                this.currentUser.dia = val;
                break;

            case 'inicio':
                this.currentUser.inicio = val;
                break;

            case 'fin':
                this.currentUser.fin = val;
                break;

            case 'llegue':
                this.currentUser.llegue = val;
                break;

            case 'termine':
                this.currentUser.termine = val;
                break;
        
            default:
                break;
        }
    }

    @action setMonitorSelected(val: string | null){
        if(val !== null){
            this.monitorSelected = val;
            setTimeout(() => {
                DataBaseFireBase.getInfoMonitor(val);
            }, 300);
        }else{
            this.monitorSelected = val;
            if(this.currentUser.rol === 'admin') DataBaseFireBase.getHorarioGen();
        }
    }

    @action setMonitores(val: {nombre: string, activo: boolean}[]){
        this.monitores = val;
    }

    @action setRegistros(val: any){
        this.registros = val;
    }

    @action setHorasLogradas(val: number){
        this.horasLogradas = val;
    }

    @action setHorasAdicionales(val: number){
        this.horasAdiconales = val;
    }

    @action setHorasPerdidas(val: number){
        this.horasPerdidas = val;
    }

    @action setHorasTotales(val: number){
        this.horasTotales = val;
    }

    @action setAllCurrentUser(val: any){
        this.currentUser = val;
    }

    @action setMonitoresActivos(val: any){
        this.monitoresActivos = val;
    }

    @action setExcusas(val: any[]){
        for (let i = 0; i < val.length; i++) {
            const elem = val[i];
            val[i].date = new Date(elem.date);
        }
        this.excusas = val;
    }

    @action setOpiniones(val: any[]){
        for (let i = 0; i < val.length; i++) {
            const elem = val[i];
            val[i].date = new Date(elem.date);
        }
        this.opiniones = val;
    }

    @computed get currentMonitors(){
        let temp :any = this.currentUser.horario;
        let temp2 : any = [];
        let currentHour = DataBaseFireBase.transfomTimeToNumber(this.fecha.hora+':'+this.fecha.minutos);
        this.currentUser.horario &&  temp[this.currentUser.dia]&& temp[this.currentUser.dia].map((user : any)=>{
            if(currentHour>user.inicio && currentHour<user.fin)temp2.push(user.monitor);
            return true;
        });
        return temp2;
    }

    @computed get heightBar(){
        let currentTime = DataBaseFireBase.transfomTimeToNumber(this.fecha.hora+':'+this.fecha.minutos);
        let inicio = DataBaseFireBase.transfomTimeToNumber(this.currentUser.inicio);
        let final = DataBaseFireBase.transfomTimeToNumber(this.currentUser.fin);
        return (currentTime - inicio) / (final - inicio) * 100;
    }

    @computed get diferenceCurrentAndInitial(){
        let currentTime = DataBaseFireBase.transfomTimeToNumber(this.fecha.hora+':'+this.fecha.minutos);
        return DataBaseFireBase.transfomTimeToNumber(this.currentUser.inicio)-currentTime;
    }

    @computed get diferenceCurrentAndFinal(){
        let currentTime = DataBaseFireBase.transfomTimeToNumber(this.fecha.hora+':'+this.fecha.minutos);
        return DataBaseFireBase.transfomTimeToNumber(this.currentUser.fin)-currentTime;
    }

    @computed get currentTime(){
        return this.fecha.hora + ':' + (this.fecha.minutos <10? '0'+this.fecha.minutos : this.fecha.minutos) + ':' + (this.fecha.segundos <10? '0'+this.fecha.segundos : this.fecha.segundos);
    }

    @computed get currentDate(){
        return this.dias[this.fecha.dia - 1] + ', ' + this.fecha.fecha + ' de ' + this.meses[this.fecha.mes] + ' ' + this.fecha.year;
    }

    @computed get progressAdvice(){
        switch (this.navItemSelected) {
            case 'Inicio':
                return `Recuerda que si no registras tu llegada con 7 minutos máximo de tardanza, se te descontará de tus horas. #SoyTutorLeo`;
            
            case 'Horario':
                return 'El marcador naranja en tu horario, corresponde a las horas adicionales que te hayan sido asignadas últimamente. #AprendoEnseñando';

            case 'Excusas':
                return 'El soporte fotográfico es opcional, pero sin duda es mejor tenerlo, presiona el link naranja y luego arrastra una foto de tu excusa hasta la zona de carga. #SoyTutorLeo';

            case 'Historial':
                return `Hecha un vistazo a tu registro de trabajo en horas. El marcador gris en tu historial corresponde a los días que has faltado con excusa. #AprendoEnseñando`;

            case 'Opiniones':
                return `Guarda diariamente las experiencias adquiridas enseñando durante los turnos. #AprendoEnseñando`;
        
            default:
                return 'Cargando ...';
        }
    }

    @action setHorario(val : Horario | null){
        this.currentUser.horario = val;
    }

    @action setNavItemSelected(val: string){
        this.navItemSelected = val;
    }

    @action setLoged(val : boolean){
        this.isLoged = val;
    }

    @action setLoging(val : boolean){
        this.isLoging = val;
    }

    @action setCallBackToast(val : any){
        this.callbackToast = val;
    }

    displayToast(msj : string, appearance : string){
        this.callbackToast(msj, appearance);
    }
}

const store = new Store();
export default store;