import React from 'react';
import './css/Comment.css';
import {Avatar} from "@material-ui/core";
import firebase from '../config/firebase';

const Comment = (props) => {
    const [commentOwner, setCommentOwner] = React.useState('');
    const db = firebase.firestore();

    React.useEffect(() => {
        db.collection('users').doc(props.comment.uid).onSnapshot(snapshot => {
            setCommentOwner(snapshot.data())
        })
    }, [])

    return (
        <div className={'comment'}>
            <Avatar className={'comment__avatar'} src={commentOwner.image} />
            <p className={'comment__text'}>{props.comment.comment}<span className={'comment__timestamp'}>{new Date(props.comment?.timestamp?.toDate()).toUTCString()}</span></p>
        </div>
    );
};

export default Comment;