import store, { Usuario } from "../stores/store";

function addNewUser(DataBase: any, usuario: Usuario) {
  DataBase.ref('cantidadUsuarios').once('value').then(function (cantUsuarios: any) {
    if(cantUsuarios.val() !== null || cantUsuarios.val() !== undefined){
      let user = {...usuario, rol: 'monitor', horasLogradas: 0, id: cantUsuarios.val()+1}
      DataBase.ref('Usuarios/'+(cantUsuarios.val()+1)).update(user);
      DataBase.ref().update({cantidadUsuarios: cantUsuarios.val()+1});
    }else{
      let user = {...usuario, rol: 'monitor', horasLogradas: 0, id: 0}
      DataBase.ref('Usuarios/'+0).update(user);
      DataBase.ref().update({cantidadUsuarios: 0});
    }
  });
}

export default {addNewUser};