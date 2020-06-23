import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import PropTypes from 'prop-types';

// collection
import { Points } from '../../../api/points/points';
// remote example (if using ddp)
/*
import Remote from '../../../api/remote/ddp';
import Users from '../../../api/remote/users';
*/

// components
//import Modal, { Button } from '../../components/Modal/Modal';
import ModalInput, { Button } from '../../components/ModalInput/ModalInput'

import './Profile.scss';

class Profile extends React.Component {
  componentDidMount() {
    if (!this.props.loggedIn) {
      return this.props.history.push('/login');
    }
  }

  shouldComponentUpdate(nextProps) {
    if (!nextProps.loggedIn) {
      nextProps.history.push('/login');
      return false;
    }
    return true;
  }

  render() {
    const {
      loggedIn,
      // remote example (if using ddp)
      // usersReady,
      // users,
     
    } = this.props;
    let profileReady = false;
    let imageUrl = "";
    if(Meteor.user()){
      profileReady = true;
      imageUrl = Meteor.user().profile.images[0].url;
    }
    
    // eslint-disable-line
    // remote example (if using ddp)
    /*
    console.log('usersReady', usersReady);
    console.log('users', users);
    */
   
   
    if (!loggedIn) {
      return null;
    }
    return (
      <div className="home-page">
        <h1>Home</h1>
        <Button target="userId" type="primary" title="Click para insertar nuevo aviso" />
        
        <img border="0" alt="W3Schools" src={imageUrl} width="100" height="100"></img>
        
        
      </div>
    );
  }
}

Profile.defaultProps = {
  // users: null, remote example (if using ddp)
};

Profile.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,

  
};

export default withTracker(() => {
  //Meteor.subscribe('points');

  return {
    // Encontramos en MongoDB todos ({}) y se puede filtrar con predicate o hacer sort
    //points: Points.find({}, { sort: { createdAt: -1 } }).fetch(),
    // selecciona las tareas que no tienen a true checked y las cuenta

    currentUser: Meteor.user(),

  };

})(Profile);
