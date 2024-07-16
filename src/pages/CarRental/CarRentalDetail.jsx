import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import { UserIcon, UserPlusIcon } from '@heroicons/react/20/solid';
import { useQuery } from '@tanstack/react-query';
import moment from 'moment';

import { Button, CommonModal, CustomSpinner } from '@/components/Common';
import ToggleSwitch from '@/components/Common/ToggleSwitch';
import api from '@/utils/api';
import { PAGE_TITLE_SUFFIX } from '@/utils/constants';
import { capitalize, getLocalStorageItem } from '@/utils/helper';
import { ReactComponent as CalendarIcon } from '@/assets/images/calendar.svg';
import { ReactComponent as CarAccidentIcon } from '@/assets/images/car-accident.svg';
import { ReactComponent as CarCategoryIcon } from '@/assets/images/car-category.svg';
import { ReactComponent as CurrencyIcon } from '@/assets/images/currency.svg';
import { ReactComponent as History } from '@/assets/images/history.svg';
import { ReactComponent as LuggageIcon } from '@/assets/images/luggage.svg';
import { ReactComponent as SolidCheckIcon } from '@/assets/images/solid-check.svg';
import { ReactComponent as SuitcaseIcon } from '@/assets/images/suitcase.svg';

import CarRentalPriceTable from './CarRentalPriceTable';
import OfficeLocations from './OfficeLocations';

