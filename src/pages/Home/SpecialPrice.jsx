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

  return (
    <div className='flex flex-col w-full'>
      <div className='flex items-center justify-between pb-4'>
        <h3 className='font-semibold 2xl:text-2xl lg:text-xl text-lg '>
          Special Price
        </h3>
        {isShowViewMoreSpecialPrice ? (
          <div>
            <Link
              to={'/accommodations?discount=specials'}
              className='text-customBlue underline text-sm font-normal'
            >
              See All
            </Link>
          </div>
        ) : null}
      </div>

      <div className='grid grid-cols-1 gap-6 pb-6  rounded-lg'>
        {isLoading ? <Loader /> : <AccommodationsCard accommodations={data} />}
      </div>
    </div>
  );
};

SpecialPrice.propTypes = {
  isLoading: PropTypes.bool,
  isShowViewMoreSpecialPrice: PropTypes.bool,
  data: PropTypes.array,
};

export default SpecialPrice;
