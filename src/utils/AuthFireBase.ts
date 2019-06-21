import store, { Usuario } from "../stores/store";

import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";
import firebaseCredentials from "./firebaseCredentials";
import DataBaseFireBase from "./DataBaseFireBase";
import StorageFireBase from "./StorageFireBase";

const firebaseConfig = firebaseCredentials;
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();

const dataBase = firebase.database();
DataBaseFireBase.setRef(dataBase);

const storage = firebase.storage();
StorageFireBase.setRef(storage);

function Login(usuario : string, password  : string, callback : any){
  if(store.isLoging)return;
  store.setLoging(true);

  auth.signInWithEmailAndPassword(usuario+'@gmail.com', password).then((a)=>{
    store.setLoging(false);
    store.setLoged(true);

    DataBaseFireBase.getRol(usuario);
    updateStore(usuario);
    addToLocal();

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
    
    store.setCurrentUser('rol', 'monitor');
    updateStore(usuario.nombre);

    addToLocal();
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

function updateStore(usuario: string) {
  DataBaseFireBase.getHorario(usuario);
  store.setCurrentUser('nombre', usuario+'');
  DataBaseFireBase.updateHoras(usuario);
  DataBaseFireBase.updateRegistro(store.currentUser.nombre);
}

function addToLocal() {
  setTimeout(() => {
    localStorage.setItem('isCurrentUser', 'true');
    localStorage.setItem('currentUser', JSON.stringify(store.currentUser));
  }, 2000);
}

function ReadLocal() {
  if(localStorage.getItem('isCurrentUser') === 'true'){
    let user = localStorage.getItem('currentUser');
    let use = user !== null && JSON.parse(user);
    use !== null && store.setAllCurrentUser(use);
    return true;
  }else{
    return false;
  }
}

export default {Login, SingUp, ReadLocal, updateStore};