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
        db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot => {
            setPosts(snapshot.docs.map(doc => {
                return {
                    id: doc.id,
                    data: doc.data()
                }
            }))
        })
    },[])

    const randomKey = () => {
        return Math.floor(Math.random() * 33333333)
    }
    return (
        <div className='postsFeed'>
            <Header />
            <PostCreator />
            {posts.map(post => (
                <Post key={randomKey()} post={post} />
            ))}
        </div>
    )
}

export default PostsFeed;