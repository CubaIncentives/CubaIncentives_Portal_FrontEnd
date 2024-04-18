const navigationData = () => {
  const navigation = [
    {
      name: 'dashboard',
      title: 'Dashboard',
      href: '/dashboard',
      iconClass: 'icon-grid-01',
      current: true,
      isSidemenu: false,
    },
    {
      name: 'users',
      title: 'Users',
      iconClass: 'icon-users-02',
      href: '#',
      current: false,
      isSidemenu: false,
    },
    {
      name: 'verify-prices',
      title: 'Verify Prices',
      iconClass: 'icon-users-02',
      href: '#',
      current: false,
      isSidemenu: false,
    },
    {
      name: 'accommodations',
      title: 'Accommodations',
      iconClass: 'icon-users-02',
      href: '#',
      current: false,
      isSidemenu: false,
    },
    {
      name: 'excursions',
      title: 'Excursions',
      iconClass: 'icon-users-02',
      href: '#',
      current: false,
      isSidemenu: false,
    },
    {
      name: 'car-rental',
      title: 'Car Rental',
      iconClass: 'icon-users-02',
      href: '#',
      current: false,
      isSidemenu: false,
    },
    {
      name: 'private-transfers',
      title: 'Private Transfers',
      iconClass: 'icon-users-02',
      href: '#',
      current: false,
      isSidemenu: false,
    },
    {
      name: 'group-transfers',
      title: 'Group Transfers',
      iconClass: 'icon-users-02',
      href: '#',
      current: false,
      isSidemenu: false,
    },
    {
      name: 'viazul',
      title: 'Viazul',
      iconClass: 'icon-users-02',
      href: '#',
      current: false,
      isSidemenu: false,
    },
    {
      name: 'notifications',
      title: 'Notifications',
      iconClass: 'icon-users-02',
      href: '#',
      current: false,
      isSidemenu: false,
    },
    {
      name: 'frontpage-promo',
      title: 'Frontpage Promo',
      iconClass: 'icon-users-02',
      href: '#',
      current: false,
      isSidemenu: false,
    },
    {
      name: 'terms-and-conditions',
      title: 'Terms & Conditions',
      iconClass: 'icon-users-02',
      href: '#',
      current: false,
      isSidemenu: false,
    },
  ];

  const subMenuListEmployees = [
    {
      title: 'Employee List',
      link: `/employee`,
      isPlusIcon: true,
      plusIconLink: `people/employee/add`,
      plusIconTitle: 'Add Employee',
    },
  ];

  return {
    navigation,
    subMenuListEmployees,
  };
};

export default navigationData;
