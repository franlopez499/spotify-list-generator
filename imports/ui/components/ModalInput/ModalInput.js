/**
 * A basic bootstrap 4 modal
 * jw
 */
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import './ModalInput.scss';
import SimpleExample from '../../pages/Landing/SimpleExample.js';
import './delay.js'
import { delay_to_render } from './delay.js';
import FileUpload from '../FileUpload/FileUpload';
import { Images } from '../../../api/images/images';

export const Button = ({ target, type, title }) => (
  <button
    type="button"
    className={`btn btn-${type}`}
    data-toggle="modal"
    data-target={`#${target}`}
  >
    {title}
  </button>
);

Button.propTypes = {
  target: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  type: PropTypes.oneOf([
    'primary',
    'secondary',
    'success',
    'danger',
    'warning',
    'info',
    'light',
    'dark',
  ]).isRequired,
};

class ModalInput extends React.Component {
  constructor(props) {
    super(props);
    this.mapRef = React.createRef();
    this.state = {
      descripcion: '',
      latitude: 0.0,
      longitude: 0.0,
      selectedPositionChild: null,
      fileId: null,
    }

  }
  
  componentDidMount() {
    console.log("Mounted");

    delay_to_render(this.props.target,this.mapRef.current.leafletElement);

  }
  
  options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };
  
  error(err) {
    console.warn('ERROR(' + err.code + '): ' + err.message);
    alert('Please enable your GPS position feature.');
  };

  setCurrentLocation(){

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const pos = [position.coords.latitude,position.coords.longitude];
        this.setState({ selectedPositionChild: pos});
        }, this.error, this.options);
      }else{
        // Set default coordinates
        this.setState({latitude: 38.2389, longitude: -1.4188});
        alert("Geolocation API is not supported in your browser.");
        
      }
  }

  myCallbackPoints = (dataFromChild) => {
    console.log(dataFromChild)
    this.setState({ selectedPositionChild: dataFromChild });
  }
  myCallbackFile = (dataFromChild) => {
    console.log(dataFromChild);
    this.setState({ fileId: dataFromChild });
  }
 
  handleDescriptionChange(){
    const text = ReactDOM.findDOMNode(this.refs.descInput).value != null ? ReactDOM.findDOMNode(this.refs.descInput).value : '';
    this.setState({
      descripcion: text,
    });
    
  }

  handleSubmit(e) {
    e.preventDefault();
    const text = ReactDOM.findDOMNode(this.refs.descInput).value;
    if(text == ''){
      alert('Debes seleccionar una descripción.');
      return;
    }
    
    this.setState({
      descripcion: text,
    });
    console.log("Descripción: ",text);
    if(this.state.selectedPositionChild == undefined || this.state.selectedPositionChild == null){
      this.setCurrentLocation();
    }
    console.log('ChildrenLat',this.state.selectedPositionChild);

    // Hacer la imagen consistente en caso de 
    if(this.state.fileId != null || this.state.fileId == undefined){
      Meteor.call('files.images.updateLocation', this.state.fileId, this.state.selectedPositionChild);
    }

    console.log('Location updated',this.state.selectedPositionChild);


    const imageUrl = Images.findOne(this.state.fileId).link();
    console.log(imageUrl);


    Meteor.call('points.insert', this.state.selectedPositionChild[0],this.state.selectedPositionChild[1]
                                , this.state.descripcion, imageUrl); // pasarle ruta de imagen
    console.log('Punto insertado');

    // Refrescamos los campos
    ReactDOM.findDOMNode(this.refs.descInput).value = '';
    this.setState({
      descripcion: '',
      selectedPositionChild: null,
      fileId: null,
    });
  }

  render() {
    
    return (

      <div
        className="modal fade modal-01"
        id={this.props.target}
        
        
        >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div id="form" className="form-group">
              <label htmlFor="descripcion">Descripción</label>
              
              <input
                id="2"
                type="text"
                className="form-control"
                name="descripcion"
                ref="descInput"
                onChange={this.handleDescriptionChange.bind(this)}
                required
              />

              <FileUpload callbackFromParent={this.myCallbackFile} fileLocator={[38.2389,-1.4188]}/>


            
            </div>
            <SimpleExample ref="mapComponent" mapRef={this.mapRef} callbackFromParent={this.myCallbackPoints} coords={this.state.latitude,this.state.longitude} descripcion={this.state.descripcion} points={this.props.points} /> 
              
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                data-dismiss="modal"
                onClick={this.handleSubmit.bind(this)}
              >
                Insertar
          </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

}

ModalInput.propTypes = {
  target: PropTypes.string.isRequired,
  descripcion: PropTypes.string,
  
};

export default ModalInput;



