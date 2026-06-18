import { localToken } from '../../config/config';

export default function authHeader() {
  const localData =
    JSON.parse(localStorage.getItem(localToken)) ||
    JSON.parse(localStorage.getItem('localdealtoken'));

  if (localData?.token) {
    // for Node.js Express back-end
    return {
      Authorization: `Bearer ${localData.token}`,
      'x-access-token': localData.token,
    };
  } else {
    return {};
  }
}
