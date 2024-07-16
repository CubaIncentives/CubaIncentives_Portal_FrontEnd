import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import CarRentalListSkeleton from '@/skeletons/CarRentalListSkeleton';
import { useMutation } from '@tanstack/react-query';

import { NoDataFound } from '@/components/Common';
import api from '@/utils/api';
import { PAGE_TITLE_SUFFIX } from '@/utils/constants';

const CarRental = () => {
  const navigate = useNavigate();
  const fetchCarRentals = async () => {
    let url = '/car-rental/company';

    const res = await api.get(url);

    return res.data;
  };

  const CarRentalMutation = useMutation({
    mutationFn: fetchCarRentals,
  });

  useEffect(() => {
    CarRentalMutation.mutate();
  }, []);

  return (
    <div className='flex flex-row'>
      <Helmet>
        <meta charSet='utf-8' />
        <title>Car Rental {PAGE_TITLE_SUFFIX}</title>
      </Helmet>

      <div className='side-container'></div>
      <div className='main-container'>
        {(CarRentalMutation.isLoading || CarRentalMutation.isFetching) && (
          <CarRentalListSkeleton />
        )}

        {!CarRentalMutation?.data?.data?.length &&
          !CarRentalMutation?.isFetching &&
          !CarRentalMutation?.isLoading && (
            <div className='bg-white h-[calc(100vh-390px)] flex flex-col justify-center'>
              <NoDataFound title='No car rental found' />
            </div>
          )}

        {((!CarRentalMutation?.data?.data?.length > 0 &&
          !CarRentalMutation.isLoading) ||
          !CarRentalMutation.isFetching) && (
          <div className='w-full grid grid-cols-1 gap-6 sm:grid-cols-2'>
            {CarRentalMutation?.data?.data?.map((company, index) => (
              <div
                key={index}
                className='col-span-1 rounded-lg bg-white cursor-pointer border hover:border-palette4 hover:shadow-lg relative'
                onClick={() => navigate(`/car-rental/${company?.id}`)}
              >
                <div className='block absolute top-0 right-0 left-0 bg-[#7f7f7f] text-white py-[5px] px-[15px] z-20 uppercase text-sm font-medium'>
                  {company?.cwd_included === 0 ? 'Excluded' : 'Included'}{' '}
                  Insurance
                </div>
                <img
                  src={company.company_logo}
                  alt={company.company_name}
                  className='rounded-t-lg min-h-[160px] h-[190px] w-full object-cover'
                />
                <p className='py-3 px-4 font-semibold first-letter:uppercase'>
                  {company?.company_name}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className='side-container'></div>
    </div>
  );
};

export default CarRental;
