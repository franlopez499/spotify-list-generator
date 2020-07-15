import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import PropTypes from 'prop-types';
import { CardDeck, Button, Form } from 'react-bootstrap';

import './Profile.scss';
import Playlist from '../../components/Playlist';

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
    if (!this.props.loggedIn) {//
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

  getReactPlaylists(){
    const items = [];
    this.state.playlists.forEach(p => {
      items.push(<Playlist key={p.id} image={p.images[0].url} name={p.name} owner={p.owner.display_name} id={p.id} tracksHref={p.tracks.href}/>);   
     });
    return items;
  }
  getPlaylist(){
    
    if(Meteor.user()){
      
      console.log(Meteor.user());
      // Al llamar a una Api (Meteor.call), para utilizar this en su callback es necesario cachear la referencia a "this" fuera de la llamada a la API.
      let self = this;
      Meteor.call('getPlaylists', function (error, result) {
         self.setState({playlists: result});
      });

   
    }

  }
  render() {
    const {
      loggedIn,
     
    } = this.props;
    if (!loggedIn || !Meteor.user() || this.state.playlists.length === 0 ) {
      return null;
    }
    
    //let imageUrl = Meteor.user().profile.images[0].url;
    // <img id="profile-pic" alt="ProfilePic" src={imageUrl} width="200" height="200"></img>
    
    console.log(this.state.playlists);
    const reactPlaylists = this.getReactPlaylists();
    return (
      <div className="home-page">
        
        <div className="card-deck-container">
          <CardDeck>
            {reactPlaylists}
          </CardDeck>
        </div>
        
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
    // selecciona las tareas que no tienen a true checked y las cuenta
    
    //points: Points.find({}, { sort: { createdAt: -1 } }).fetch(),
    currentUser: Meteor.user(),

  };

})(Profile);
