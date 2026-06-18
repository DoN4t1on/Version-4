const apiOrigin = process.env.API_ORIGIN || 'http://localhost:5009';

module.exports = {
  endPoint: `${apiOrigin}/api`,

  baseUrl: process.env.PUBLIC_URL || 'http://localhost:1234',
  mapAPiKey: process.env.GOOGLE_MAPS_API_KEY || '',
  googleClientId: process.env.GOOGLE_CLIENT_ID || '',
  facebookAppId: process.env.FACEBOOK_APP_ID || '',

  ImageEndPoint: `${apiOrigin}/readfiles/`,

  localToken: 'LocalDonation',
};
