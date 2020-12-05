import {provider} from '../config/firebase';

export const loginUserWithGoogle = () => (dispatch, getState, {getFirebase}) => {
    const firebase = getFirebase();
    const firestore = firebase.firestore();

    firebase.auth().signInWithPopup(provider).then(result => {
        console.log(result)
        if(result.additionalUserInfo.isNewUser) {
            firestore.collection('users').doc(result.user.uid).set({
                name: result.user.displayName,
                email: result.user.email,
                uid: result.user.uid,
                image: result.user.photoURL
            })
        }
    }).catch(err => {
        dispatch({
            type: 'LOGIN_USER_ERR',
            payload: err
        })
    })
}

export const logoutUser = () => (dispatch, getState, {getFirebase}) => {
    const firebase = getFirebase();

    firebase.auth().signOut();
}


export const submitPost = (user, text, file) => (dispatch, getState, {getFirebase}) => {
    const firebase = getFirebase();
    const firestore = firebase.firestore();
    const storageRef = firebase.storage().ref('files');
    const randomName = () => {
        return Math.floor(Math.random() * (22222222222222 - 0 + 1)) + 0
    }
    const fileName = randomName()+file.name;
    console.log(fileName)
    const fileRef = storageRef.child(fileName);

    fileRef.put(file).then((fl) => {
        const image = storageRef.child(fileName).getDownloadURL().then(url => {
            firestore.collection('posts').add({
                text: text,
                image: url,
                uid: user.uid,
                likes: 0,
                dislikes: 0,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            })
            console.log(url)
        })
    })
}

export const likePost = (post,id, user) => (dispatch, getState, {getFirebase}) => {
    const firebase = getFirebase();
    const firestore = firebase.firestore();
    console.log(post)

    firestore.collection('posts').doc(id).set({
        ...post,
        likes: post.likes + 1
    })
}

