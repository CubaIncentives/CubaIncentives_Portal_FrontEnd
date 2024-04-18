import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

import { Button, Input } from '@/components/Common';
import { successToast } from '@/utils/helper';
import logo from '@/assets/images/logo.png';

import api from '../../utils/api';
import resetPasswordValidation from '../../validation/resetPasswordValidation';

const ResetPassword = () => {
  const query = new URLSearchParams(location.search);
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState({});
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  const token = query.get('token');
  const email = query.get('email');

  const updateFormData = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const updateError = (name, value) => {
    setError((prev) => ({ ...prev, [name]: value }));
  };
  const handleOnChange = (e, name, charLimit = null) => {
    const { value } = e?.target || e || '';

    if (!charLimit || value.length <= charLimit) {
      updateFormData(name, value);
      updateError(name, '');
    }
  };

  const resetPassword = async (payload) => {
    const response = await api.post('/reset-password', payload);

    return response.data;
  };

  const ResetPasswordMutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: (data) => {
      successToast(data?.message);
      navigate('/sign-in');
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { errors, isValid } = resetPasswordValidation(formData);

    if (isValid) {
      const payload = {
        email: email,
        token: token,
        password: formData.password,
      };

      ResetPasswordMutation.mutate(payload);
    } else {
      setError(errors);
    }
  };

  return (
    <div className='flex flex-col justify-center items-center py-5 px-4 md:mx-5 xl:my-0 xl:mx-0 h-full'>
      <form
        onSubmit={(e) => handleSubmit(e)}
        className='sm:max-w-[400px] w-full md:max-w-[350px] xl:max-w-[450px] flex flex-col gap-y-8'
      >
        <div className='flex flex-col gap-y-4'>
          <div className='flex justify-center mb-6'>
            <img src={logo} alt='' className='w-[300px]' />
          </div>
          <h1 className='text-indigo-600 text-2xl lg:text-[32px] leading-[38px] font-semibold'>
            Reset password
          </h1>

          <p className='text-base font-normal text-gray-600'>
            Enter a new password
          </p>
        </div>
        <div className='flex flex-col gap-y-6'>
          <Input
            isRequired
            label={'New Password'}
            type={`${showPassword ? 'text' : 'password'}`}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            showIcon
            value={formData.password}
            onChange={(e) => handleOnChange(e, 'password')}
            error={error.password}
            autoFocus
          />
          <Input
            isRequired
            label='Confirm Password'
            type={`${showConfirmPassword ? 'text' : 'password'}`}
            showPassword={showConfirmPassword}
            setShowPassword={setShowConfirmPassword}
            showIcon
            value={formData.confirmPassword}
            onChange={(e) => handleOnChange(e, 'confirmPassword')}
            error={error.confirmPassword}
          />
        </div>
        <div className='flex flex-col gap-y-8'>
          <Button
            className='w-full text-center'
            loading={ResetPasswordMutation?.isPending}
          >
            Submit
          </Button>
        </div>
      </form>
      <Button
        className='text-center hover:bg-transparent bg-transparent !text-gray-600 mt-[22px]'
        type='text'
        onClick={() => navigate('/sign-in')}
      >
        {' '}
        <div className='flex items-center gap-x-2'>
          <span className='icon-arrow-narrow-left text-xl' />
          Back to Sign In
        </div>
      </Button>
    </div>
  );
};

export default ResetPassword;
