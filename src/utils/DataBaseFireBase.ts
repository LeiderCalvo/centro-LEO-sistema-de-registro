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
    if(dia.val().length === 1){
      store.setCurrentUser('inicio', dia.val()[0].inicio);
      store.setCurrentUser('fin', dia.val()[0].fin);
      return;
    }

    getCloserHorario(dia);
  });

  function getCloserHorario(dia: any) {
    let dist: any = [];
    dia.val().forEach((elem: any) => {
      dist.push(parseInt(elem.inicio)-store.fecha.hora);
    });

    let min: number = 50;
    let cercano: number = 0;
    for (let i = 0; i < dist.length; i++) {
      const elem = dist[i];
      if(elem<min){
        min = elem;
        cercano = i;
      }
    }

    store.setCurrentUser('inicio', dia.val()[cercano].inicio);
    store.setCurrentUser('fin', dia.val()[cercano].fin);
  }
}

export default {addNewUser, getRol, getHorario};