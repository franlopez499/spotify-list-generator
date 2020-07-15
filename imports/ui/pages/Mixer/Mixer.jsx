import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form } from 'react-bootstrap';

class Mixer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      playlists: [],
      checkboxMap: new Map(),
    };
  }
  componentDidMount() {
    if (!this.props.loggedIn) {
      //
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

  getCheckboxPlaylists() {
    const items = [];
    this.state.playlists.forEach(p => {
      items.push(
        <Form.Check key={p.id} type="checkbox" label={p.name} name={p.name} onChange={this.handleCheckboxClick.bind(this)}/>
      );
    });
    return items;
  }

  getPlaylist() {
    if (Meteor.user()) {
      console.log(Meteor.user());
      // Al llamar a una Api (Meteor.call), para utilizar this en su callback es necesario cachear la referencia a "this" fuera de la llamada a la API.
      let self = this;
      Meteor.call('getPlaylists', function(error, result) {
        self.setState({ playlists: result });
      });
    }
  }
  handleCheckboxClick(e){
    const target = e.target;
    const checked = target.checked;
    const name = target.name;

    const { checkboxMap } = this.state;

    const map = new Map(checkboxMap.set(name,checked));
    this.setState({
      checkboxMap: map,
    });   
    console.log(this.state);
  }

  handleButtonClick(e){
    e.preventDefault();
    const { checkboxMap, playlists } = this.state;
    const playlistsTrue = Array.from(checkboxMap).filter( obj => obj[1]); 
    
    const aux = playlists.filter(p => playlistsTrue.find(pT => p.name === pT[0])).map( p => p.id);
    const nuevaPlaylist = [];
    for (let i = 0; i< aux.length; ++i) {
      Meteor.call('getPlaylistTracks', aux[i], (error, result) => { nuevaPlaylist.push(...result.map( r => r.track));});
    }
    console.log(nuevaPlaylist);

    
  }

  render() {
    const { loggedIn } = this.props;
    if (!loggedIn || !Meteor.user() || this.state.playlists.length === 0) {
      return null;
    }

    const playListLength = this.state.playlists.length;
    const checkboxes = this.getCheckboxPlaylists();

    return (
      <div className="home-page">
        <Form>

          <Form.Group controlId="formBasicCheckbox">
            {checkboxes}
          </Form.Group>
          <Button variant="primary" type="submit" onClick={this.handleButtonClick.bind(this)}>
            Submit
          </Button>
        </Form>
      </div>
    );
  }
}

Mixer.propTypes = {
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
})(Mixer);
