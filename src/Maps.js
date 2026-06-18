import React, { useCallback, useMemo, useState } from 'react';
import { GoogleMap, LoadScript, MarkerF } from '@react-google-maps/api';
import { useSelector } from 'react-redux';
import Geocode from 'react-geocode';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';
import { mapAPiKey } from './config/config';
import markerIcon from './img/marker1.png';

const libraries = ['places'];

function MapContent({ setlat, setlong, setlocationName }) {
  const geo = useSelector((state) => state.Geo);
  const initialCenter = useMemo(() => ({
    lat: geo.lat === 'false' ? 40.856795 : Number(geo.lat),
    lng: geo.long === 'false' ? -73.954298 : Number(geo.long),
  }), [geo.lat, geo.long]);
  const [center, setCenter] = useState(initialCenter);
  const [map, setMap] = useState(null);
  const {
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete();

  const updateLocation = useCallback(async (nextCenter) => {
    setCenter(nextCenter);
    setlat(nextCenter.lat);
    setlong(nextCenter.lng);

    try {
      const response = await Geocode.fromLatLng(nextCenter.lat, nextCenter.lng);
      setlocationName(response.results[0]?.formatted_address || '');
    } catch (error) {
      console.error('Unable to resolve map location', error);
    }
  }, [setlat, setlocationName, setlong]);

  const handleIdle = useCallback(() => {
    if (!map) return;
    updateLocation(map.getCenter().toJSON());
  }, [map, updateLocation]);

  const handleSelect = (description) => async () => {
    setValue(description, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address: description });
      await updateLocation(await getLatLng(results[0]));
    } catch (error) {
      console.error('Unable to select map location', error);
    }
  };

  return (
    <>
      <div className='mt absolute z-40'>
        {status === 'OK' && (
          <ul className='bg-white p-2 w-full shadow-lg'>
            {data.map(({ place_id: placeId, description, structured_formatting: formatting }) => (
              <li
                style={{ display: 'block' }}
                key={placeId}
                onClick={handleSelect(description)}
              >
                <strong>{formatting.main_text}</strong>{' '}
                <small>{formatting.secondary_text}</small>
              </li>
            ))}
          </ul>
        )}
      </div>
      <GoogleMap
        mapContainerStyle={{ height: '100%', width: '100%' }}
        zoom={13}
        center={center}
        options={{
          fullscreenControl: false,
          mapTypeControl: false,
          zoomControl: false,
          streetViewControl: false,
        }}
        onLoad={setMap}
        onUnmount={() => setMap(null)}
        onIdle={handleIdle}
      >
        <MarkerF
          position={center}
          icon={{
            url: markerIcon,
            scaledSize: new window.google.maps.Size(30, 45),
          }}
        />
      </GoogleMap>
    </>
  );
}

export default function Maps(props) {
  if (!mapAPiKey) {
    return <p className='text-muted'>Google Maps ist nicht konfiguriert.</p>;
  }

  Geocode.setApiKey(mapAPiKey);
  return (
    <LoadScript googleMapsApiKey={mapAPiKey} libraries={libraries}>
      <MapContent {...props} />
    </LoadScript>
  );
}
