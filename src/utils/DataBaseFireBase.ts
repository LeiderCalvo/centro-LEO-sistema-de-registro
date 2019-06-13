import store from "../stores/store";

import * as firebase from "firebase/app";
import "firebase/database";
import firebaseCredentials from "./firebaseCredentials";

const firebaseConfig = firebaseCredentials;
firebase.initializeApp(firebaseConfig);

let database = firebase.database();


export default {};