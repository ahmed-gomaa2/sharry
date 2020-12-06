import React from 'react';
import './css/Post.css';
import firebase from '../config/firebase';
import {Avatar} from '@material-ui/core';
import { ThumbDownOutlined, ThumbUpOutlined } from '@material-ui/icons';
import {connect} from 'react-redux';
import * as actions from '../actions';
import Comment from "./Comment";

const Post = (props) => {
    const [postOwner, setPostOwner] = React.useState([]);
    const [liked, setLiked] = React.useState(false);
    const [disliked, setDisliked] = React.useState(false);
    const [comment, setComment] = React.useState('');
    const [comments, setComments] = React.useState([]);
    const db = firebase.firestore();
    const currentUser = db.collection('users').doc(props.user.uid);

    React.useEffect(() => {
        db.collection('users').doc(props.post.data.uid).onSnapshot(snapshot => {
            setPostOwner(snapshot.data())
        })
    }, [])

    React.useEffect(() => {
        db.collection('posts').doc(props.post.id).collection('comments').orderBy('timestamp','desc').onSnapshot(snapshot => {
            setComments(snapshot.docs.map(doc => doc.data()))
        })
    }, [])

    React.useEffect(() => {
        db.collection('users').doc(props.user.uid).collection('liked').doc(props.post.id).get().then(doc => {
            if(doc.exists) {
                setLiked(true)
            }else {
                setLiked(false)
            }
        })

        db.collection('users').doc(props.user.uid).collection('disliked').doc(props.post.id).get().then(doc => {
            if(doc.exists) {
                setDisliked(true)
            }else {
                setDisliked(false)
            }
        })
    }, [currentUser])

    const likePost = () => {
        props.likePost(props.post.data,props.post.id, props.user)
    }

    const dislikePost = () => {
        props.dislikePost(props.post.data, props.post.id, props.user);

    }

    const handleCommentCreate = (e) => {
        e.preventDefault();
        props.createComment(props.user, comment, props.post.id);
        setComment('')
    }

    const randomKey = () => {
        return Math.floor(Math.random() * 33333)
    }

    return (
        <div className='post'>
            <div className='post__top'>
                <Avatar src={postOwner?.image} />
                <p>{postOwner?.name}</p>
            </div>
            <div className='post__middle'>
                {props.post.data.text && <p>{props.post.data.text}</p>}
                {props.post.data.image && <img src={props.post.data.image} alt='the post'/>}
            </div>
            <div className='post__bottom'>
                <div className='post__likesDislikes'>
                    {props.post?.data?.likes}
                    <ThumbUpOutlined className='post__likeNumber'/>
                    {props.post?.data?.dislikes}
                    <ThumbDownOutlined className='post__dislikeNumber' />
                </div>
                <div className='post__likeDislike'>
                    <ThumbUpOutlined onClick={likePost} className={`post__like ${liked && 'liked'}`} />
                    <ThumbDownOutlined onClick={dislikePost} className={`post__dislike ${disliked && 'disliked'}`} />
                </div>
                <div className={'post__comments'}>
                    <div className={'post__commentCreator'}>
                        <Avatar className={'post__currentUser'} src={props.user.photoURL} />
                        <form onSubmit={handleCommentCreate} className={'post__commentForm'}>
                            <input type={'text'} placeholder={'write comment'} value={comment} onChange={e => setComment(e.target.value)} />
                            <button type={'submit'}>Comment</button>
                        </form>
                    </div>
                    <div className={'post__commentsFeed'}>
                        {comments?.map(comment => (
                            <Comment key={randomKey()} comment={comment} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        user: state.firebase.auth
    }
}

export default connect(mapStateToProps, actions) (Post);