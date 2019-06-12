import store from "../stores/store";

import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseCredentials from "./firebaseCredentials";

const firebaseConfig = firebaseCredentials;
firebase.initializeApp(firebaseConfig);

let auth = firebase.auth();

function Login(usuario : string, password  : string, callback : any){
  if(store.isLoged)return;
  store.setLoged(true);

  auth.signInWithEmailAndPassword(usuario, password).then((a)=>{
    store.setLoged(false);
    callback(true);
  }).catch(function(error) {
    if (error) {
      store.setLoged(false);
      callback(false);
      console.log('Login error ', error);
      store.displayToast(error+'', 'error');
    }
  });
}

function SingUp(correo : string, password  : string, name  : string, callback : any){
  if(store.isLoged)return;
  store.setLoged(true);

  auth.createUserWithEmailAndPassword(correo, password).then(()=>{
    callback(true);
    store.setLoged(true);
  }).catch(function(error) {
    if (error) {
      callback(false);
      store.setLoged(false);
      console.log('sing Up error ', error);
    }
  })
}

export default {Login, SingUp};