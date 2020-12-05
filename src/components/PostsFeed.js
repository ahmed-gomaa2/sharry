import React from 'react';
import Header from './Header';
import './css/PostsFeed.css';
import PostCreator from './PostCreator';
import firebase from '../config/firebase';
import Post from './Post';


const PostsFeed = (props) => {
    const [posts, setPosts] = React.useState([]);

    React.useEffect(() => {
        const db = firebase.firestore();
        db.collection('posts').orderBy('timestamp','asc').onSnapshot(snapshot => {
            setPosts(snapshot.docs.map(doc => doc.id))
        })
    },[])
    console.log(posts)
    return (
        <div className='postsFeed'>
            <Header />
            <PostCreator />
            {posts.map(post => (
                <Post post={post} />
            ))}
        </div>
    )
}

export default PostsFeed;