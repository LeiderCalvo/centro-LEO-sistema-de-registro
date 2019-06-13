import store, { Usuario } from "../stores/store";

import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseCredentials from "./firebaseCredentials";
import DataBaseFireBase from "./DataBaseFireBase";

const firebaseConfig = firebaseCredentials;
firebase.initializeApp(firebaseConfig);

let auth = firebase.auth();

function Login(usuario : string, password  : string, callback : any){
  if(store.isLoging)return;
  store.setLoging(true);

  auth.signInWithEmailAndPassword(usuario+'@gmail.com', password).then((a)=>{
    store.setLoging(false);
    store.setLoged(true);
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

  auth.createUserWithEmailAndPassword(usuario.nombre, usuario.password).then(()=>{
    callback(true);
    store.setLoging(false);
    store.setLoged(true);
    //RegistrarPersonaje(a.user.email.split('@')[0], correo, password);
  }).catch(function(error) {
    if (error) {
      callback(false);
      store.setLoging(false);
      store.setLoged(false);
      console.log('sing Up error ', error);
    }
  })
}

export default {Login, SingUp};