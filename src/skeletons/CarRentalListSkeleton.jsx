import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

const CarRentalListSkeleton = () => {
  return (
    <div>
      <SkeletonTheme baseColor='#F2F4F7' highlightColor='#EAECF0'>
        <div className='w-full grid grid-cols-1 gap-6 sm:grid-cols-2 pb-6'>
          {[...Array(6)].map((_, index) => (
            <Skeleton
              key={index}
              count={1}
              height={270}
              className='rounded-lg col-span-1'
            />
          ))}
        </div>
      </SkeletonTheme>
    </div>
  );
};

export default CarRentalListSkeleton;