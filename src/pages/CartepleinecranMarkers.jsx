
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const markers = [
  { position: [48.8566, 2.3522], popup: "Paris" },
  { position: [51.5074, -0.1278], popup: "Londres" },
  { position: [40.7128, -74.0060], popup: "New York" }
];

const MyMap = () => {
  return (
    <MapContainer center={[48.8566, 2.3522]} zoom={5} style={{ height: "100vh", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {markers.map((marker, index) => (
        <Marker key={index} position={marker.position}>
          <Popup>{marker.popup}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MyMap;
