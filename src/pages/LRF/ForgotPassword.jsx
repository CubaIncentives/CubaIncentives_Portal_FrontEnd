import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

import { Button, Input } from '@/components/Common';
import { successToast } from '@/utils/helper';
import logo from '@/assets/images/logo.png';

import api from '../../utils/api';
import forgotPassValidation from '../../validation/forgotPasswordValidation';

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [error, setError] = useState({});
  const [formData, setFormData] = useState({ email: '' });

  const handleOnChange = (e, name, charLimit = null) => {
    const { value } = e?.target || e || '';

    if (!charLimit || value.length <= charLimit) {
      updateFormData(name, value);
      updateError(name, '');
    }
  };

  const updateFormData = (name, value) =>
    setFormData((prev) => ({ ...prev, [name]: value }));
  const updateError = (name, value) =>
    setError((prev) => ({ ...prev, [name]: value }));

  const forgotPassword = async (payload) => {
    const response = await api.post('/forgot-password', payload);

    return response.data;
  };

  const ForgotPasswordMutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: (data) => {
      successToast(data?.message);
      navigate('/sign-in');
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { errors, isValid } = forgotPassValidation(formData);

    if (isValid) {
      const payload = {
        email: formData.email,
      };

      ForgotPasswordMutation.mutate(payload);
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
            Forgot password?
          </h1>

          <p className='text-base font-normal text-gray-600'>
            No worries, we’ll send you reset instructions.
          </p>
        </div>
        <div className='flex flex-col gap-y-6'>
          <Input
            isRequired
            label='Email'
            maxLength={150}
            value={formData.email}
            onChange={(e) => handleOnChange(e, 'email', 150)}
            error={error.email}
            autoFocus
          />
        </div>
        <div className='flex flex-col gap-y-8'>
          <Button
            className='w-full text-center'
            loading={ForgotPasswordMutation?.isPending}
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

export default ForgotPassword;
