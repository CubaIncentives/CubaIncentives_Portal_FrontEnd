import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

const TableSkeleton = () => {
  return (
    <SkeletonTheme baseColor='#F2F4F7' highlightColor='#EAECF0'>
      <p className='mt-2'>
        <Skeleton count={9} height={40} className='mt-2' />
      </p>
    </SkeletonTheme>
  );
};

export default TableSkeleton;
