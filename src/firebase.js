import firebase from "firebase/app"
import "firebase/auth"
import "firebase/storage"

const app = firebase.initializeApp({
  apiKey: "AIzaSyByb7HSjAh8QZ2Sq0NrrbUnVADrD5Ik-90",
  authDomain: "brave-cistern-156010.firebaseapp.com",
  databaseURL: "https://brave-cistern-156010.firebaseio.com",
  projectId: "brave-cistern-156010",
  storageBucket: "brave-cistern-156010.appspot.com",
  messagingSenderId: "347108342597",
  appId: "1:347108342597:web:92d7d27d67512e649fdc2c"
})

export const auth = app.auth();
export const storage = app.storage();

export default app
