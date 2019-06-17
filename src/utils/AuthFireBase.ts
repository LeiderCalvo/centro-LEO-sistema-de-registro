import store, { Usuario } from "../stores/store";

import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import firebaseCredentials from "./firebaseCredentials";
import DataBaseFireBase from "./DataBaseFireBase";

const firebaseConfig = firebaseCredentials;
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const dataBase = firebase.database();
DataBaseFireBase.setRef(dataBase);

function Login(usuario : string, password  : string, callback : any){
  if(store.isLoging)return;
  store.setLoging(true);

  auth.signInWithEmailAndPassword(usuario+'@gmail.com', password).then((a)=>{
    store.setLoging(false);
    store.setLoged(true);

    DataBaseFireBase.getRol(usuario);
    DataBaseFireBase.getHorario(usuario);
    store.setCurrentUser('nombre', usuario+'');

    store.displayToast('Bienvenido '+usuario, 'success');
    callback(true);
  }).catch(function(error) {
    if (error) {
      store.setLoging(false);
      store.setLoged(false);
      callback(false);
      store.displayToast(error+'', 'error');
      console.log('Login error ', error);
    }
  });
}

function SingUp(usuario : Usuario, callback : any){
  if(store.isLoging)return;
  store.setLoging(true);

  auth.createUserWithEmailAndPassword(usuario.nombre + '@gmail.com', usuario.password).then(()=>{
    callback(true);
    store.setLoging(false);
    store.setLoged(true);

    DataBaseFireBase.addNewUser(usuario);

    store.setCurrentUser('nombre', usuario.nombre);
    DataBaseFireBase.getHorario(usuario.nombre);
    store.setCurrentUser('rol', 'monitor');

    store.displayToast('Bienvenido '+usuario.nombre, 'success');

  }).catch(function(error) {
    if (error) {
      callback(false);
      store.setLoging(false);
      store.setLoged(false);
      store.displayToast(error+'', 'error');
      console.log('sing Up error ', error);
    }
  })
}

export default {Login, SingUp};