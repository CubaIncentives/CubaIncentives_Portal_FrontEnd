import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

import { Button, Input } from '@/components/Common';
import api from '@/utils/api';
import { setLocalStorageItem, successToast } from '@/utils/helper';
import logo from '@/assets/images/logo.png';

import loginValidation from '../../validation/loginValidation';

const SignIn = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState({});

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

  const login = async (payload) => {
    const response = await api.post('/login', payload);

    return response.data;
  };

  const LoginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      if (!data?.data?.token) {
        return;
      }

      const userData = {
        company: data?.data?.company,
        email: data?.data?.email,
        name: data?.data?.name,
        role: data?.data?.role,
      };

      successToast(data?.message);
      setLocalStorageItem('token', data?.data?.token);
      setLocalStorageItem('userData', userData);
      navigate('/dashboard');
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { errors, isValid } = loginValidation(formData);

    if (isValid) {
      const payload = {
        email: formData.email,
        password: formData.password,
      };

      LoginMutation.mutate(payload);
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
          <h1 className='text-palette1 text-2xl lg:text-[32px] leading-[38px] font-semibold'>
            Sign into{' '}
            <span className='text-palette2'>Cuba Incentives now!</span>
          </h1>
          <p className='text-sm font-normal text-gray-400'>
            Use your email and password to sign in
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
          <div>
            <Input
              isRequired
              label='Password'
              type={showPassword ? 'text' : 'password'}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              showIcon
              value={formData.password}
              onChange={(e) => handleOnChange(e, 'password')}
              error={error.password}
            />
            <p className='text-palette1 text-sm mt-4 text-right flex w-full justify-between'>
              <Link to='/forgot-password' className='text-end'>
                Forgot Password?
              </Link>
            </p>
          </div>
        </div>
        <div className='flex flex-col gap-y-8'>
          <div>
            <Button
              className='w-full text-center'
              loading={LoginMutation?.isPending}
            >
              Sign In
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
