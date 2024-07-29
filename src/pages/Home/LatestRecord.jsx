import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import PropTypes from 'prop-types';

import AccommodationsCard from '@/components/AccommodationsCard';
import ExcursionsCard from '@/components/ExcursionsCard';

const Loader = () => {
  return [...Array(4)].map((_, index) => (
    <Skeleton
      key={index}
      count={1}
      height={270}
      width={600}
      className='rounded-lg col-span-1 lg:max-w-[460px] xl:max-w-[500px] 2xl:max-w-[450px]'
    />
  ));
};

const LatestRecord = (props) => {
  const { data, isLoading } = props;
  const [excursionsData, setExcursionsData] = useState([]);
  const [accommodationsData, setAccommodationsData] = useState([]);

  useEffect(() => {
    const handleResize = () => {
      const isDesktop = window.matchMedia('(min-width: 1621px)').matches;
      const isLaptop = window.matchMedia(
        '(min-width: 1220px) and (max-width: 1621px)'
      ).matches;
      const isMiniLaptop = window.matchMedia(
        '(min-width: 1023px) and (max-width: 1214px)'
      ).matches;

      if (isDesktop) {
        setExcursionsData(data?.excursions.slice(0, 4));
        setAccommodationsData(data?.accommodations.slice(0, 4));
      } else if (isLaptop) {
        setExcursionsData(data?.excursions.slice(0, 6));
        setAccommodationsData(data?.accommodations.slice(0, 6));
      } else if (isMiniLaptop) {
        setExcursionsData(data?.excursions.slice(0, 4));
        setAccommodationsData(data?.accommodations.slice(0, 4));
      } else {
        setExcursionsData(data?.excursions.slice(0, 4));
        setAccommodationsData(data?.accommodations.slice(0, 4));
      }
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Clean up event listener
    return () => window.removeEventListener('resize', handleResize);
  }, [data]);

  return (
    <>
      <div className='w-full flex flex-col justify-center items-center gap-10'>
        {data?.accommodations && data?.accommodations.length > 0 ? (
          <div className='xl:pt-10 pt-0 flex justify-center flex-col gap-[30px] 2xl:max-w-[1920px] lg:max-w-full w-full'>
            <h3 className='font-extrabold 2xl:text-[34px] xl:text-3xl lg:text-2xl text-lg text-center text-customBlack '>
              Latest Added Accommodations
            </h3>
            <div className='flex flex-wrap 2xl:gap-6 gap-5 justify-center pb-6 latest-data-custom-cards'>
              {isLoading ? (
                <Loader />
              ) : (
                <AccommodationsCard accommodations={accommodationsData} />
              )}
            </div>
          </div>
        ) : null}

        {data?.excursions && data?.excursions.length > 0 ? (
          <div className='xl:pt-10 pt-0 flex justify-center flex-col gap-[30px] 2xl:max-w-[1920px] lg:max-w-full w-full'>
            <h3 className='font-extrabold 2xl:text-[34px] xl:text-3xl lg:text-2xl text-lg text-center text-customBlack '>
              Latest Added Excursions
            </h3>
            <div className='flex flex-wrap 2xl:gap-6 gap-5 justify-center pb-6 latest-data-custom-cards'>
              {isLoading ? (
                <Loader />
              ) : (
                <ExcursionsCard excursions={excursionsData} />
              )}
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
};

LatestRecord.propTypes = {
  data: PropTypes.object,
  isLoading: PropTypes.bool,
};

export default LatestRecord;
