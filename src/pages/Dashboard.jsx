import React from 'react';
import { Helmet } from 'react-helmet';

import { PAGE_TITLE_SUFFIX } from '@/utils/constants';

const Dashboard = () => {
  return (
    <div className='flex flex-row'>
      <Helmet>
        <meta charSet='utf-8' />
        <title>Portal {PAGE_TITLE_SUFFIX}</title>
      </Helmet>
      <div className='side-container'></div>

      <div className='main-container'>Dashboard</div>
      <div className='side-container'></div>
    </div>
  );
};

export default Dashboard;
