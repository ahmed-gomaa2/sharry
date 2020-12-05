import firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/auth';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAseSHDx_vk9GMpmN0jXDXy94KKu1rkEkY",
    authDomain: "sharry-16d2b.firebaseapp.com",
    databaseURL: "https://sharry-16d2b.firebaseio.com",
    projectId: "sharry-16d2b",
    storageBucket: "sharry-16d2b.appspot.com",
    messagingSenderId: "855338789297",
    appId: "1:855338789297:web:21e4fb0c9839b14ae43590",
    measurementId: "G-ZTXGFTFRXD"
};

firebase.initializeApp(firebaseConfig);

firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();

export {provider};

export default firebase;