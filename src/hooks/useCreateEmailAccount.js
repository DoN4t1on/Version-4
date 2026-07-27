import { useMutation, useQueryClient } from 'react-query';
import { fetchWrapper } from '../services/restApi';
import { toast } from 'react-toastify';
import i18n from '../i18n';
import ErrorService from '../services/formatError/ErrorService';
import { storeLocalData } from '../services/auth/localStorageData';
export const useCreateEmailAccount = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (body) => {
      return fetchWrapper('POST', `userAuth/registerByEmail`, body);
    },
    {
      onSuccess: (data) => {
        if (data.status) {
          toast.success(i18n.t('toast.registerSuccess'));
        }
      },
      onError: (err) => {
        toast.error(ErrorService.uniformError(err));
      },
    }
  );
};
