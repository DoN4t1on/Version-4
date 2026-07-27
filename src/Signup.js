import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import SocialLogin from './SocialLogin';
import { AuthModal } from './components/layout/AuthModal';
import { AuthField } from './components/auth/AuthField';
import { useCreateEmailAccount } from './hooks';

function Signup({ open: controlledOpen, onClose, hideTrigger = false }) {
  const { t } = useTranslation();
  const [internalOpen, setInternalOpen] = React.useState(false);
  const open = controlledOpen ?? internalOpen;

  const handleClickOpen = () => {
    setInternalOpen(true);
  };

  const handleClose = () => {
    if (onClose) onClose();
    setInternalOpen(false);
  };

  const { mutateAsync: createEmailAccount, isLoading } = useCreateEmailAccount();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      pass: '',
      username: '',
      email: '',
    },
    validationSchema: Yup.object().shape({
      username: Yup.string()
        .min(4, t('validation.minLength', { count: 4 }))
        .required(t('validation.required')),
      email: Yup.string()
        .min(4, t('validation.minLength', { count: 4 }))
        .required(t('validation.required')),
      pass: Yup.string()
        .min(8, t('validation.minLength', { count: 8 }))
        .required(t('validation.required')),
    }),
    onSubmit: async (values) => {
      const response = await createEmailAccount(values);

      if (response.status) {
        handleClose();
        navigate('/');
      }
    },
  });

  return (
    <div>
      {hideTrigger ? null : (
        <button
          className='btn btn-success btn-lg button auth-trigger'
          type='button'
          onClick={handleClickOpen}
        >
          {t('auth.register')}
        </button>
      )}

      <AuthModal
        open={open}
        onClose={handleClose}
        title={t('auth.registerTitle')}
      >
        <SocialLogin />
        <div className='auth-modal__divider'>
          <span>{t('auth.orContinueWithEmail')}</span>
        </div>
        <form onSubmit={formik.handleSubmit} className='auth-form'>
          <AuthField
            id='signup-username'
            name='username'
            label={t('auth.name')}
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.username && formik.errors.username}
          />
          <AuthField
            id='signup-email'
            name='email'
            type='email'
            label={t('auth.email')}
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && formik.errors.email}
          />
          <AuthField
            id='signup-pass'
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
                {t('auth.register')}
              </button>
            )}
          </div>
        </form>
      </AuthModal>
    </div>
  );
}

export default Signup;
