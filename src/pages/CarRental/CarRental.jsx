import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import CarRentalListSkeleton from '@/skeletons/CarRentalListSkeleton';
import { useMutation } from '@tanstack/react-query';

import { Button, NoDataFound } from '@/components/Common';
import api from '@/utils/api';
import { PAGE_TITLE_SUFFIX } from '@/utils/constants';
import { classNames } from '@/utils/helper';
import { ReactComponent as ProtectionIcon } from '@/assets/images/protection.svg';

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
                className='col-span-1 rounded-lg bg-white cursor-pointer border hover:border-blueColor hover:shadow-lg relative'
                onClick={() => navigate(`/car-rental/${company?.id}`)}
              >
                <img
                  src={company.company_logo}
                  alt={company.company_name}
                  className='rounded-t-lg min-h-[160px] h-[190px] w-full object-cover'
                />

                <div className='flex justify-between items-center py-3 px-4'>
                  <div>
                    <p className='font-semibold first-letter:uppercase'>
                      {company?.company_name}
                    </p>

                    <div className='flex items-center mt-3.5'>
                      <p
                        className={classNames(
                          'first-letter:uppercase text-sm flex items-center',
                          company?.cwd_included === 0
                            ? 'text-[#B90000]'
                            : 'text-blueColor'
                        )}
                      >
                        <ProtectionIcon className='h-3.5 w-3.5' />
                        <span className='ml-2'>
                          Insurance{' '}
                          {company?.cwd_included === 0
                            ? 'Excluded'
                            : 'Included'}{' '}
                        </span>
                      </p>

                      <div className='h-4 w-px mx-[14px] bg-slate-200'></div>
                      <p className='first-letter:uppercase text-sm text-[#585858]'>
                        Outside Pickup:{' '}
                        {company?.is_outside_hawana === 0 ? (
                          <span className='text-[#B90000]'>Not Allowed</span>
                        ) : (
                          <span className='text-[#25B900]'>Allowed</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div>
                    <Button size='sm'>View Cars</Button>
                  </div>
                </div>
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