const CarRentalDetail = () => {
  const { companyId } = useParams();

  const userData = getLocalStorageItem('userData')
    ? JSON.parse(getLocalStorageItem('userData'))
    : {};

  const [companyData, setCompanyData] = useState({});
  const [openHistoryModal, setOpenHistoryModal] = useState(false);
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

  const adminUrl = import.meta.env.VITE_APP_ADMIN_URL;

  return (
    <div className='flex flex-row'>
      <Helmet>
        <meta charSet='utf-8' />
        <title>Car Rental Detail {PAGE_TITLE_SUFFIX}</title>
      </Helmet>
      <div className='side-container'></div>
      <div className='main-container'>
        {(isLoading || isFetching) && (
          <div className='bg-white h-[calc(100vh-390px)] flex flex-col justify-center'>
            <CustomSpinner className='h-[50px] w-[40px] flex justify-center items-center'></CustomSpinner>
          </div>
        )}
        {!isLoading && !isFetching && (
          <>
            <div className='flex items-center justify-between'>
              <h1 className='text-3xl font-bold first-letter:uppercase'>
                {companyData?.company_name}
              </h1>
              <div>
                <div className='flex gap-2'>
                  <Button
                    isOutlined={true}
                    size='sm'
                    onClick={() => {
                      setOpenOfficeLocationModal(true);
                    }}
                  >
                    Office locations
                  </Button>
                  <Button
                    isOutlined={true}
                    size='sm'
                    onClick={() => {
                      setOpenDropOffModal(true);
                    }}
                  >
                    Dropoff fees
                  </Button>

                  {(userData?.role === 'admin' ||
                    userData?.role === 'staff') && (
                    <a
                      href={`${adminUrl}/car-rental/view/${companyId}`}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      <Button size='sm'>Backend</Button>
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className='mt-4'>
              <p className='flex items-center gap-3 text-sm'>
                <UserPlusIcon className='w-5 h-4 text-gray-400' />
                <span className='font-medium'>
                  {companyData?.second_driver_description}
                </span>
              </p>

              <p className='flex items-center gap-3 mt-3 text-sm'>
                <SolidCheckIcon className='w-5 h-3 text-gray-400' />
                <span className='font-medium'>{companyData?.km_included}</span>
              </p>

              <p className='flex items-center gap-3 mt-3 text-sm'>
                <CalendarIcon className='w-5 h-4 text-gray-400' />
                <span className='font-medium'>
                  {companyData?.minimum_rental_period}
                </span>
              </p>

              <p className='flex items-center gap-3 mt-3 text-sm'>
                <CarAccidentIcon className='w-5 h-4 text-gray-400' />
                <span className='font-medium'>
                  {companyData?.cwd_included
                    ? 'CDW insurance is included'
                    : 'CDW insurance is not included in the price and must be paid in advance. Total insurance costs will be added to the invoice.'}
                </span>
              </p>
            </div>

            <div className='mt-4'>
              <p className='bg-green-600 p-2 px-3 text-white text-sm rounded-md font-medium'>
                The price of the first day of the rental period is the price
                that is valid for the whole rental period. If you go from low
                season to high season, low season price will be valid the whole
                period. Other way around the same.
              </p>
            </div>

            {models?.length > 0 && companyData?.is_outside_hawana !== 0 && (
              <div className='mt-4 bg-white border shadow-md rounded-md p-4 flex items-center'>
                <p className='font-semibold'>
                  Currently displays prices for pickup{' '}
                  {toggle ? 'outside' : 'in'} Havana. Switch to{' '}
                  {toggle ? 'show' : 'display'} prices for pickup{' '}
                  {toggle ? 'in' : 'outside'} Havana.
                </p>
                <div className='ml-4'>
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
                      <p className='text-gray-600 font-semibold text-lg mr-2 first-letter:uppercase'>
                        {model?.model_name}
                      </p>
                    </div>

                    <div
                      className='flex items-center gap-2 border border-palette5 rounded-full px-2 cursor-pointer'
                      onClick={() => setOpenHistoryModal(true)}
                    >
                      <History className='h-4 w-4 text-palette5 font-bold hover:text-palette1' />
                      <span className='text-xs text-palette5 font-medium'>
                        Price history
                      </span>
                    </div>
                  </div>

                  <div className='mt-4 flex'>
                    <div className='max-w-[30%] flex-full'>
                      <div className='relative'>
                        <img
                          src={model?.model_photo}
                          alt='car-model'
                          className='w-[95%] object-cover min-h-[250px] max-h-[292px] rounded-md'
                        />
                        <div className='absolute left-0 z-[9] bottom-[10px]'>
                          <div className='flex items-center gap-x-5 text-sm mt-5 ml-2 font-medium'>
                            <div className='flex items-center tooltip bg-green-600 rounded-md p-1 px-2'>
                              <UserIcon className='w-5 h-5 text-white mr-1' />
                              <span className='text-white'>
                                {model?.persons}
                              </span>
                              <span className='tooltiptext'>
                                {model?.persons} adult passengers
                              </span>
                            </div>

                            <div className='flex items-center tooltip bg-green-600 rounded-md p-1 px-2'>
                              <LuggageIcon className='w-4 h-5 text-white mr-2' />
                              <span className='text-white'>
                                {model?.hand_luggage}
                              </span>
                              <span className='tooltiptext'>
                                {model?.hand_luggage} hand luggage
                              </span>
                            </div>

                            <div className='flex items-center tooltip bg-green-600 rounded-md p-1 px-2'>
                              <SuitcaseIcon className='w-5 h-5 text-white mr-1' />
                              <span className='text-white'>
                                {model?.suitcase}
                              </span>
                              <span className='tooltiptext'>
                                {model?.suitcase} suitcase
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className='text-sm'>
                        <p className='flex items-center gap-3 mt-3 text-xs'>
                          <CarCategoryIcon className='w-5 h-4 text-gray-400' />
                          <span className='font-medium'>
                            Category: {model?.category}
                          </span>
                        </p>

                        <p className='flex items-center gap-3 mt-3 text-xs'>
                          <CurrencyIcon className='w-5 h-4 text-gray-400' />
                          <span className='font-medium'>
                            Deposit: {model?.deposit} *
                          </span>
                        </p>

                        <p className='mt-3 text-xs'>
                          * to be paid locally in USD
                        </p>
                      </div>
                    </div>
                    <div className='flex-none'>
                      <CarRentalPriceTable model={model} />

                      {model?.description && (
                        <div className='mt-4'>
                          <p className='bg-green-600 p-2 px-3 text-white text-sm rounded-md font-semibold whitespace-pre'>
                            {model?.description}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <p className='text-xs text-gray-400 font-medium mt-4'>
                    Last price update:{' '}
                    {moment(model?.updated_at).format('DD-MM-YYYY')}
                  </p>

                  {openHistoryModal && (
                    <CommonModal
                      maxWidth='sm:max-w-2xl'
                      ModalHeader={`Pricing History: ${capitalize(model?.model_name)}`}
                      isOpen={openHistoryModal}
                      onClose={setOpenHistoryModal}
                      onSuccess={() => {}}
                      showActionBtn={false}
                    >
                      Pricing history
                      {/* <PricingHistory
              accommodationId={accommodationId}
              roomId={data?.id}
              accommodationData={accommodationData}
            /> */}
                    </CommonModal>
                  )}
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
      </div>
      <div className='side-container'></div>
    </div>
  );
};

export default CarRentalDetail;
