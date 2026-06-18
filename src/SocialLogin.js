import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCreateGoogleAccount, useCreateFacebookAccount } from './hooks';
import { LOGIN } from './reactStore/actions/Actions';
import { facebookAppId, googleClientId } from './config/config';

const loadScript = (id, source) => new Promise((resolve, reject) => {
  const existing = document.getElementById(id);
  if (existing) {
    if (existing.dataset.loaded === 'true') resolve();
    else existing.addEventListener('load', resolve, { once: true });
    return;
  }

  const script = document.createElement('script');
  script.id = id;
  script.src = source;
  script.async = true;
  script.defer = true;
  script.addEventListener('load', () => {
    script.dataset.loaded = 'true';
    resolve();
  }, { once: true });
  script.addEventListener('error', reject, { once: true });
  document.head.appendChild(script);
});

function SocialLogin() {
  const googleButton = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { mutateAsync: createGoogleAccount } = useCreateGoogleAccount();
  const { mutateAsync: createFacebookAccount } = useCreateFacebookAccount();

  const finishLogin = (response) => {
    if (response.status) {
      dispatch(LOGIN(response.data));
      navigate('/');
    }
  };

  useEffect(() => {
    if (!googleClientId || !googleButton.current) return undefined;

    let cancelled = false;
    loadScript('google-identity-services', 'https://accounts.google.com/gsi/client')
      .then(() => {
        if (cancelled) return;
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: async ({ credential }) => {
            finishLogin(await createGoogleAccount({ credential }));
          },
        });
        window.google.accounts.id.renderButton(googleButton.current, {
          theme: 'outline',
          size: 'large',
          text: 'continue_with',
          locale: 'de',
          width: 280,
        });
      })
      .catch(() => toast.error('Google-Anmeldung konnte nicht geladen werden'));

    return () => {
      cancelled = true;
    };
  }, [createGoogleAccount]);

  const loginWithFacebook = async () => {
    if (!facebookAppId) {
      toast.error('Facebook-Anmeldung ist nicht konfiguriert');
      return;
    }

    try {
      await loadScript('facebook-sdk', 'https://connect.facebook.net/de_DE/sdk.js');
      window.FB.init({ appId: facebookAppId, cookie: true, xfbml: false, version: 'v24.0' });
      window.FB.login(async (result) => {
        if (!result.authResponse) return;
        finishLogin(await createFacebookAccount({
          accessToken: result.authResponse.accessToken,
        }));
      }, { scope: 'email,public_profile' });
    } catch {
      toast.error('Facebook-Anmeldung konnte nicht geladen werden');
    }
  };

  return (
    <div>
      {googleClientId ? (
        <div ref={googleButton} />
      ) : (
        <p className='text-muted'>Google-Anmeldung ist nicht konfiguriert.</p>
      )}
      <div className='my-3'>
        <button
          type='button'
          className='btn-social btn-facebook text-white shadow-sm'
          onClick={loginWithFacebook}
          disabled={!facebookAppId}
        >
          <i className='fab fa-facebook mx-2' />
          Weiter mit Facebook
        </button>
      </div>
    </div>
  );
}

export default SocialLogin;
