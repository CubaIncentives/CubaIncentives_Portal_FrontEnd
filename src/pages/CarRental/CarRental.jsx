import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import CarRentalListSkeleton from '@/skeletons/CarRentalListSkeleton';
import { useMutation } from '@tanstack/react-query';

import { Button, NoDataFound } from '@/components/Common';
import api from '@/utils/api';
import { PAGE_TITLE_SUFFIX } from '@/utils/constants';
import { classNames } from '@/utils/helper';
import noImage from '@/assets/images/no-image.png';
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
    <div className='flex flex-row justify-center'>
      <Helmet>
        <meta charSet='utf-8' />
        <title>Car Rental {PAGE_TITLE_SUFFIX}</title>
      </Helmet>

      <div className='main-container flex justify-center'>
        <div className='side-container hidden xl:flex' />
        <div className='xl:max-w-5xl max-w-4xl 2xl:!px-0 w-full'>
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
                  className='col-span-1  rounded-lg bg-white cursor-pointer border hover:border-blueColor hover:shadow-lg relative'
                  onClick={() => navigate(`/car-rental/${company?.id}`)}
                >
                  <div className='rounded-t-lg min-h-[160px] h-[190px] w-full'>
                    <img
                      src={company.company_logo}
                      onError={(e) => {
                        e.target.src = noImage;
                      }}
                      alt={company.company_name}
                      className='rounded-t-lg object-cover h-full w-full'
                    />
                  </div>

                  <div className='flex pt-3 px-4 w-full  xl:hidden '>
                    <p className='font-semibold  text-lg  xl:text-xl first-letter:uppercase line-clamp-1 '>
                      {company?.company_name}
                    </p>
                  </div>
                  <div className='flex xl:py-3 pb-3 px-4 w-full justify-between'>
                    <div className='flex lg:flex-wrap flex-col w-full break-words max-w-[60%] lg:max-w-[70%] 2xl:max-w-[80%] '>
                      <div className='xl:flex hidden '>
                        <p className='font-semibold text-lg  xl:text-xl first-letter:uppercase line-clamp-1 w-full '>
                          {company?.company_name}
                        </p>
                      </div>
                      <div className='flex flex-col xl:flex-row items-start xl:items-center mt-3.5'>
                        <p
                          className={classNames(
                            'first-letter:uppercase  text-base xl:text-lg  flex items-center',
                            company?.cwd_included === 0
                              ? 'text-[#B90000]'
                              : 'text-blueColor'
                          )}
                        >
                          <ProtectionIcon className='h-3.5 w-3.5' />
                          <span className='ml-2  text-base xl:text-lg '>
                            Insurance{' '}
                            {company?.cwd_included === 0
                              ? 'Excluded'
                              : 'Included'}{' '}
                          </span>
                        </p>

                        {/* Note: Right now hide this line of code as client request */}
                        {/* <div className='h-4 w-px mx-[14px] bg-slate-200 hidden xl:flex'></div> */}
                        {/* <p className='first-letter:uppercase text-sm text-[#585858]'>
                          Outside Pickup:{' '}
                          {company?.is_outside_hawana === 0 ? (
                            <span className='text-[#B90000]'>Not Allowed</span>
                          ) : (
                            <span className='text-[#25B900]'>Allowed</span>
                          )}
                        </p> */}
                      </div>
                    </div>
                    <div className='self-end xl:self-center text-end w-full max-w-[40%] xl:max-w-[30%] 2xl:max-w-[30%]'>
                      <Button size='sm' className=' xl:sm-base text-xs'>
                        View Cars
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className='side-container hidden xl:flex'></div>
      </div>
    </div>
  );
};

export default CarRental;
