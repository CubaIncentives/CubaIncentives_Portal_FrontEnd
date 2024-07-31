import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import { UserIcon } from '@heroicons/react/20/solid';
import { useQuery } from '@tanstack/react-query';
import moment from 'moment';

import { Button, CommonModal, CustomSpinner } from '@/components/Common';
import Breadcrumbs from '@/components/Common/Breadcrumbs';
import ToggleSwitch from '@/components/Common/ToggleSwitch';
import api from '@/utils/api';
import { PAGE_TITLE_SUFFIX } from '@/utils/constants';
import {
  capitalize,
  getLocalStorageItem,
  redireacToAdminSite,
} from '@/utils/helper';
import { ReactComponent as CalendarIcon } from '@/assets/images/calendar.svg';
import { ReactComponent as CarAccidentIcon } from '@/assets/images/car-accident.svg';
import { ReactComponent as LuggageIcon } from '@/assets/images/luggage.svg';
import noImage from '@/assets/images/no-image.png';
import { ReactComponent as PersonIcon } from '@/assets/images/person.svg';
import { ReactComponent as SuitcaseIcon } from '@/assets/images/suitcase.svg';
import { ReactComponent as SwapIcon } from '@/assets/images/swap_calls.svg';

import CarRentalPriceTable from './CarRentalPriceTable';
import OfficeLocations from './OfficeLocations';
import PricingHistory from './PricingHistory';

