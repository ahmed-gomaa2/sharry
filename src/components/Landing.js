import React from 'react';
import './css/Landing.css';
import ShareOutlinedIcon from '@material-ui/icons/ShareOutlined';
import * as actions from '../actions';
import {connect} from 'react-redux';

const Landing = (props) => {

    const handleLoginClick = () => {
        props.loginUserWithGoogle()
    }

    return (
        <div className='landing'>
            <div className='landing__logo'>
                <ShareOutlinedIcon className='landing__icon' />
                <h1>SHARRY</h1>
            </div>

            <div onClick={handleLoginClick} className='landing__login'>
                <i className={'fab fa-google landing__loginIcon'}></i>
                <a>Login With Google</a>
            </div>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        user: state.firebase.auth
    }
}

export default connect(mapStateToProps, actions) ( Landing);