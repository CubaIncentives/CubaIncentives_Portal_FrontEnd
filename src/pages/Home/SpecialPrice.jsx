import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import AccommodationsCard from '@/components/AccommodationsCard';

const Loader = () => {
  return [...Array(2)].map((_, index) => (
    <Skeleton
      key={index}
      count={1}
      height={270}
      className='rounded-lg w-full'
    />
  ));
};

const SpecialPrice = (props) => {
  const { isLoading, data, isShowViewMoreSpecialPrice } = props;
  const [finalData, setFinalData] = useState([]);

  useEffect(() => {
    const handleResize = () => {
      const isDesktop = window.matchMedia('(min-width: 1280px)').matches;
      const isLaptop = window.matchMedia(
        '(min-width: 1220px) and (max-width: 1279px)'
      ).matches;
      const isMiniLaptop = window.matchMedia(
        '(min-width: 1023px) and (max-width: 1214px)'
      ).matches;

      if (isDesktop) {
        setFinalData(data.slice(0, 2));
      } else if (isLaptop) {
        setFinalData(data.slice(0, 3));
      } else if (isMiniLaptop) {
        setFinalData(data.slice(0, 2));
      } else {
        setFinalData(data.slice(0, 2)); // Default case if none of the conditions are met
      }
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Clean up event listener
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <div className='xl:flex hidden flex-col w-full '>
        <div className='flex items-center justify-between pb-[30px]'>
          <h3 className='font-extrabold  2xl:text-[34px] xl:text-3xl lg:text-2xl text-lg '>
            Special Price
          </h3>
          {isShowViewMoreSpecialPrice ? (
            <div>
              <Link
                to={'/accommodations?discount=specials'}
                className='text-customBlue underline text-base font-normal'
              >
                See All
              </Link>
            </div>
          ) : null}
        </div>

        <div className='grid grid-cols-1  gap-6 pb-6  rounded-lg'>
          {isLoading ? (
            <Loader />
          ) : (
            <AccommodationsCard accommodations={finalData} />
          )}
        </div>
      </div>

      <div className='flex justify-center'>
        <div className='flex xl:hidden flex-col w-full max-w-full'>
          <div className='flex items-center justify-center pb-[30px]'>
            <h3 className='font-extrabold  2xl:text-[34px] xl:text-3xl lg:text-2xl text-lg '>
              Special Price
            </h3>
          </div>

          <div className='flex flex-wrap 2xl:gap-6 gap-5 justify-center pb-6 latest-data-custom-cards'>
            {isLoading ? (
              <Loader />
            ) : (
              <AccommodationsCard accommodations={finalData} />
            )}
          </div>
          {isShowViewMoreSpecialPrice ? (
            <div className='flex  justify-center'>
              <Link
                to={'/accommodations?discount=specials'}
                className='text-customBlue underline text-base font-normal'
              >
                See All
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

SpecialPrice.propTypes = {
  isLoading: PropTypes.bool,
  isShowViewMoreSpecialPrice: PropTypes.bool,
  data: PropTypes.array,
};

export default SpecialPrice;
