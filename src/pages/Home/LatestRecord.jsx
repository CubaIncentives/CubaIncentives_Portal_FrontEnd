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

  return (
    <>
      <div className='w-full flex flex-col justify-center items-center'>
        {data?.accommodations && data?.accommodations.length > 0 ? (
          <div className='pt-10 flex justify-center flex-col gap-6 2xl:max-w-[1920px] lg:max-w-screen-lg w-full'>
            <h3 className='font-extrabold 2xl:text-2xl lg:text-xl text-lg text-center text-customBlack'>
              Latest Added Accommodations
            </h3>
            <div className='grid grid-cols-1 gap-6  sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-4 pb-6'>
              {isLoading ? (
                <Loader />
              ) : (
                <AccommodationsCard accommodations={data?.accommodations} />
              )}
            </div>
          </div>
        ) : null}

        {data?.excursions && data?.excursions.length > 0 ? (
          <div className='pt-10 flex justify-center flex-col gap-6 2xl:max-w-[1920px] lg:max-w-screen-lg w-full'>
            <h3 className='font-extrabold 2xl:text-2xl lg:text-xl text-lg text-center text-customBlack'>
              Latest Added Excursions
            </h3>
            <div className=' grid grid-cols-1 gap-6  sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-4 pb-6'>
              {isLoading ? (
                <Loader />
              ) : (
                <ExcursionsCard excursions={data?.excursions} />
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