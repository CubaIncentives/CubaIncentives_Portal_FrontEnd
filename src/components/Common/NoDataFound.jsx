import PropTypes from 'prop-types';

import { ReactComponent as NoData } from '@/assets/images/no-data.svg';

import Button from './Button';

const NoDataFound = ({ title, btnTitle, onClick, children }) => {
  return (
    <>
      <div className='flex items-center justify-center'>
        <div
          className={`${
            children ? 'bg-white border' : 'bg-palette9'
          } p-8 rounded-full`}
        >
          {children ? (
            children
          ) : (
            <NoData className='flex items-center justify-center text-[40px] h-12 w-12 text-black' />
          )}
        </div>
      </div>
      <div className='flex items-center justify-center flex-col'>
        <p className='pt-5 pb-6 text-gray-900 font-semibold text-lg '>
          {title}
        </p>
        {btnTitle && (
          <Button type='button' onClick={onClick}>
            <span className='icon-plus text-xl'></span>
            {btnTitle}
          </Button>
        )}
      </div>
    </>
  );
};

NoDataFound.propTypes = {
  title: PropTypes.string.isRequired,
  btnTitle: PropTypes.string,
  name: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.any,
};

export default NoDataFound;
