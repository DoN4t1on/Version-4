import React from 'react';

import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';

function Address(props) {
  // const [address, setaddress] = useState(localStorageData('address'));

  // const { label, onChange, setaddress, address } = props;

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {},
  });
  const handleInput = (e) => {
    setValue(e.target.value);
    props.setlocation('');
  };

  const handleSelect =
    ({ description }) =>
    () => {
      // When user selects a place, we can replace the keyword without request data from API
      // by setting the second parameter as "false"
      setValue(description, false);

      props.setlocation(description);

      clearSuggestions();

      //      props.setaddress(description);

      props.changeaddress(description);

      getGeocode({ address: description })
        .then((results) => getLatLng(results[0]))
        .then(({ lat, lng }) => {
          let newcor = [lat, lng];
          props.setlong(lng);
          props.setlat(lat);
        })
        .catch((error) => {
        });
    };

  const renderSuggestions = () =>
    data.map((suggestion) => {
      const {
        id,
        structured_formatting: { main_text, secondary_text },
      } = suggestion;

      return (
        <li
          // className='cursor-pointer hover:text-red-500'
          style={{ display: 'block' }}
          key={id}
          onClick={handleSelect(suggestion)}
        >
          <strong>{main_text}</strong> <small>{secondary_text}</small>
        </li>
      );
    });

  return (
    <>
      <input
        placeholder='Standort'
        value={value == '' ? props.location : value}
        onChange={handleInput}
        disabled={!ready}
      />

      <div className='mt absolute z-40'>
        {status === 'OK' && (
          <ul className='bg-white p-2 w-full    shadow-lg'>
            {renderSuggestions()}
          </ul>
        )}
      </div>
    </>
  );
}

export default Address;
