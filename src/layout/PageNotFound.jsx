import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';

import { PAGE_TITLE_SUFFIX } from '@/utils/constants';
import logo from '@/assets/images/logo.png';
import backgroundImage from '@/assets/images/not-found-page-bg.jpg';

const PageNotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/page-not-found', { replace: true });
  }, []);

  return (
    <div
      className='h-screen bg-cover bg-center'
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <Helmet>
        <meta charSet='utf-8' />
        <title>Page not found {PAGE_TITLE_SUFFIX}</title>
      </Helmet>
      <div className='absolute  left-1/2  -translate-x-1/2 '>
        <img
          src={logo}
          alt='logo'
          className='h-screen w-screen max-w-36 max-h-16 '
        />
      </div>

      <div className='flex flex-col justify-center items-center h-full pb-64 xl:pb-60'>
        <h1 className='my-2 text-white font-bold text-8xl'>404</h1>
        <p className='my-2 text-white text-3xl text-center'>
          Oops! It looks like you landed on a remote island…
          <br />
          just not the one you were looking for.
        </p>
        <button
          onClick={() => {
            navigate('/');
          }}
          className='sm:w-full lg:w-auto my-2 drop-shadow-md hover:shadow-xl hover:drop-shadow-none outline-none rounded md py-2 px-8 text-center hover:bg-transparent text-white bg-blue-300'
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default PageNotFound;
