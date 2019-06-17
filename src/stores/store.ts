import { observable, computed, action } from 'mobx';
import DataBaseFireBase from '../utils/DataBaseFireBase';

export type Dia = {inicio: string, fin: string};
export type Horario = {lunes: Dia[], martes: Dia[], miercoles: Dia[], jueves: Dia[], viernes: Dia[]};
export type Usuario = {nombre: string, password: string, horario: Horario};

class Store {

    @observable fecha : {year: number,mes: number,fecha: number,dia: number,hora: number,minutos: number,segundos: number, date: any} = {year: 0,mes: 0,fecha: 0,dia: 0,hora: 0,minutos: 0,segundos: 0, date : 0};
    @observable isLoged : boolean = false;
    @observable isLoging : boolean = false;
    @observable callbackToast: any = null;
    @observable heightBar: number = 0;
    @observable navItemSelected: string = 'Inicio';
    @observable currentUser: {rol: string, nombre: string, dia: string, inicio: string, fin: string, delay: string, llegue: string, termine:string} = {rol: '', nombre: '', dia: '', inicio: '', fin: '', delay:'', llegue:'', termine:''};

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

            //this.heightBar = this.fecha.hora / parseInt(this.currentUser.fin) * 100;
            //console.log(this.heightBar);
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

            case 'delay':
                this.currentUser.delay = val;
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

    @computed get diferenceCurrentAndInitial(){
        let currentTime = DataBaseFireBase.transfomTimeToNumber(this.fecha.hora+':'+this.fecha.minutos);
        return DataBaseFireBase.transfomTimeToNumber(this.currentUser.inicio)-currentTime;
    }

    @computed get currentTime(){
        return this.fecha.hora + ':' + (this.fecha.minutos <10? '0'+this.fecha.minutos : this.fecha.minutos) + ':' + (this.fecha.segundos <10? '0'+this.fecha.segundos : this.fecha.segundos);
    }

    @computed get currentDate(){
        let dias = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'];
        let meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        return dias[this.fecha.dia - 1] + ', ' + this.fecha.fecha + ' de ' + meses[this.fecha.mes] + ' ' + this.fecha.year;
    }

    @computed get progressAdvice(){
        switch (this.navItemSelected) {
            case 'Inicio':
                return 'Recuerda que si no registras tu llegada o salida con 5 minutos máximo de tardanza, se te descontará de tus horas.';
            
            case 'Horario':
                return 'Los marcadores naranja en tu horario corresponden a las horas adicionales que te hayan sido asignadas últimamente.';

            case 'Excusas':
                return 'El soporte fotográfico es opcional, pero sin duda es mejor tenerlo, presiona el link naranja y luego arrastra una foto de tu excusa hasta la zona de carga.';

            case 'Excusas':
                return 'El soporte fotográfico es opcional, pero sin duda es mejor tenerlo, presiona el link naranja y luego arrastra una foto de tu excusa hasta la zona de carga.';

            case 'Historial':
                return `Hecha un vistazo a tu registro de trabajo en horas.

                Los marcadores grises en tu historial corresponden a las horas que has faltado con o sin excusa.`;
        
            default:
                return 'Cargando ...';
        }
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