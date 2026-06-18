const requestJson = async (url) => {
  const response = await fetch(url, { signal: AbortSignal.timeout(10000) });
  if (!response.ok) {
    throw new Error(`Provider request failed with status ${response.status}`);
  }
  return response.json();
};

const verifyGoogleCredential = async (credential) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) throw new Error('Google login is not configured');

  const profile = await requestJson(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`
  );

  if (profile.aud !== clientId || profile.email_verified !== 'true') {
    throw new Error('Invalid Google credential');
  }

  return {
    id: profile.sub,
    email: profile.email.toLowerCase(),
    fname: profile.name || profile.email,
    pic: profile.picture,
  };
};

const verifyFacebookToken = async (accessToken) => {
  const appId = process.env.FACEBOOK_APP_ID;
  const appSecret = process.env.FACEBOOK_APP_SECRET;
  const version = process.env.FACEBOOK_API_VERSION || 'v24.0';
  if (!appId || !appSecret) throw new Error('Facebook login is not configured');

  const appAccessToken = `${appId}|${appSecret}`;
  const tokenInfo = await requestJson(
    `https://graph.facebook.com/${version}/debug_token?input_token=${encodeURIComponent(accessToken)}&access_token=${encodeURIComponent(appAccessToken)}`
  );

  if (!tokenInfo.data?.is_valid || tokenInfo.data.app_id !== appId) {
    throw new Error('Invalid Facebook access token');
  }

  const profile = await requestJson(
    `https://graph.facebook.com/${version}/me?fields=id,name,email,picture&access_token=${encodeURIComponent(accessToken)}`
  );
  if (!profile.email) throw new Error('Facebook did not provide an email address');

  return {
    id: profile.id,
    email: profile.email.toLowerCase(),
    fname: profile.name || profile.email,
    pic: profile.picture?.data?.url,
  };
};

module.exports = { verifyFacebookToken, verifyGoogleCredential };