const CarRentalDetail = () => {
  const { companyId } = useParams();

  const userData = getLocalStorageItem('userData')
    ? JSON.parse(getLocalStorageItem('userData'))
    : {};

  const [companyData, setCompanyData] = useState({});
  const [openHistoryModal, setOpenHistoryModal] = useState(false);
  const [priceHistoryData, setPriceHistoryData] = useState(null);
  const [openDropOffModal, setOpenDropOffModal] = useState(false);
  const [openOfficeLocationModal, setOpenOfficeLocationModal] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [models, setModels] = useState([]);

  const getCompanyData = async (id) => {
    const res = await api.get(`/car-rental/company/${id}`);

    return res.data;
  };

  const { isLoading, isFetching } = useQuery(
    ['get-company-data', companyId],
    () => getCompanyData(companyId),
    {
      enabled: !!companyId,
      onSuccess: (data) => {
        const response = data?.data;

        setCompanyData(response);
      },
    }
  );

  const getModelsData = async (id) => {
    const res = await api.get(
      `car-rental/company/${id}/model?is_outside_hawana=${toggle ? 1 : 0}`
    );

    return res.data;
  };

  const { isLoading: isModalLoading, isFetching: isModalFetching } = useQuery(
    ['get-modal-data', companyId, toggle],
    () => getModelsData(companyId),
    {
      enabled: !!companyId,
      onSuccess: (data) => {
        const response = data?.data;

        setModels(response);
      },
    }
  );

  const pages = [
    { name: 'Car Rental', href: '/car-rental', current: false },
    { name: companyData?.company_name ?? '', href: '', current: true },
  ];

  return (
    <div className='px-6 flex justify-center sm:px-8 lg:px-10 py-6'>
      <div className='max-w-[1920px] w-full'>
        <Helmet>
          <meta charSet='utf-8' />
          <title>Car Rental Detail {PAGE_TITLE_SUFFIX}</title>
        </Helmet>

        {(isLoading || isFetching) && (
          <div className='bg-white h-[calc(100vh-390px)] flex flex-col justify-center'>
            <CustomSpinner className='h-[50px] w-[40px] flex justify-center items-center'></CustomSpinner>
          </div>
        )}
        {!isLoading && !isFetching && (
          <>
            <div className='pb-10'>
              <Breadcrumbs pages={pages} />
            </div>
            <div className='flex items-center justify-between w-full'>
              <h1 className='2xl:text-3xl xl:text-xl text-lg font-bold first-letter:uppercase 2xl:max-w-[90%] xl:max-w-[70%] lg:max-w-[60%] md:max-w-[50%]'>
                {companyData?.company_name}
              </h1>
              <div>
                <div className='flex gap-2'>
                  <Button
                    size='sm'
                    onClick={() => {
                      setOpenOfficeLocationModal(true);
                    }}
                  >
                    Office Locations
                  </Button>
                  <Button
                    size='sm'
                    onClick={() => {
                      setOpenDropOffModal(true);
                    }}
                  >
                    Drop-off Fees
                  </Button>

                  {(userData?.role === 'admin' ||
                    userData?.role === 'staff') && (
                    <Button
                      size='sm'
                      isOutlined={true}
                      onClick={() => {
                        redireacToAdminSite(`car-rental/view/${companyId}`);
                      }}
                    >
                      Backend
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className='mt-6 flex border-[#E4E5E8] gap-6'>
              <img
                src={companyData?.company_logo}
                alt={companyData?.company_name}
                onError={(e) => {
                  e.target.src = noImage;
                }}
                className='w-full h-screen max-w-[400px] max-h-[280px] rounded-md'
              />

              <div>
                <p className='flex items-center gap-3 text-sm'>
                  <PersonIcon className='w-5 h-3.5 text-customBlack' />
                  <span className='font-medium text-[#585858]'>
                    {companyData?.second_driver_description}
                  </span>
                </p>

                <p className='flex items-center gap-3 mt-3 text-sm'>
                  <SwapIcon className='w-5 h-3 text-customBlack' />
                  <span className='font-medium text-[#585858]'>
                    {companyData?.km_included}
                  </span>
                </p>

                <p className='flex items-center gap-3 mt-3 text-sm'>
                  <CalendarIcon className='w-5 h-4 text-customBlack' />
                  <span className='font-medium text-[#585858]'>
                    {companyData?.minimum_rental_period}
                  </span>
                </p>

                <p className='flex items-center gap-3 mt-3 text-sm'>
                  <CarAccidentIcon className='w-5 h-4 text-customBlack' />
                  <span className='font-medium text-[#585858]'>
                    {companyData?.cwd_included
                      ? 'CDW insurance is included'
                      : 'CDW insurance is not included in the price and must be paid in advance. Total insurance costs will be added to the invoice.'}
                  </span>
                </p>

                <div className='mt-6 flex gap-4'>
                  <p className='bg-red-100 border border-red-300 p-2.5 px-3.5 text-customBlack text-sm rounded-md font-medium italic'>
                    The price of the first day of the rental period is the price
                    that is valid for the whole rental period. If you go from
                    low season to high season, low season price will be valid
                    the whole period. Other way around the same.
                  </p>

                  <p className='bg-[#FFF9E5] border border-secondaryColor p-2.5 px-3.5 text-customBlack text-sm rounded-md font-medium italic'>
                    The price of the first day of the rental period is the price
                    that is valid for the whole rental period. If you go from
                    low season to high season, low season price will be valid
                    the whole period. Other way around the same.
                  </p>
                </div>
              </div>
            </div>

            {models?.length > 0 && companyData?.is_outside_hawana !== 0 && (
              <div className='mt-4 bg-[#FAFAFA] border shadow-md rounded-md p-4 flex items-center justify-center'>
                <div>
                  <p className='font-semibold text-customBlack text-center'>
                    Currently displays prices for pickup{' '}
                    {toggle ? 'outside' : 'in'} Havana. Switch to{' '}
                    {toggle ? 'show' : 'display'} prices for pickup{' '}
                    {toggle ? 'in' : 'outside'} Havana.
                  </p>
                </div>
                <div className='ml-4 flex justify-center items-center'>
                  <ToggleSwitch
                    handleToggleChange={setToggle}
                    toggleValue={toggle}
                    disabled={isModalFetching || isModalLoading}
                  />
                </div>
              </div>
            )}

            {!isModalLoading &&
              !isModalFetching &&
              models?.length > 0 &&
              models?.map((model) => (
                <div
                  className='mt-4 bg-white border shadow-md rounded-md p-4'
                  key={model?.id}
                >
                  <div className='flex justify-between'>
                    <div className='flex items-center'>
                      <p className='text-customBlack font-semibold text-lg mr-2 first-letter:uppercase'>
                        {model?.model_name}{' '}
                        <span className='text-[#787878]'>
                          ({model?.model_code})
                        </span>
                      </p>
                    </div>

                    <div className='flex items-center gap-4'>
                      <p className='text-xs text-gray-400 font-medium'>
                        <span className='text-[#787878]'>
                          Last price update:{' '}
                        </span>
                        <span className='text-customBlack'>
                          {moment(model?.updated_at).format('DD-MM-YYYY')}
                        </span>
                      </p>
                      <p
                        className='cursor-pointer text-xs text-customBlue text-gradient font-semibold'
                        onClick={() => {
                          setOpenHistoryModal(true);
                          setPriceHistoryData({
                            title: capitalize(model?.model_name),
                            id: model?.id,
                          });
                        }}
                      >
                        Price History
                      </p>
                    </div>
                  </div>

                  <div className='mt-4 flex xl:flex-nowrap lg:flex-wrap xl:gap-[30px] gap-6'>
                    <div className='flex flex-col w-full xl:max-w-max  lg:max-w-[30%] min-w-[360px]'>
                      <div className='relative border border-[#E4E5E8] rounded-md w-full max-w-[360px] max-h-[255px] '>
                        <img
                          src={model?.model_photo}
                          alt={model?.model_name}
                          onError={(e) => {
                            e.target.src = noImage;
                          }}
                          className='object-cover rounded-md w-full h-screen max-h-[250px] '
                        />
                      </div>
                      <div className='text-sm'>
                        <div>
                          <div className='flex items-center gap-x-5 text-sm mt-5 ml-2 font-medium'>
                            <div className='flex items-center tooltip rounded-md p-1 px-2 border'>
                              <UserIcon className='w-4 h-4 text-customBlack mr-1' />
                              <span className='text-blueColor font-medium'>
                                {model?.persons}
                              </span>
                              <span className='tooltiptext'>
                                {model?.persons} adult passengers
                              </span>
                            </div>

                            <div className='flex items-center tooltip rounded-md p-1 px-2 border'>
                              <LuggageIcon className='w-3 h-4 text-customBlack mr-2' />
                              <span className='text-blueColor font-medium'>
                                {model?.hand_luggage}
                              </span>
                              <span className='tooltiptext'>
                                {model?.hand_luggage} hand luggage
                              </span>
                            </div>

                            <div className='flex items-center tooltip rounded-md p-1 px-2 border'>
                              <SuitcaseIcon className='w-4 h-4 text-customBlack mr-1' />
                              <span className='text-blueColor font-medium'>
                                {model?.suitcase}
                              </span>
                              <span className='tooltiptext'>
                                {model?.suitcase} suitcase
                              </span>
                            </div>
                          </div>
                        </div>

                        <p className='flex items-center gap-3 mt-3 text-xs'>
                          <span className='font-medium'>
                            <span className='text-[#585858]'>Category:</span>{' '}
                            <span className='text-blueColor'>
                              {model?.category}
                            </span>
                          </span>
                        </p>

                        <p className='flex items-center gap-3 mt-3 text-xs'>
                          <span className='font-medium'>
                            <span className='text-[#585858]'>
                              Transmission:
                            </span>{' '}
                            <span className='text-blueColor'>
                              {model?.transmission === '1'
                                ? 'Automatic'
                                : 'Manual'}
                            </span>
                          </span>
                        </p>

                        <p className='flex items-center gap-3 mt-3 text-xs'>
                          <span className='font-medium'>
                            <span className='text-[#585858]'>Deposit:</span>{' '}
                            <span className='text-blueColor'>
                              {model?.deposit} *
                            </span>
                            <span className='text-[#FF8D8D]'>
                              {' '}
                              (to be paid locally in USD)
                            </span>
                          </span>
                        </p>

                        <p className='mt-3 text-xs'></p>
                      </div>
                    </div>

                    <div className='flex-none xl:max-w-full w-full  lg:max-w-[70%]'>
                      <CarRentalPriceTable model={model} />

                      <hr className='my-4' />
                      {model?.description && (
                        <div className='-mt-1'>
                          <p className='mb-2.5 text-[#B90000] font-semibold'>
                            Notes:
                          </p>
                          <div className=' max-h-[250px] overflow-auto'>
                            <p className='text-customBlack text-sm whitespace-pre pl-2 break-words text-wrap'>
                              {model?.description}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

            <p className='mt-4 text-sm'>
              <strong>{capitalize(companyData?.company_name)}</strong> reserves
              the right to change car models and categories when renewing their
              fleet
            </p>
          </>
        )}

        {openDropOffModal && (
          <CommonModal
            maxWidth='sm:max-w-2xl'
            ModalHeader={`Dropoff Fees: ${capitalize(companyData?.company_name)}`}
            isOpen={openDropOffModal}
            onClose={setOpenDropOffModal}
            onSuccess={() => {}}
            showActionBtn={false}
          >
            {companyData?.dropoffFees ? (
              <div
                className='break-words max-h-[500px] overflow-auto'
                dangerouslySetInnerHTML={{
                  __html: companyData?.dropoffFees,
                }}
              ></div>
            ) : (
              <p>Dropoff fees not available</p>
            )}
          </CommonModal>
        )}

        {openOfficeLocationModal && (
          <CommonModal
            maxWidth='sm:max-w-3xl'
            ModalHeader={`Office Locations: ${capitalize(companyData?.company_name)}`}
            isOpen={openOfficeLocationModal}
            onClose={setOpenOfficeLocationModal}
            onSuccess={() => {}}
            showActionBtn={false}
          >
            <OfficeLocations companyId={companyId} />
          </CommonModal>
        )}

        {openHistoryModal && (
          <CommonModal
            maxWidth='max-w-5xl'
            ModalHeader={`Pricing History: ${priceHistoryData?.title ?? ''}`}
            isOpen={openHistoryModal}
            onClose={() => {
              setOpenHistoryModal(false);
              setPriceHistoryData(null);
            }}
            onSuccess={() => {}}
            showActionBtn={false}
          >
            <PricingHistory roomId={priceHistoryData?.id} />
          </CommonModal>
        )}
      </div>
    </div>
  );
};

export default CarRentalDetail;
