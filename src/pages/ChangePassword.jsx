import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useMutation } from '@tanstack/react-query';

import { Button, Input } from '@/components/Common';
import api from '@/utils/api';
import { PAGE_TITLE_SUFFIX } from '@/utils/constants';
import { successToast } from '@/utils/helper';
import changePassValidations from '@/validation/changePassValidations';

const initialState = {
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
};
const ChangePassword = () => {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const [error, setError] = useState({});
  const updateFormData = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateError = (name, value) => {
    setError((prev) => ({ ...prev, [name]: value }));
  };
  const handleOnChange = (e, name, charLimit = null, isRegexTrue = true) => {
    const { value } = e?.target || '';

    if ((!charLimit || value.length <= charLimit) && isRegexTrue) {
      updateFormData(name, value);
      updateError(name, '');
    }
  };

  const changePasswordAPI = async (payload) => {
    const response = await api.post('/user/change-password', payload);

    return response.data;
  };

  const { mutate: changePasswordMutation, isLoading: loading } = useMutation({
    mutationFn: changePasswordAPI,
    onSuccess: (data) => {
      successToast(data?.message);
      setFormData(initialState);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { isValid, errors } = changePassValidations(formData);

    if (isValid) {
      const payload = {
        current_password: formData.oldPassword,
        new_password: formData.newPassword,
      };

      changePasswordMutation(payload);
    } else {
      setError(errors);
    }
  };

  return (
    <div className='w-full mx-auto max-w-6xl overflow-x-auto p-6 py-10 h-[calc(100vh-117px)]'>
      <Helmet>
        <meta charSet='utf-8' />
        <title>Change Password {PAGE_TITLE_SUFFIX}</title>
      </Helmet>

      <div className='-mx-6 -mt-6 -top-[24px] -left-[24px] transition-all duration-300 bg-white flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0 py-5 px-6 sticky z-10'>
        <h1 className='text-lg flex font-semibold text-gray-900'>
          Change Password
        </h1>
      </div>

      <form
        onSubmit={(e) => handleSubmit(e)}
        className='w-full relative border rounded-lg shadow-md'
      >
        <div className='bg-white rounded-2xl'>
          <div className='flex flex-col gap-y-5 p-5 max-w-[400px]'>
            <Input
              isRequired
              label='Old Password'
              type={showOldPassword ? 'text' : 'password'}
              showPassword={showOldPassword}
              setShowPassword={setShowOldPassword}
              showIcon
              value={formData.oldPassword}
              onChange={(e) => handleOnChange(e, 'oldPassword')}
              error={error.oldPassword}
            />
            <Input
              isRequired
              label='New Password'
              type={showNewPassword ? 'text' : 'password'}
              showPassword={showNewPassword}
              setShowPassword={setShowNewPassword}
              showIcon
              value={formData.newPassword}
              onChange={(e) => handleOnChange(e, 'newPassword')}
              error={error.newPassword}
            />
            <Input
              isRequired
              label='Confirm Password'
              type={showConfirmPassword ? 'text' : 'password'}
              showPassword={showConfirmPassword}
              setShowPassword={setShowConfirmPassword}
              showIcon
              value={formData.confirmPassword}
              onChange={(e) => handleOnChange(e, 'confirmPassword')}
              error={error.confirmPassword}
            />

            <div className='mt-6'>
              <Button loading={loading} disabled={loading}>
                Save
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
