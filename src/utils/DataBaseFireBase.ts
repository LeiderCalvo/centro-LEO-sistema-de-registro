import store, { Horario } from "../stores/store";

let DataBase: any = null;

function setRef(Database: any) {
  DataBase = Database;
}

function addNewUser(usuario: { nombre: '', password: ''}) {
  DataBase.ref('cantidadUsuarios').once('value').then(function (cantUsuarios: any) {
    if (cantUsuarios.val() !== null || cantUsuarios.val() !== undefined) {
      let user = { ...usuario, rol: 'monitor', horasLogradas: 0, id: cantUsuarios.val() + 1 }
      DataBase.ref('Usuarios/' + usuario.nombre.toLowerCase()).update(user);
      DataBase.ref().update({ cantidadUsuarios: cantUsuarios.val() + 1 });

      //updateHorarioGeneral(user.horario, user.nombre);
    } else {
      let user = { ...usuario, rol: 'monitor', horasLogradas: 0, id: 0 }
      DataBase.ref('Usuarios/' + usuario.nombre.toLowerCase()).update(user);
      DataBase.ref().update({ cantidadUsuarios: 0 });

      //updateHorarioGeneral(user.horario, user.nombre);
    }
  });

  DataBase.ref('monitores').once('value').then(function (monitores: any) {
    if (monitores.exists()) {
      DataBase.ref('monitores').set([...monitores.val(), usuario.nombre]);
    } else {
      DataBase.ref('monitores').set([usuario.nombre]);
    }
  });
}

function updateHorarioGeneral(horario: Horario, nombre: string) {
  let hor : any = horario;
  for (const prop in hor) {
    if (hor[prop][0].inicio !== null) addMonitor(hor[prop], nombre);
  }

  DataBase.ref('Horario').once('value').then(function (horarioGen: any) {
    if (horarioGen.exists()) {
      let ARR : any = horarioGen.val();
      
      for (const prop in horarioGen.val()) {
        if (horarioGen.val().hasOwnProperty(prop)) {
          ARR[prop] = horarioGen.val()[prop].filter((object: any)=>{
            //console.log(object.monitor, nombre);
            return object.monitor !== nombre;
          });
        }
      }

      let horarioJoined : any = ARR;
      for (const prop in hor) {
        if(horarioGen.child(prop+'').exists()){
          horarioJoined[prop] = [...ARR[prop], ...hor[prop]];
        }else {
          horarioJoined[prop] = [...hor[prop]];
        }
      }
      /*
            let horarioJoined = {
              lunes: horarioGen.child('lunes').exists() ? [...horarioGen.val().lunes, ...horario.lunes] : [...horario.lunes],
              martes: horarioGen.child('martes').exists() ? [...horarioGen.val().martes, ...horario.martes] : [...horario.martes],
              miercoles: horarioGen.child('miercoles').exists() ? [...horarioGen.val().miercoles, ...horario.miercoles] : [...horario.miercoles],
              jueves: horarioGen.child('jueves').exists() ? [...horarioGen.val().jueves, ...horario.jueves] : [...horario.jueves],
              viernes: horarioGen.child('viernes').exists() ? [...horarioGen.val().viernes, ...horario.viernes] : [...horario.viernes],
              sabado: horarioGen.child('sabado').exists() ? [...horarioGen.val().sabado, ...horario.sabado] : [...horario.sabado]
            }
      */



      DataBase.ref().update({ Horario: horarioJoined });
    } else {
      DataBase.ref().update({ Horario: horario });
    }
  });
}

function addMonitor(array: any, nombre: string) {
  return array.forEach((e: any) => {
    e.monitor = nombre;
  });
}

function getRol(user: string) {
  DataBase.ref('Usuarios/' + user.toLowerCase() + '/rol').once('value').then(function (rol: any) {
    store.setCurrentUser('rol', rol.val() + '');
    return rol.val() + '';
  });
}

function getHorarioGen() {
  DataBase.ref('Horario').once('value').then(function (horario: any) {
    if (horario.exists()) {
      store.setHorario(horario.val());
    } else {
      store.setHorario(null);
    }
  });
}

