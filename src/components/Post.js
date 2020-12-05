import React from 'react';
import './css/Post.css';
import firebase from '../config/firebase';
import {Avatar} from '@material-ui/core';
import { ThumbDownOutlined, ThumbUpOutlined } from '@material-ui/icons';
import {connect} from 'react-redux';
import * as actions from '../actions';

const Post = (props) => {
    const [postOwner, setPostOwner] = React.useState([]);
    const [post, setPost] = React.useState('');
    const [liked, setLiked] = React.useState(false);
    const [disliked, setDisliked] = React.useState(false);
    const db = firebase.firestore();
    const currentUser = db.collection('users').doc(props.user.uid);

    React.useEffect(() => {

        db.collection('posts').doc(props.post).onSnapshot(snapshot => {
            setPost(snapshot.data())
        })

    }, [])

    React.useEffect(() => {
        db.collection('users').doc(post.uid).onSnapshot(snapshot => {
            setPostOwner(snapshot.data())
        })
    }, [post])

    React.useEffect(() => {
        db.collection('users').doc(props.user.uid).collection('liked').doc(props.post).get().then(doc => {
            if(doc.exists) {
                setLiked(true)
            }else {
                setLiked(false)
            }
        })

        db.collection('users').doc(props.user.uid).collection('disliked').doc(props.post).get().then(doc => {
            if(doc.exists) {
                setDisliked(true)
            }else {
                setDisliked(false)
            }
        })
    }, [currentUser])

    const likePost = () => {
        props.likePost(post,props.post, props.user)
    }

    const dislikePost = () => {
        props.dislikePost(post, props.post, props.user)
    }

    return (
        <div className='post'>
            <div className='post__top'>
                <Avatar src={postOwner?.image} />
                <p>{postOwner?.name}</p>
            </div>
            <div className='post__middle'>
                {post.text && <p>{post.text}</p>}
                {post.image && <img src={post.image} alt='the post'/>}
            </div>
            <div className='post__bottom'>
                <div className='post__likesDislikes'>
                    {post?.likes}
                    <ThumbUpOutlined className='post__likeNumber'/>
                    {post?.dislikes}
                    <ThumbDownOutlined className='post__dislikeNumber' />
                </div>
                <div className='post__likeDislike'>
                    <ThumbUpOutlined onClick={likePost} className={`post__like ${liked && 'liked'}`} />
                    <ThumbDownOutlined onClick={dislikePost} className={`post__dislike ${disliked && 'disliked'}`} />
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