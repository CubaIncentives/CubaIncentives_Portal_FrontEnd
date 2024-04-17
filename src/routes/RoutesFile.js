import { lazy } from 'react';
import ChangePassword from '@/pages/ChangePassword';
import Dashboard from '@/pages/Dashboard';
import ForgotPassword from '@/pages/LRF/ForgotPassword';
import SignIn from '@/pages/LRF/SignIn';

const ResetPassword = lazy(() => import('@/pages/LRF/ResetPassword.jsx'));

const routes = [
  {
    path: '/sign-in',
    exact: true,
    name: 'Sign In',
    component: SignIn,
    private: false,
  },
  {
    path: '/forgot-password',
    exact: true,
    name: 'Forgot Password',
    component: ForgotPassword,
    private: false,
  },
  {
    path: '/reset-password',
    exact: true,
    name: 'Reset Password',
    component: ResetPassword,
    private: false,
  },
  {
    path: '/change-password',
    exact: true,
    name: 'Change Password',
    component: ChangePassword,
    private: true,
  },
  {
    path: '/dashboard',
    exact: true,
    name: 'Dashboard',
    component: Dashboard,
    private: true,
  },
];

export default routes;
