import { observable, computed, action } from 'mobx';

export type Dia = {inicio: string, fin: string};
export type Horario = {lunes: Dia[], martes: Dia[], miercoles: Dia[], jueves: Dia[], viernes: Dia[]};
export type Usuario = {nombre: string, password: string, horario: Horario};

class Store {

    @observable fecha : {year: number,mes: number,fecha: number,dia: number,hora: number,minutos: number,segundos: number, date: any} = {year: 0,mes: 0,fecha: 0,dia: 0,hora: 0,minutos: 0,segundos: 0, date : 0};
    @observable isLoged : boolean = false;
    @observable isLoging : boolean = false;
    @observable callbackToast: any = null;
    @observable navItemSelected: string = 'Inicio';

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