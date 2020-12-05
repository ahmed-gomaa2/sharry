import React from 'react';
import './css/PostCreator.css';
import {connect} from 'react-redux';
import * as actions from '../actions';
import {Avatar} from '@material-ui/core';
import firebase from '../config/firebase';

const PostCreator = (props) => {
    const [typing, setTyping] = React.useState(false);
    const [text, setText] = React.useState('');
    const [file, setFile] = React.useState(null);

    const handleFileChange = (e) => {
        if(e.target.files[0]){
            setFile(e.target.files[0])
        }
    }

    const handlePostSubmit = (e) => {
        e.preventDefault();
        props.submitPost(props.user, text, file)
    }

    return (
        <div className='postCreator'>
            {!typing ? (
                <div className='postCreator__formToggler'>
                    <Avatar className='postCreator__avatar' src={props.user.photoURL}/>
                    <input onFocus={(e) => setTyping(true)} placeholder='What are you thinking?'/>
                </div>
            ) : (
                <form onSubmit={handlePostSubmit} className='postCreator__form'>
                    <div className='postCreator__formItem'>
                        <Avatar className='postCreator__avatar' src={props.user.photoURL}/>
                        <p className='postCreator__userName'>{props.user.displayName}</p>
                    </div>
                    <div className='postCreator__formItem'>
                        <input className='postCreator__text' value={text} onChange={e => setText(e.target.value)} type='text' placeholder='What are you thinking?'/>
                    </div>
                    <div className='postCreator__formItem'>
                        <label htmlFor="file-upload" className="custom-file-upload">
                            <i className="fas fa-paperclip"></i> Upload Image
                        </label>
                        <input accept='image/*' onChange={handleFileChange} id="file-upload" type="file"/>
                    </div>

                    <button type='submit'>SHARE</button>
                </form>
            )}
    
        </div>
    )
}

const mapStateToProps = state => {
    console.log(state)
    return {
        user: state.firebase.auth
    }
}

export default connect(mapStateToProps, actions) (PostCreator);