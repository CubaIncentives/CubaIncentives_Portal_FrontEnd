import React from 'react';
import { Helmet } from 'react-helmet';

import { PAGE_TITLE_SUFFIX } from '@/utils/constants';

const Home = () => {
  return (
    <div className='flex flex-row'>
      <Helmet>
        <meta charSet='utf-8' />
        <title>Portal Home {PAGE_TITLE_SUFFIX}</title>
      </Helmet>
      <div className='side-container'></div>

      <div className='main-container'>Home</div>
      <div className='side-container'></div>
    </div>
  );
};

export default Home;
