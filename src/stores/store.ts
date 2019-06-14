import { observable, computed, action } from 'mobx';

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
    @observable currentUser: {rol: string, nombre: string, dia: string, inicio: string, fin: string} = {rol: '', nombre: '', dia: '', inicio: '', fin: ''};
    @observable progressAdvice: string = 'Recuerda que si no registras tu llegada o salida con 5 minutos máximo de tardanza, se te descontará de tus horas.';

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
            this.heightBar = this.fecha.hora / parseInt(this.currentUser.fin) * 100;
            console.log(this.heightBar);
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
        
            default:
                break;
        }
    }

    @action setProgressAdvice(val: string){
        this.progressAdvice = val;
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