function getMonitores() {
  DataBase.ref('monitores').once('value').then(function (monitores: any) {
    if (monitores.exists()) {
      let temp: { nombre: string, activo: boolean }[] = [];
      monitores.val().forEach((elem: any) => {
        temp.push({ nombre: elem, activo: false });
      });
      store.setMonitores(temp);
    } else {
      store.setMonitores([]);
    }
  });
}
//aqui perro
function updateHorarioMonitor(user:string) {
  DataBase.ref('Usuarios/' + user.toLowerCase() + '/horario').once('value').then(function (horario: any) {
    if (horario.exists()) {
      store.setHorario(horario.val());
    } else {
      store.setHorario(null);
    }
  });
}

function getHorario(user: string) {
  DataBase.ref('Usuarios/' + user.toLowerCase() + '/horario').once('value').then(function (horario: any) {
    if (horario.exists()) {
      store.setHorario(horario.val());
    } else {
      store.setHorario(null);
    }
  });

  if (store.fecha.dia === 0 || store.fecha.dia > 6) return;
  let dias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
  store.setCurrentUser('dia', dias[store.fecha.dia - 1]);
  let arrayTemp: any[] = [];

  DataBase.ref('Usuarios/' + user.toLowerCase() + '/horario/' + dias[store.fecha.dia - 1]).once('value').then(function (dia: any) {
    if (dia.val() !== null && dia.val() !== undefined) {
      arrayTemp = [...arrayTemp, ...dia.val()];
    }

    DataBase.ref('Usuarios/' + store.currentUser.nombre.toLowerCase() + '/adicionalesPendientes').once('value').then(function (adicional: any) {

      if (adicional.val() !== null && adicional.val() !== undefined) {
        let arr = [];
        for (const prop in adicional.val()) {
          if (adicional.val().hasOwnProperty(prop)) {
            const elem = adicional.val()[prop];
            //let temp = new Date(elem.fecha.replace(' de', ''));
            let temp = new Date(parseInt(elem.fecha));
            if (temp.getFullYear() === store.fecha.year && temp.getMonth() === store.fecha.mes && temp.getDay() === store.fecha.dia) {
              elem.id = prop;
              arr.push(elem);
            }
          }
        }
        arrayTemp = [...arrayTemp, ...arr];
      }

      getCloserHorario(arrayTemp);
    });
  });
}
/*
function getCloserHorario(dia: any) {

  if (dia.length === 0) {
    store.setCurrentUser('inicio', 'null');
    store.setCurrentUser('fin', 'null');
    return;
  }

  let dist: any = [];
  let currentTime = transfomTimeToNumber(store.fecha.hora + ':' + store.fecha.minutos);
  dia.forEach((elem: any) => {
    dist.push(parseInt(elem.inicio) - currentTime);
  });

  let min: number = 500;
  let cercano: number = 0;

  for (let i = 0; i < dist.length; i++) {
    const elem = dist[i];
    if (Math.abs(elem) === min) {
      if (elem >= 0) {
        min = Math.abs(elem);
        cercano = i;
        return;
      }
    }

    if (Math.abs(elem) < min) {
      min = Math.abs(elem);
      cercano = i;
    }
  }

  let inicio = transfomNumberToTime(dia[cercano].inicio);
  let final = transfomNumberToTime(dia[cercano].fin);

  if(dia[cercano].fecha !== null && dia[cercano].fecha!== undefined){ 
    DataBase.ref('Usuarios/' + store.currentUser.nombre.toLowerCase() + '/adicionalesPendientes/'+dia[cercano].id).set({});
  }

  store.setCurrentUser('inicio', inicio);
  store.setCurrentUser('fin', final);
}
*/
function getCloserHorario(dia: any) {

  if (dia.length === 0) {
    store.setCurrentUser('inicio', 'null');
    store.setCurrentUser('fin', 'null');
    return;
  }

  let currentTime = transfomTimeToNumber(store.fecha.hora + ':' + store.fecha.minutos);
  let dist: any = [];
  dia.forEach((elem: any) => {
    dist.push(parseInt(elem.inicio) - currentTime);
  });

  let min: number = 500;
  let cercano: number = 0;

  for (let i = 0; i < dist.length; i++) {
    const elem = dist[i];
    if (Math.abs(elem) === min) {
      if (elem >= 0) {
        min = Math.abs(elem);
        cercano = i;
        break;
      }
    }

    if (Math.abs(elem) < min) {
      min = Math.abs(elem);
      cercano = i;
    }
  }

  if (dia[cercano].fin <= currentTime) {
    store.setCurrentUser('inicio', 'null');
    store.setCurrentUser('fin', 'null');
    return;
  }

  let inicio = transfomNumberToTime(dia[cercano].inicio);
  let final = transfomNumberToTime(dia[cercano].fin);

  if(dia[cercano].fecha !== null && dia[cercano].fecha!== undefined && dia[cercano].id !== null && dia[cercano].id!== undefined){ 
    DataBase.ref('Usuarios/' + store.currentUser.nombre.toLowerCase() + '/adicionalesPendientes/'+dia[cercano].id).set({});
  }

  store.setCurrentUser('inicio', inicio);
  store.setCurrentUser('fin', final);
}

