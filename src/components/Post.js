import React from 'react';
import './css/Post.css';
import firebase from '../config/firebase';
import {Avatar} from '@material-ui/core';
import { ThumbDownOutlined, ThumbUpOutlined } from '@material-ui/icons';
import {connect} from 'react-redux';
import * as actions from '../actions';

const Post = (props) => {
    const [postOwner, setPostOwner] = React.useState([]);
    const [post, setPost] = React.useState('')

    React.useEffect(() => {
        const db = firebase.firestore();

        db.collection('posts').doc(props.post).onSnapshot(snapshot => {
            setPost(snapshot.data())
        })

    }, [])

    React.useEffect(() => {
        const db = firebase.firestore();
        db.collection('users').doc(post.uid).onSnapshot(snapshot => {
            setPostOwner(snapshot.data())
        })
    }, [post])

    const likePost = () => {
        props.likePost(post,props.post, props.user)
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
                    <ThumbUpOutlined className='post__likeNumber'/>
                    <ThumbDownOutlined className='post__dislikeNumber' />
                </div>
                <div className='post__likeDislike'>
                    <ThumbUpOutlined onClick={likePost} className='post__like' />
                    <ThumbDownOutlined className='post__dislike' />
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