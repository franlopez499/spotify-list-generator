import React, { Component } from 'react'
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'
import { withTracker } from 'meteor/react-meteor-data';

import { Meteor } from 'meteor/meteor';
export default class SimpleExample extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      isMarked: false,
      selectedPosition: [0,0],
      latitude: 0.0,
      longitude: 0.0,
    };
  }
  /*state = {
    lat: 38.2389,
    lng: -1.4188,
    zoom: 16,
  }*/
  options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };
  
  error(err) {
    console.warn('ERROR(' + err.code + '): ' + err.message);
    alert('Please enable your GPS position feature.');
  };

  componentDidMount(){
    if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log(position.coords.latitude + " " + position.coords.longitude + " Error: "+ position.coords.accuracy+"+- meters" );

      this.setState({latitude: position.coords.latitude, longitude: position.coords.longitude});
      }, this.error, this.options);
    }else{
      // Set default coordinates
      this.setState({latitude: 38.2389, longitude: -1.4188});
      alert("Geolocation API is not supported in your browser.");
      
    }
  }
  
  getReactMarkers() {
    const items = [];
    this.props.points.forEach(p => {
      const pos = [p.lat, p.lng];
      const desc = p.descripcion;
      const imageUrl = p.imageUrl;
      //console.log("lat:",p.lat);
      //console.log("lng:",p.lng);
      //items.push(<Marker key={pos} position={pos} />);
      items.push(<Marker key={pos} position={pos}>
                {desc != '' && desc != undefined 
                  ? <Popup maxWidth="auto">
                      
                      {desc}
                      <img src={imageUrl} />
                    </Popup>
                : ''
                 }
                </Marker>
                );


    });
    return items;
  }

  getColoredIcon(){
    /* Src : https://github.com/pointhi/leaflet-color-markers */

    return new L.Icon({
      iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
  }

  handleClick(e){
    
    console.log("Latitud seleccionada: ",e.latlng,
    "Evento :",e);
    this.setState({
        isMarked: true,
        selectedPosition: [e.latlng.lat, e.latlng.lng],
    });
    if(this.props.callbackFromParent != undefined)
      this.props.callbackFromParent([e.latlng.lat, e.latlng.lng]);
    

    //Meteor.call('points.insert', e.latlng.lat, e.latlng.lng);
  }
  render() {
    //const position = [this.state.lat, this.state.lng];
    
    const position = [this.state.latitude, this.state.longitude];
    const markers = this.getReactMarkers();
    const zoom = 16;
    let coloredIcon = this.getColoredIcon();
  
    console.log(this.props.points);
    return (
      <Map className={this.props.mapRef} id={this.props.mapRef} ref={this.props.mapRef} center={position} zoom={zoom} onClick={this.handleClick.bind(this)}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers}
        {
        this.state.isMarked ? 
        <Marker icon={coloredIcon} position={this.state.selectedPosition}>
          {this.props.descripcion != '' && this.props.descripcion != undefined ? <Popup>{this.props.descripcion}</Popup>
          : ''
          }
        </Marker> 
        : ''}
       
      </Map>
    )
  }
}