function transfomNumberToTime(val: number) {
  return Math.floor(val / 60) + ':' + ((val - (Math.floor(val / 60) * 60)) < 10 ? '0' : '') + (val - (Math.floor(val / 60) * 60));
}

function transfomTimeToNumber(val: string) {
  return (parseInt(val.split(':')[0]) * 60) + parseInt(val.split(':')[1]);
}

function setRegistro(currentTime: number, currentDate: number, tipo: string) {
  DataBase.ref('Usuarios/' + store.currentUser.nombre.toLowerCase() + '/registros').push({ hora: currentTime, fecha: currentDate, tipo: tipo });
}

function setRegistroEsp(monitor: string, currentTime: number, currentDate: number, tipo: string) {
  DataBase.ref('Usuarios/' + monitor.toLowerCase() + '/registros').push({ hora: currentTime, fecha: currentDate, tipo: tipo });
}

function setHorasPerdidas(cantidad: number) {
  DataBase.ref('Usuarios/' + store.currentUser.nombre.toLowerCase() + '/horasPerdidas').once('value').then(function (horasPerdidas: any) {
    if (horasPerdidas.exists()) {
      DataBase.ref('Usuarios/' + store.currentUser.nombre.toLowerCase()).update({ horasPerdidas: horasPerdidas.val() + cantidad });
    } else {
      DataBase.ref('Usuarios/' + store.currentUser.nombre.toLowerCase()).update({ horasPerdidas: cantidad });
    }
  });
}

function setHorasLogradas(cantidad: number) {
  DataBase.ref('Usuarios/' + store.currentUser.nombre.toLowerCase() + '/horasLogradas').once('value').then(function (horasLogradas: any) {
    if (horasLogradas.exists()) {
      DataBase.ref('Usuarios/' + store.currentUser.nombre.toLowerCase()).update({ horasLogradas: horasLogradas.val() + cantidad });
    } else {
      DataBase.ref('Usuarios/' + store.currentUser.nombre.toLowerCase()).update({ horasLogradas: cantidad });
    }
  });
}

function addNewOpinion (object: {}) {
  DataBase.ref('Usuarios/' + store.currentUser.nombre.toLowerCase() + '/opiniones').push(object, function (error: any) {
    if (error) {
      store.displayToast(error, 'error');
    } else {
      store.displayToast('Tu opinion ha sido guardada', 'success');
    }
  });
}

function addNewExcuse(time: number, object: {}) {
  DataBase.ref('Usuarios/' + store.currentUser.nombre.toLowerCase() + '/excusas').push({ ...object, date: time }, function (error: any) {
    if (error) {
      store.displayToast(error, 'error');
    } else {
      store.displayToast('Tu excusa ha sido guardada', 'success');
    }
  });
}

function getAllExcuces() {
  let temp2: any[] = [];
  for (let i = 0; i < store.monitores.length; i++) {
    const elem = store.monitores[i];
    DataBase.ref('Usuarios/' + elem.nombre.toLowerCase() + '/excusas').on('value',
      function (excusas: any) {
        if (excusas.exists()) {
          for (const prop in excusas.val()) {
            if (excusas.val().hasOwnProperty(prop)) {
              const element = excusas.val()[prop];
              let temp = new Date(element.fecha.replace(' de', ''));
              if (temp.getTime() - Date.now() > 0) {
                store.displayToast(elem.nombre + ' tiene excusas pendientes', 'info');
                element.monitor = elem.nombre;
                temp2.push(element);
              }
            }
          }
          store.setExcusas(temp2);
        }
      });
  }
}

function getOpiniones(user: string) {
  DataBase.ref('Usuarios/' + user.toLowerCase() + '/opiniones').on('value',
    function (opiniones: any) {
      if (opiniones.exists()) {
        let opinions = [];
        for (const prop in opiniones.val()) {
          if (opiniones.val().hasOwnProperty(prop)) {
            const element = opiniones.val()[prop];
            opinions.push(element);
          }
        }
        store.setOpiniones(opinions);
      } else {
        store.setOpiniones([]);
      }
    });
}

