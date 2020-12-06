import React from 'react';
import './css/PostCreator.css';
import {connect} from 'react-redux';
import * as actions from '../actions';
import {Avatar} from '@material-ui/core';

const PostCreator = (props) => {
    const [typing, setTyping] = React.useState(false);
    const [text, setText] = React.useState('');
    const [file, setFile] = React.useState(null);
    const [errors, setErrors] = React.useState([]);
    const [progressPercentage, setProgressPercentage] = React.useState(0)

    const handleFileChange = (e) => {
        if(e.target.files[0]){
            setFile(e.target.files[0])
        }
    }

    const formValidation = () => {
        let valid = true;
        let errors = [];

        if(!text && !file) {
            valid = false;
            errors['emptyError'] = 'Add Text or Image!';
        }

        setErrors(errors);
        return valid
    }

    const handlePostSubmit = (e) => {
        e.preventDefault();
        if(formValidation()) {
            props.submitPost(props.user, text, file)
        }
    }

    React.useEffect(() => {
        setProgressPercentage(props.progress)
    }, [props.progress])

    return (
        <div className='postCreator'>
            {!typing ? (
                <div className='postCreator__formToggler'>
                    <Avatar className='postCreator__avatar' src={props.user.photoURL}/>
                    <input onFocus={(e) => setTyping(true)} placeholder='What are you thinking?'/>
                </div>
            ) : (
                <form onSubmit={handlePostSubmit} className='postCreator__form'>
                    {errors.emptyError && (
                        <p style={{color: 'red'}}>{errors.emptyError}</p>
                    )}
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
                    <div className="postCreator__buttons">
                        <button type='submit'>SHARE</button>
                        <button style={{background: 'red'}} onClick={() => setTyping(false)}>CANCEL</button>
                    </div>
                    <div className="postCreator__progressContainer">
                        <div style={{width: `${progressPercentage}%`}} className="postCreator__progressBar"></div>
                    </div>
                </form>
            )}
        </div>
    )
}

const mapStateToProps = state => {
    return {
        user: state.firebase.auth,
        progress: state.progress
    }
}

export default connect(mapStateToProps, actions) (PostCreator);