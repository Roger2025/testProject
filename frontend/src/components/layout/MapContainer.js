import React from "react";
import { Map, GoogleApiWrapper, Marker } from "google-maps-react";

const mapStyles = {
  width: "100%",
  height: "200px",
  marginTop: "20px",
  position: "relative",
  zIndex: 1,
  borderRadius: "8px",
  overflow: "hidden",
};

const MapContainer = (props) => (
  <Map
    google={props.google}
    zoom={16}
    style={mapStyles}
    initialCenter={{ lat: 25.0856, lng: 121.5252 }}
  >
    <Marker position={{ lat: 25.0856, lng: 121.5252 }} />
  </Map>
);

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY, // 需 Google API 金鑰！！！
})(MapContainer);