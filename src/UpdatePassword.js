import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation } from 'react-query';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import CircularProgress from '@mui/material/CircularProgress';
import { toast } from 'react-toastify';
import { NavbarBottom } from './NavbarBottom';
import { PageHeader } from './components/layout/PageHeader';
import { AppPage } from './components/layout/AppPage';
import ErrorService from './services/formatError/ErrorService';
import userServices from './services/httpService/userAuth/userServices';

export default function UpdatePassword() {
  const { email, uniqueId } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const updatePassword = useMutation(
    (payload) => userServices.updatePass(payload),
    {
      onError: (error) => {
        toast.error(ErrorService.uniformError(error));
      },
      onSuccess: () => {
        toast.success(t('toast.passwordChanged'));
        navigate('/dein-profil');
      },
    }
  );

  const formik = useFormik({
    initialValues: {
      pass: '',
      confirmPass: '',
    },
    validationSchema: Yup.object().shape({
      pass: Yup.string()
        .min(8, t('validation.minLength', { count: 8 }))
        .required(t('validation.required')),
      confirmPass: Yup.string()
        .oneOf([Yup.ref('pass')], t('validation.passwordMismatch'))
        .required(t('validation.required')),
    }),
    onSubmit: (values) => {
      updatePassword.mutate({
        email: decodeURIComponent(email),
        pass: values.pass,
        uniqueId,
      });
    },
  });

  return (
    <AppPage>
      <PageHeader title={t('auth.resetPassword')} />

      <div className='casual-menu'>
        <form onSubmit={formik.handleSubmit}>
          <div className='relative w-full mb-3'>
            <input
              name='pass'
              id='pass'
              type='password'
              className='input-style1'
              placeholder={t('auth.newPassword')}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.pass}
            />
            {formik.touched.pass && formik.errors.pass ? (
              <div className='error-color'>{formik.errors.pass}</div>
            ) : null}
          </div>

          <div className='relative w-full mb-3'>
            <input
              name='confirmPass'
              id='confirmPass'
              type='password'
              className='input-style1'
              placeholder={t('auth.confirmPassword')}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.confirmPass}
            />
            {formik.touched.confirmPass && formik.errors.confirmPass ? (
              <div className='error-color'>{formik.errors.confirmPass}</div>
            ) : null}
          </div>

          <div className='my-4'>
            {updatePassword.isLoading ? (
              <CircularProgress />
            ) : (
              <button
                type='submit'
                className='btn btn-success btn-lg button btn-sign border-black'
              >
                {t('auth.savePassword')}
              </button>
            )}
          </div>
        </form>
      </div>

      <NavbarBottom />
    </AppPage>
  );
}
