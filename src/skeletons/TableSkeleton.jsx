import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import PropTypes from 'prop-types';

const TableSkeleton = ({ rowCount = 9 }) => {
  return (
    <SkeletonTheme baseColor='#F2F4F7' highlightColor='#EAECF0'>
      <p className='mt-2'>
        <Skeleton count={rowCount} height={40} className='mt-2' />
      </p>
    </SkeletonTheme>
  );
};

TableSkeleton.propTypes = {
  rowCount: PropTypes.number,
};

export default TableSkeleton;
