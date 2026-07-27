// import history from '../../history';

import { localToken } from '../../config/config';
export function localStorageData(value) {
  let fialValue = null;

  let localData;
  try {
    localData = JSON.parse(localStorage.getItem(localToken));
  } catch {
    localData = null;
  }

  if (localData) {
    Object.keys(localData).forEach(function (key) {
      if (key === value) {
        fialValue = localData[key];
      }
    });
  }

  return fialValue;
}

export function getLocalUserdata() {
  try {
    return JSON.parse(localStorage.getItem(localToken));
  } catch {
    return null;
  }
}

export function storeLocalData(value) {
  localStorage.setItem(localToken, JSON.stringify(value));
}

export function updatelocalData(value) {
  let localData;
  try {
    localData = JSON.parse(localStorage.getItem(localToken));
  } catch {
    localData = {};
  }

  localData.fname = value.fname;

  localData.lname = value.lname;

  localData.address = value.address;

  localData.contactNo = value.contactNo;

  const transformedLocalData = {
    ...localData,
    ...value,
  };

  localStorage.setItem(localToken, JSON.stringify(transformedLocalData));

  // if (localData && localData.hasOwnProperty('token')) {
  //   Object.keys(localData).forEach(function (key) {
  //     if (key == value) {
  //       fialValue = localData[key];
  //     }
  //   });
  // }

  return localData;
}

export function updateLocalstoragepic(value) {
  let localData;
  try {
    localData = JSON.parse(localStorage.getItem(localToken)) || {};
  } catch {
    localData = {};
  }

  localData.pic = value;

  localStorage.setItem(localToken, JSON.stringify(localData));
}

export function updateLocalstorageToken(value) {
  let localData;
  try {
    localData = JSON.parse(localStorage.getItem(localToken)) || {};
  } catch {
    localData = {};
  }

  localData.token = value;

  localStorage.setItem(localToken, JSON.stringify(localData));
}

export function Logout(value) {
  localStorage.removeItem(localToken);

  // history.push(value);

  return true;
}
