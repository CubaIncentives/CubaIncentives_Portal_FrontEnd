import 'leaflet/dist/leaflet.css';

import { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import PropTypes from 'prop-types';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet/dist/images/marker-shadow.png',
});

const Map = (props) => {
  const { latitude, longitude, pinTitle } = props;
  const [isShowMap, setShowMap] = useState(false);

  useEffect(() => {
    setTimeout(function () {
      setShowMap(true);
    }, 10);
  }, [isShowMap]);

  return isShowMap && latitude && longitude ? (
    <div className='relative h-[500px] xl:h-[600px]'>
      <MapContainer
        center={[latitude, longitude]}
        zoom={100}
        scrollWheelZoom={true}
        className='h-full'
      >
        <TileLayer
          attribution=''
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        <Marker position={[latitude, longitude]}>
          <Popup>{pinTitle}</Popup>
        </Marker>
      </MapContainer>
    </div>
  ) : null;
};

Map.propTypes = {
  latitude: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.oneOf([null]),
    PropTypes.string,
  ]),
  longitude: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.oneOf([null]),
    PropTypes.string,
  ]),
  pinTitle: PropTypes.string,
};

export default Map;
