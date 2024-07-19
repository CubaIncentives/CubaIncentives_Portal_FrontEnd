import { lazy } from 'react';
import AccommodationDetail from '@/pages/Accommodations/AccommodationDetail';
import Accommodations from '@/pages/Accommodations/Accommodations';
import CarRental from '@/pages/CarRental/CarRental';
import CarRentalDetail from '@/pages/CarRental/CarRentalDetail';
import ChangePassword from '@/pages/ChangePassword';
import ExcursionDetail from '@/pages/Excursions/ExcursionDetail';
import Excursions from '@/pages/Excursions/Excursions';
import Home from '@/pages/Home';
import ForgotPassword from '@/pages/LRF/ForgotPassword';
import SignIn from '@/pages/LRF/SignIn';
import TermsAndConditions from '@/pages/TermsAndConditions';
import GroupTransfer from '@/pages/Transport/GroupTransfer';
import PrivateTransfer from '@/pages/Transport/PrivateTransfer';
import Transport from '@/pages/Transport/Transport';
import Viazul from '@/pages/Transport/Viazul';

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
    path: '/home',
    exact: true,
    name: 'Home',
    component: Home,
    private: true,
  },
  {
    path: '/accommodations',
    exact: true,
    name: 'Accommodations',
    component: Accommodations,
    private: true,
  },
  {
    path: '/accommodation/:accommodationId',
    exact: true,
    name: 'Accommodation Detail',
    component: AccommodationDetail,
    private: true,
  },
  {
    path: '/excursions',
    exact: true,
    name: 'Excursions',
    component: Excursions,
    private: true,
  },
  {
    path: '/excursion/:excursionId',
    exact: true,
    name: 'Excursion Detail',
    component: ExcursionDetail,
    private: true,
  },
  {
    path: '/car-rental',
    exact: true,
    name: 'Car rental',
    component: CarRental,
    private: true,
  },
  {
    path: '/car-rental/:companyId',
    exact: true,
    name: 'Car rental Detail',
    component: CarRentalDetail,
    private: true,
  },
  {
    path: '/transport',
    exact: true,
    name: 'Transport',
    component: Transport,
    private: true,
  },
  {
    path: '/transport/group-transfer',
    exact: true,
    name: 'Group transfer',
    component: GroupTransfer,
    private: true,
  },
  {
    path: '/transport/private-transfer',
    exact: true,
    name: 'Private transfer',
    component: PrivateTransfer,
    private: true,
  },
  {
    path: '/transport/viazul',
    exact: true,
    name: 'Viazul',
    component: Viazul,
    private: true,
  },
  {
    path: '/terms-and-conditions',
    exact: true,
    name: 'Terms and Conditions',
    component: TermsAndConditions,
    private: true,
  },
];

export default routes;
