import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import PropTypes from 'prop-types';

// collection
//import { Points } from '../../../api/points/points';
// import '../../../api/spotify/spotify.js';
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
  

  constructor(props) {
    super(props);
     
    this.state = {
      
      playlists: [],
      password: '',
      errMsg: null,
    };
    
    
  }
  componentDidMount() {
    if (!this.props.loggedIn) {
      return this.props.history.push('/login');
    }
    this.getPlaylist();
  }

  shouldComponentUpdate(nextProps) {
    if (!nextProps.loggedIn) {
      nextProps.history.push('/login');
      return false;
    }
    return true;
  }
  getPlaylist(){
    const items = [];
    if(Meteor.user()){
      
      console.log(Meteor.user());
      // Al llamar a una Api (Meteor.call), para utilizar this en su callback es necesario cachear la referencia a "this" fuera de la llamada a la API.
      let self = this;
      Meteor.call('getPlaylists', function (error, result) {
         self.setState({playlists: result});
        
      });

      // Falta crear componente playlist y retornar lista de componentes playlists.

      //this.state.playlists.forEach()
    }


  }
  render() {
    const {
      loggedIn,
      // remote example (if using ddp)
      // usersReady,
      // users,
     
    } = this.props;
    if (!loggedIn || !Meteor.user() || this.state.playlists.length === 0) {
      return null;
    }
    
    let imageUrl = Meteor.user().profile.images[0].url;
   
  
    return (
      <div className="home-page">
        <h1>Home</h1>
        <Button target="userId" type="primary" title="Click para insertar nuevo aviso" />
        
        <img border="0" alt="ProfilePic" src={imageUrl} width="100" height="100"></img>
        
        
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
  Meteor.subscribe('users');

  return {
    // Encontramos en MongoDB todos ({}) y se puede filtrar con predicate o hacer sort
    //points: Points.find({}, { sort: { createdAt: -1 } }).fetch(),
    // selecciona las tareas que no tienen a true checked y las cuenta

    currentUser: Meteor.user(),

  };

})(Profile);
