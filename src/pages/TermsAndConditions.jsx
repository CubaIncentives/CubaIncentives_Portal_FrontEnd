import React from 'react';
import { Helmet } from 'react-helmet';
import { useQuery } from '@tanstack/react-query';
import moment from 'moment';

import { CustomSpinner } from '@/components/Common';
import api from '@/utils/api';
import { PAGE_TITLE_SUFFIX } from '@/utils/constants';

const TermsAndConditions = () => {
  const getTermsAndConditionData = async () => {
    const res = await api.get('/cms/terms_conditions');

    return res.data;
  };

  const { isLoading, isFetching, data } = useQuery(
    ['get-terms-and-conditions'],
    () => getTermsAndConditionData()
  );

  return (
    <div className='flex flex-row'>
      <div className='side-container'></div>
      <div className='main-container'>
        <Helmet>
          <meta charSet='utf-8' />
          <title>Terms & Conditions {PAGE_TITLE_SUFFIX}</title>
        </Helmet>

        {(isFetching || isLoading) && (
          <div className='bg-white h-[300px] flex flex-col justify-center'>
            <CustomSpinner className='h-[50px] w-[40px] flex justify-center items-center'></CustomSpinner>
          </div>
        )}

        {!isFetching && !isLoading && (
          <div className='border shadow-md rounded-md p-4'>
            {data?.data?.description ? (
              <div
                className='first-letter:uppercase text-gray-500 break-words '
                dangerouslySetInnerHTML={{
                  __html: data?.data?.description,
                }}
              ></div>
            ) : (
              <p></p>
            )}

            <p className='text-xs text-gray-400 font-medium mt-4'>
              Last update:{' '}
              {moment(data?.data?.last_updated).format('DD-MM-YYYY')}
            </p>
          </div>
        )}
      </div>
      <div className='side-container'></div>
    </div>
  );
};

export default TermsAndConditions;
