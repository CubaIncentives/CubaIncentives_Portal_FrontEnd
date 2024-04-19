import { ReactComponent as Accommodations } from '@/assets/images/accommodations.svg';
import { ReactComponent as CarRental } from '@/assets/images/car-rental.svg';
import { ReactComponent as Dashboard } from '@/assets/images/dashboard.svg';
import { ReactComponent as Excursion } from '@/assets/images/excursion.svg';
import { ReactComponent as FrontpagePortal } from '@/assets/images/frontpage-portal.svg';
import { ReactComponent as GroupTransfers } from '@/assets/images/group-transfers.svg';
import { ReactComponent as Notifications } from '@/assets/images/notifications.svg';
import { ReactComponent as PrivateTransfers } from '@/assets/images/private-transfers.svg';
import { ReactComponent as TermsCondition } from '@/assets/images/terms-and-condition.svg';
import { ReactComponent as User } from '@/assets/images/user.svg';
import { ReactComponent as VerifyPrices } from '@/assets/images/verify-prices.svg';
import { ReactComponent as Viazul } from '@/assets/images/viazul.svg';

const navigationData = () => {
  const navigation = [
    {
      name: 'dashboard',
      title: 'Dashboard',
      href: '/dashboard',
      icon: <Dashboard className='w-4 h-4 hover:text-palette1' />,
      current: true,
      isSidemenu: false,
    },
    {
      name: 'users',
      title: 'Users',
      icon: <User className='w-4 h-4' />,
      href: '/users',
      current: false,
      isSidemenu: false,
    },
    {
      name: 'verify-prices',
      title: 'Verify Prices',
      icon: <VerifyPrices className='w-7 h-7' />,
      href: '/verify-prices',
      current: false,
      isSidemenu: false,
    },
    {
      name: 'accommodations',
      title: 'Accommodations',
      icon: <Accommodations className='w-5 h-5' />,
      href: '/accommodations',
      current: false,
      isSidemenu: false,
    },
    {
      name: 'excursions',
      title: 'Excursions',
      icon: <Excursion className='w-5 h-5' />,
      href: '/excursions',
      current: false,
      isSidemenu: false,
    },
    {
      name: 'car-rental',
      title: 'Car Rental',
      icon: <CarRental className='w-4 h-4' />,
      href: '/car-rental',
      current: false,
      isSidemenu: false,
    },
    {
      name: 'private-transfers',
      title: 'Private Transfers',
      icon: <PrivateTransfers className='w-4 h-4' />,
      href: '/private-transfers',
      current: false,
      isSidemenu: false,
    },
    {
      name: 'group-transfers',
      title: 'Group Transfers',
      icon: <GroupTransfers className='w-5 h-5' />,
      href: '/group-transfers',
      current: false,
      isSidemenu: false,
    },
    {
      name: 'viazul',
      title: 'Viazul',
      icon: <Viazul className='w-5 h-5' />,
      href: '/viazul',
      current: false,
      isSidemenu: false,
    },
    {
      name: 'notifications',
      title: 'Notifications',
      icon: <Notifications className='w-5 h-5' />,
      href: '/notifications',
      current: false,
      isSidemenu: false,
    },
    {
      name: 'frontpage-Portal',
      title: 'Frontpage Portal',
      icon: <FrontpagePortal className='w-5 h-5' />,
      href: '/frontpage-Portal',
      current: false,
      isSidemenu: false,
    },
    {
      name: 'terms-and-conditions',
      title: 'Terms & Conditions',
      icon: <TermsCondition className='w-5 h-5' />,
      href: '/terms-and-conditions',
      current: false,
      isSidemenu: false,
    },
  ];

  return {
    navigation,
  };
};

export default navigationData;
