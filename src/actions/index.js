import {provider} from '../config/firebase';

export const loginUserWithGoogle = () => (dispatch, getState, {getFirebase}) => {
    const firebase = getFirebase();
    const firestore = firebase.firestore();

    firebase.auth().signInWithPopup(provider).then(result => {
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
    if(file && text) {
        const storageRef = firebase.storage().ref('files');
        const randomName = () => {
            return Math.floor(Math.random() * (22222222222222 - 0 + 1)) + 0
        }
        const fileName = randomName()+file.name;
        const fileRef = storageRef.child(fileName);

        const getProgress = fileRef.put(file);
        getProgress.then((fl) => {
            const image = storageRef.child(fileName).getDownloadURL().then(url => {
                firestore.collection('posts').add({
                    text: text,
                    image: url,
                    uid: user.uid,
                    likes: 0,
                    dislikes: 0,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                })
            })
        })

        getProgress.on(
            firebase.storage.TaskEvent.STATE_CHANGED,
            function(snapshot) {
                let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                dispatch({
                    type: 'PROGRESS_PERCENTAGE',
                    payload: progress
                })

                switch (snapshot.state) {
                    case firebase.storage.TaskState.PAUSED: // or 'paused'
                        break;
                    case firebase.storage.TaskState.RUNNING: // or 'running'
                        break;
                }
            }
        )
    }else if(!file && text) {
        firestore.collection('posts').add({
            text:text,
            uid: user.uid,
            likes: 0,
            dislikes: 0,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })
    }else if(file && !text){
        const storageRef = firebase.storage().ref('files');
        const randomName = () => {
            return Math.floor(Math.random() * (22222222222222 - 0 + 1)) + 0
        }
        const fileName = randomName()+file.name;
        const fileRef = storageRef.child(fileName);
        const getProgress = fileRef.put(file);
        getProgress.then((fl) => {
            const image = storageRef.child(fileName).getDownloadURL().then(url => {
                firestore.collection('posts').add({
                    image: url,
                    uid: user.uid,
                    likes: 0,
                    dislikes: 0,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                })
            })
        })

        getProgress.on(
            firebase.storage.TaskEvent.STATE_CHANGED,
            function(snapshot) {
                let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                dispatch({
                    type: 'PROGRESS_PERCENTAGE',
                    payload: progress
                })

                switch (snapshot.state) {
                    case firebase.storage.TaskState.PAUSED: // or 'paused'
                        break;
                    case firebase.storage.TaskState.RUNNING: // or 'running'
                        break;
                }
            }
        )

    }
}

export const likePost = (post,id, user) => (dispatch, getState, {getFirebase}) => {
    const firebase = getFirebase();
    const firestore = firebase.firestore();
    firestore.collection('users').doc(user.uid).collection('disliked').doc(id).get().then(doc => {
        if(doc.exists) {
            firestore.collection('users').doc(user.uid).collection('disliked').doc(id).delete().then(() => {
                firestore.collection('posts').doc(id).set({
                    ...post,
                    dislikes: post.dislikes - 1,
                    likes: post.likes + 1
                })
            }).then(() => {
                firestore.collection('users').doc(user.uid).collection('liked').doc(id).set({
                    postId: id
                })
            })
        }else {
            firestore.collection('users').doc(user.uid).collection('liked').doc(id).get().then(doc => {
                if(doc.exists) {
                    firestore.collection('users').doc(user.uid).collection('liked').doc(id).delete().then(() => {
                        firestore.collection('posts').doc(id).set({
                            ...post,
                            likes: post.likes -1
                        })
                    })
                }else {
                    firestore.collection('users').doc(user.uid).collection('liked').doc(id).set({
                        postId: id
                    }).then(() => {
                        firestore.collection('posts').doc(id).set({
                            ...post,
                            likes: post.likes + 1
                        })
                    })
                }
            })
        }
    })

}

export const dislikePost = (post, id, user) => (dispatch, getState, {getFirebase}) => {
    const firebase = getFirebase();
    const firestore = firebase.firestore();

    firestore.collection('users').doc(user.uid).collection('liked').doc(id).get().then(doc => {
        if(doc.exists) {
            firestore.collection('users').doc(user.uid).collection('liked').doc(id).delete().then(() => {
                firestore.collection('posts').doc(id).set({
                    ...post,
                    likes: post.likes - 1,
                    dislikes: post.dislikes + 1
                })
            }).then(() => {
                firestore.collection('users').doc(user.uid).collection('disliked').doc(id).set({
                    postId: id
                })
            })
        }else {
            firestore.collection('users').doc(user.uid).collection('disliked').doc(id).get().then(doc => {
                if(doc.exists) {
                    firestore.collection('users').doc(user.uid).collection('disliked').doc(id).delete().then(() => {
                        firestore.collection('posts').doc(id).set({
                            ...post,
                            dislikes: post.dislikes -1
                        })
                    })
                }else {
                    firestore.collection('users').doc(user.uid).collection('disliked').doc(id).set({
                        postId: id
                    }).then(() => {
                        firestore.collection('posts').doc(id).set({
                            ...post,
                            dislikes: post.dislikes + 1
                        })
                    })
                }
            })
        }
    })
}

export const createComment = (user, comment, id) => (dispatch, getState, {getFirebase}) => {
    const firebase = getFirebase();
    const firestore = firebase.firestore();

    firestore.collection('posts').doc(id).collection('comments').add({
        uid: user.uid,
        comment: comment,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
}