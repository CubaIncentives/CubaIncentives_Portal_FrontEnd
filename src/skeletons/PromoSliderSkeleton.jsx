import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

const PromoSliderSkeleton = () => {
  return (
    <div className='shadow-lg h-full w-full  max-w-[1920px]'>
      <SkeletonTheme baseColor='#F2F4F7' highlightColor='#EAECF0'>
        <div className='w-full rounded-lg '>
          <Skeleton
            count={1}
            className='rounded-lg  2xl:h-[482px] xl:h-[400px] lg:h-[300px] h-[300px]'
          />
        </div>
      </SkeletonTheme>
    </div>
  );
};

export default PromoSliderSkeleton;
