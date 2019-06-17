import store, { Usuario, Horario } from "../stores/store";

function addNewUser(DataBase: any, usuario: Usuario) {
  DataBase.ref('cantidadUsuarios').once('value').then(function (cantUsuarios: any) {
    if(cantUsuarios.val() !== null || cantUsuarios.val() !== undefined){
      let user = {...usuario, rol: 'monitor', horasLogradas: 0, id: cantUsuarios.val()+1}
      DataBase.ref('Usuarios/'+usuario.nombre.toLowerCase()).update(user);
      DataBase.ref().update({cantidadUsuarios: cantUsuarios.val()+1});
      
      updateHorarioGeneral(DataBase, user.horario, user.nombre);
    }else{
      let user = {...usuario, rol: 'monitor', horasLogradas: 0, id: 0}
      DataBase.ref('Usuarios/'+usuario.nombre.toLowerCase()).update(user);
      DataBase.ref().update({cantidadUsuarios: 0});

      updateHorarioGeneral(DataBase, user.horario, user.nombre);
    }
  });
}

function updateHorarioGeneral(DataBase: any, horario: Horario, nombre: string) {
  addMonitor(horario.lunes, nombre);
  addMonitor(horario.martes, nombre);
  addMonitor(horario.miercoles, nombre);
  addMonitor(horario.jueves, nombre);
  addMonitor(horario.viernes, nombre);

  DataBase.ref('Horario').once('value').then(function (horarioGen:any) {
    if(horarioGen.val() !== null && horarioGen.val() !== undefined){
      let horarioJoined = {
        lunes: [...horarioGen.val().lunes, ...horario.lunes],
        martes: [...horarioGen.val().martes, ...horario.martes],
        miercoles: [...horarioGen.val().miercoles, ...horario.miercoles],
        jueves: [...horarioGen.val().jueves, ...horario.jueves],
        viernes: [...horarioGen.val().viernes, ...horario.viernes]
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

function getRol(DataBase: any, user:string) {
  DataBase.ref('Usuarios/'+user.toLowerCase()+'/rol').once('value').then(function (rol:any) {
    store.setCurrentUser('rol', rol.val()+'');
  });
}

function getHorario(DataBase: any, user:string) {
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
    console.log('_________________________');
    console.log(parseInt(elem.inicio), elem.inicio + 'elem.inicio');
    console.log(currentTime, 'currentTime');
    console.log(parseInt(elem.inicio)-currentTime, 'dist');
  });

  console.log('####################3');
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

    console.log('_____________');
    console.log(elem, 'dist'+i);
    console.log(min, 'min');
    console.log(cercano, '');
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

export default {addNewUser, getRol, getHorario, transfomTimeToNumber, transfomNumberToTime};