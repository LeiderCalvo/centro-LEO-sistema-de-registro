import store, { Usuario, Horario } from "../stores/store";

let DataBase : any = null;

function setRef(Database: any) {
  DataBase = Database;
}

function addNewUser(usuario: Usuario) {
  DataBase.ref('cantidadUsuarios').once('value').then(function (cantUsuarios: any) {
    if(cantUsuarios.val() !== null || cantUsuarios.val() !== undefined){
      let user = {...usuario, rol: 'monitor', horasLogradas: 0, id: cantUsuarios.val()+1}
      DataBase.ref('Usuarios/'+usuario.nombre.toLowerCase()).update(user);
      DataBase.ref().update({cantidadUsuarios: cantUsuarios.val()+1});
      
      updateHorarioGeneral(user.horario, user.nombre);
    }else{
      let user = {...usuario, rol: 'monitor', horasLogradas: 0, id: 0}
      DataBase.ref('Usuarios/'+usuario.nombre.toLowerCase()).update(user);
      DataBase.ref().update({cantidadUsuarios: 0});

      updateHorarioGeneral(user.horario, user.nombre);
    }
  });
}

function updateHorarioGeneral(horario: Horario, nombre: string) {
  if(horario.lunes[0].inicio !== null)addMonitor(horario.lunes, nombre);
  if(horario.martes[0].inicio !== null)addMonitor(horario.martes, nombre);
  if(horario.miercoles[0].inicio !== null)addMonitor(horario.miercoles, nombre);
  if(horario.jueves[0].inicio !== null)addMonitor(horario.jueves, nombre);
  if(horario.viernes[0].inicio !== null)addMonitor(horario.viernes, nombre);

  DataBase.ref('Horario').once('value').then(function (horarioGen:any) {
    if(horarioGen.exists()){
      let horarioJoined = {
        lunes: horarioGen.child('lunes').exists()? [...horarioGen.val().lunes, ...horario.lunes] : [...horario.lunes],
        martes: horarioGen.child('martes').exists()? [...horarioGen.val().martes, ...horario.martes] : [...horario.martes],
        miercoles: horarioGen.child('miercoles').exists()? [...horarioGen.val().miercoles, ...horario.miercoles] : [...horario.miercoles],
        jueves: horarioGen.child('jueves').exists()? [...horarioGen.val().jueves, ...horario.jueves] : [...horario.jueves],
        viernes: horarioGen.child('viernes').exists()? [...horarioGen.val().viernes, ...horario.viernes] : [...horario.viernes]
      }
      DataBase.ref().update({Horario: horarioJoined});
    }else{
      DataBase.ref().update({Horario: horario});
    }
  });
}

function addMonitor(array: any, nombre: string) {
  return array.forEach((e: any) => {
    e.monitor = nombre;
  });
}

function getRol(user:string) {
  DataBase.ref('Usuarios/'+user.toLowerCase()+'/rol').once('value').then(function (rol:any) {
    store.setCurrentUser('rol', rol.val()+'');
  });
}

function getHorario(user:string) {
  if(store.fecha.dia===0 || store.fecha.dia >5)return;
  let dias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'];
  DataBase.ref('Usuarios/'+user.toLowerCase()+'/horario/'+dias[store.fecha.dia - 1]).once('value').then(function (dia:any) {

    store.setCurrentUser('dia', dias[store.fecha.dia - 1]);
    if(dia.val() === null || dia.val() === undefined){
      store.setCurrentUser('inicio', 'null');
      store.setCurrentUser('fin', 'null');
      return;
    }

    if(dia.val().length === 1){
      let inicio = transfomNumberToTime(dia.val()[0].inicio);
      let final = transfomNumberToTime(dia.val()[0].fin);
      store.setCurrentUser('inicio', inicio);
      store.setCurrentUser('fin', final);
      let currentTime = transfomTimeToNumber(store.fecha.hora+':'+store.fecha.minutos);
      return;
    }

    getCloserHorario(dia);
  });
}

function getCloserHorario(dia: any) {
  let dist: any = [];
  let currentTime = transfomTimeToNumber(store.fecha.hora+':'+store.fecha.minutos);
  dia.val().forEach((elem: any) => {
    dist.push(parseInt(elem.inicio)-currentTime);
   /* console.log('_________________________');
    console.log(parseInt(elem.inicio), elem.inicio + 'elem.inicio');
    console.log(currentTime, 'currentTime');
    console.log(parseInt(elem.inicio)-currentTime, 'dist');*/
  });

  let min: number = 500;
  let cercano: number = 0;

  for (let i = 0; i < dist.length; i++) {
    const elem = dist[i];
    if(Math.abs(elem) === min){
      if(elem >= 0){
        min = Math.abs(elem);
        cercano = i;
        return;
      }
    }

    if(Math.abs(elem)<min){
      min = Math.abs(elem);
      cercano = i;
    }
/*
    console.log('_____________');
    console.log(elem, 'dist'+i);
    console.log(min, 'min');
    console.log(cercano, '');*/
  }

  let inicio = transfomNumberToTime(dia.val()[cercano].inicio);
  let final = transfomNumberToTime(dia.val()[cercano].fin);

  store.setCurrentUser('inicio', inicio);
  store.setCurrentUser('fin', final);
}

function transfomNumberToTime(val:number) {
  return Math.floor(val/60) + ':' + ((val - (Math.floor(val/60)*60))<10? '0': '') + (val - (Math.floor(val/60)*60));
}

function transfomTimeToNumber(val:string) {
  return (parseInt(val.split(':')[0])  * 60 ) + parseInt(val.split(':')[1]);
}

function setRegistro(currentTime : number, currentDate: string, tipo: string) {
  DataBase.ref('Usuarios/'+store.currentUser.nombre.toLowerCase()+'/registros').push({hora: currentTime, fecha: currentDate, tipo: tipo});
}

function setHorasPerdidas(cantidad:number) {
  DataBase.ref('Usuarios/'+store.currentUser.nombre.toLowerCase()+'/horasPerdidas').once('value').then(function (horasPerdidas: any) {
    if(horasPerdidas.exists()){
      DataBase.ref('Usuarios/'+store.currentUser.nombre.toLowerCase()).update({horasPerdidas: horasPerdidas.val() + cantidad});
    }else{
      DataBase.ref('Usuarios/'+store.currentUser.nombre.toLowerCase()).update({horasPerdidas: cantidad});
    }
  });
}

export default {addNewUser, getRol, getHorario, transfomTimeToNumber, transfomNumberToTime, setRegistro, setRef, setHorasPerdidas};