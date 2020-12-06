import {combineReducers} from 'redux';
import {firebaseReducer} from 'react-redux-firebase';
import {firestoreReducer} from 'redux-firestore';
import progressReducer from "./progressReducer";

export default combineReducers({
    firebase: firebaseReducer,
    firestore: firestoreReducer,
    progress: progressReducer
})