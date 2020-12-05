import React from 'react';
import './css/Header.css';
import * as actions from '../actions';
import {connect} from 'react-redux';

const Header = (props) => {

    const handleLogout = () => {
        props.logoutUser()
    }

    return (
        <div className='header'>
            <div className='header__logo'>
                <h1>SHARRY</h1>
            </div>
            <div className='header__right'>
                <p onClick={handleLogout} className='header__logout'>Logout</p>
            </div>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        user: state.firebase.auth
    }
}

export default connect(mapStateToProps, actions) (Header);