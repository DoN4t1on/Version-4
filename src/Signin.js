import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import SocialLogin from './SocialLogin';
import Signup from './Signup';
import { AuthModal } from './components/layout/AuthModal';
import { AuthField } from './components/auth/AuthField';
import { LOGIN } from './reactStore/actions/Actions';
import { useLoginEmailAccount } from './hooks';
import userServices from './services/httpService/userAuth/userServices';
import ErrorService from './services/formatError/ErrorService';

function Signin() {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const [openSignUp, setOpenSignUp] = React.useState(false);
  const [openForgotPass, setOpenForgotPass] = React.useState(false);
  const [forgotEmail, setForgotEmail] = React.useState('');
  const [forgotLoading, setForgotLoading] = React.useState(false);

  const dispatch = useDispatch();
  const { mutateAsync: loginEmailAccount, isLoading } = useLoginEmailAccount();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { pass: '', username: '' },
    validationSchema: Yup.object().shape({
      username: Yup.string()
        .min(4, t('validation.minLength', { count: 4 }))
        .required(t('validation.required')),
      pass: Yup.string()
        .min(8, t('validation.minLength', { count: 8 }))
        .required(t('validation.required')),
    }),
    onSubmit: async (values) => {
      const response = await loginEmailAccount(values);
      if (response.status) {
        dispatch(LOGIN(response.data));
        setOpen(false);
        navigate('/');
      }
    },
  });

  const requestPasswordReset = async () => {
    if (!forgotEmail) {
      toast.error(t('auth.enterEmail'));
      return;
    }

    setForgotLoading(true);
    try {
      await userServices.applyForForgetPass({ email: forgotEmail });
      toast.success(t('toast.emailSent'));
      setOpenForgotPass(false);
      setForgotEmail('');
    } catch (error) {
      toast.error(ErrorService.uniformError(error));
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div>
      <button
        className='btn btn-success btn-lg button auth-trigger'
        type='button'
        onClick={() => setOpen(true)}
      >
        {t('auth.login')}
      </button>

      <AuthModal
        open={open}
        onClose={() => setOpen(false)}
        title={t('auth.loginTitle')}
      >
        <SocialLogin />
        <div className='auth-modal__divider'>
          <span>{t('auth.orContinueWithEmail')}</span>
        </div>
        <form onSubmit={formik.handleSubmit} className='auth-form'>
          <AuthField
            id='signin-username'
            name='username'
            label={t('auth.email')}
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.username && formik.errors.username}
          />
          <AuthField
            id='signin-pass'
            name='pass'
            type='password'
            label={t('auth.password')}
            value={formik.values.pass}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.pass && formik.errors.pass}
          />
          <div className='auth-form__actions'>
            {isLoading ? (
              <CircularProgress size={28} />
            ) : (
              <button type='submit' className='btn btn-success btn-lg button auth-form__submit'>
                {t('auth.login')}
              </button>
            )}
          </div>
          <button
            type='button'
            className='auth-form__link'
            onClick={() => {
              setOpen(false);
              setOpenForgotPass(true);
            }}
          >
            {t('auth.forgotPassword')}
          </button>
          <button
            type='button'
            className='auth-form__link'
            onClick={() => {
              setOpen(false);
              setOpenSignUp(true);
            }}
          >
            {t('auth.noAccount')}
          </button>
        </form>
      </AuthModal>

      <Signup open={openSignUp} onClose={() => setOpenSignUp(false)} hideTrigger />

      <AuthModal
        open={openForgotPass}
        onClose={() => setOpenForgotPass(false)}
        title={t('auth.resetPassword')}
        footer={
          <>
            <button
              type='button'
              className='btn btn-success button button--ghost'
              onClick={() => setOpenForgotPass(false)}
            >
              {t('auth.close')}
            </button>
            <button
              type='button'
              className='btn btn-success button'
              onClick={requestPasswordReset}
              disabled={forgotLoading}
            >
              {forgotLoading ? t('auth.sending') : t('auth.sendLink')}
            </button>
          </>
        }
      >
        <AuthField
          id='forgot-email'
          type='email'
          label={t('auth.emailAddress')}
          value={forgotEmail}
          onChange={(event) => setForgotEmail(event.target.value)}
        />
      </AuthModal>
    </div>
  );
}

export default Signin;