function getExcuces(user: string) {
  DataBase.ref('Usuarios/' + user.toLowerCase() + '/excusas').on('value',
    function (excusas: any) {
      if (excusas.exists()) {
        let excuces = [];
        for (const prop in excusas.val()) {
          if (excusas.val().hasOwnProperty(prop)) {
            const element = excusas.val()[prop];
            excuces.push(element);
          }
        }
        store.setExcusas(excuces);
      } else {
        store.setExcusas([]);
      }
    });
}

function updateRegistro(user: string) {
  if (user === null || user === undefined) return;
  DataBase.ref('Usuarios/' + user.toLowerCase() + '/registros').on('value', function (registros: any) {
    registros.exists() ? store.setRegistros(registros.val()) : store.setRegistros({});
  });
  return;
}

function updateHoras(user: string) {
  if (user === null || user === undefined) return;
  DataBase.ref('Usuarios/' + user.toLowerCase() + '/horasLogradas').on('value', function (hora: any) {
    hora.exists() ? store.setHorasLogradas(hora.val()) : store.setHorasLogradas(0);
  });

  DataBase.ref('Usuarios/' + user.toLowerCase() + '/horasPerdidas').on('value', function (hora: any) {
    hora.exists() ? store.setHorasPerdidas(hora.val()) : store.setHorasPerdidas(0);
  });

  DataBase.ref('Usuarios/' + user.toLowerCase() + '/horasAdicionales').on('value', function (hora: any) {
    hora.exists() ? store.setHorasAdicionales(hora.val()) : store.setHorasAdicionales(0);
  });
}


//////////////////////////////////////////////////////////

function getActivos() {
  DataBase.ref('monitoresActivos').on('value', function (activos: any) {
    activos.exists() ? store.setMonitoresActivos(activos.val()) : store.setMonitoresActivos([]);
  });
}

function setActivo(name: string) {
  DataBase.ref('monitoresActivos').once('value').then(function (activos: any) {
    if (activos.exists()) {
      DataBase.ref('monitoresActivos').set([...activos.val(), name]);
    } else {
      DataBase.ref('monitoresActivos').set([name]);
    }
  });
}

function removeActivo(name: string) {
  DataBase.ref('monitoresActivos').once('value').then(function (activos: any) {
    let temp = [];
    for (let i = 0; i < activos.length; i++) {
      const elem = activos[i];
      if (elem === name) break;
      temp.push(elem);
    }
    DataBase.ref('monitoresActivos').set(temp);
  });
}

function getInfoMonitor(nombre: string) {
  if(nombre === null || nombre === undefined) return;
  updateHoras(nombre);
  updateRegistro(nombre);
  updateHorarioMonitor(nombre);
}

function setHoraAdicional(user: string, hora: number, horafin: number, date: string) {
  DataBase.ref('Usuarios/' + user.toLowerCase() + '/adicionalesPendientes').push({ inicio: hora, fin: horafin, fecha: date });
  store.displayToast('el horario adiconal se ha asignado con éxito', 'success');
}

function setHorario(user: String, hor: Horario){
  DataBase.ref('Usuarios/' + user.toLowerCase()).update({horario: hor});
  updateHorarioGeneral(hor,user+'');
}

function getMyAditionals() {
  DataBase.ref('Usuarios/' + store.currentUser.nombre.toLowerCase() + '/adicionalesPendientes').on('value', function (adicional: any) {
    if (adicional.exists()) {
      for (const prop in adicional.val()) {
        if (adicional.val().hasOwnProperty(prop)) {
          const elem = adicional.val()[prop];
          store.displayToast('Tienes horas adcionales pendientes para el ' + elem.fecha + ' a las ' + transfomNumberToTime(elem.inicio) + ' hasta las ' + transfomNumberToTime(elem.fin), 'info');
        }
      }
    }
  });
}


export default {
  addNewUser, getRol, getHorario, transfomTimeToNumber, setHorasLogradas, transfomNumberToTime, setRegistro, setRef, setHorasPerdidas, addNewExcuse, getExcuces, updateHoras, updateRegistro, getHorarioGen, getMonitores, setActivo, removeActivo, getActivos, getInfoMonitor, getAllExcuces, setHoraAdicional, setRegistroEsp,
  getMyAditionals, setHorario, updateHorarioMonitor, getOpiniones, addNewOpinion
};