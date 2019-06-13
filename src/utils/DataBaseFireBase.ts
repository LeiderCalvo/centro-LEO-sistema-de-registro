import store, { Usuario, Horario } from "../stores/store";

function addNewUser(DataBase: any, usuario: Usuario) {
  DataBase.ref('cantidadUsuarios').once('value').then(function (cantUsuarios: any) {
    if(cantUsuarios.val() !== null || cantUsuarios.val() !== undefined){
      let user = {...usuario, rol: 'monitor', horasLogradas: 0, id: cantUsuarios.val()+1}
      DataBase.ref('Usuarios/'+(cantUsuarios.val()+1)).update(user);
      DataBase.ref().update({cantidadUsuarios: cantUsuarios.val()+1});
      
      updateHorarioGeneral(DataBase, user.horario, user.nombre);
    }else{
      let user = {...usuario, rol: 'monitor', horasLogradas: 0, id: 0}
      DataBase.ref('Usuarios/'+0).update(user);
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

export default {addNewUser};