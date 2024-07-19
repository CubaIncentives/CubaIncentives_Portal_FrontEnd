import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import Slider from 'react-slick';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { useQuery } from '@tanstack/react-query';
import moment from 'moment';
import validator from 'validator';

import { Badge, Button, CommonModal, CustomSpinner } from '@/components/Common';
import DetailComponent from '@/components/Common/DetailComponent';
import api from '@/utils/api';
import { CURRENCY, PAGE_TITLE_SUFFIX } from '@/utils/constants';
import { classNames, getLocalStorageItem } from '@/utils/helper';

const ExcursionDetail = () => {
  const maxChars = 350;
  const { excursionId } = useParams();

  const userData = getLocalStorageItem('userData')
    ? JSON.parse(getLocalStorageItem('userData'))
    : {};

  const modalSliderRef = useRef(null);
  const outSliderRef = useRef(null);

  const [excursionData, setExcursionData] = useState({});
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [openImageModal, setOpenImageModal] = useState(false);
  const [openDescModal, setOpenDescModal] = useState(false);
  const [accDesc, setAccDesc] = useState('');
  const [prices, setPrices] = useState([]);
  const [isValidCoordinates, setIsValidCoordinates] = useState(false);

  const getExcursionData = async (id) => {
    const res = await api.get(`/excursion/agency/${id}`);

    return res.data;
  };

  const { isLoading } = useQuery(
    ['get-excursion-data', excursionId],
    () => getExcursionData(excursionId),
    {
      enabled: !!excursionId,
      onSuccess: (data) => {
        const response = data?.data;

        setExcursionData(response?.excursion);

        if (response?.price_dates?.length > 0) {
          setPrices(response?.price_dates);
        } else {
          setPrices([]);
        }
      },
    }
  );

  useEffect(() => {
    if (excursionData?.description) {
      const plainText = excursionData?.description?.replace(/<[^>]+>/g, '');
      const displayedText =
        excursionData?.description?.length < maxChars
          ? excursionData?.description
          : plainText?.slice(0, maxChars) + '...';

      setAccDesc(displayedText || '');
    }
  }, [excursionData?.description]);

  useEffect(() => {
    if (modalSliderRef.current && openImageModal) {
      modalSliderRef.current.slickGoTo(currentSlide);

      if (outSliderRef.current) {
        outSliderRef.current.slickGoTo(currentSlide);
      }
    }
  }, [currentSlide, openImageModal]);

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        setSelectedImage(null);
        setOpenImageModal(false);
      }
    };

    if (openImageModal) {
      window.addEventListener('keydown', handleEsc);
    } else {
      window.removeEventListener('keydown', handleEsc);
    }

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [openImageModal]);

  useEffect(() => {
    const coordinates = `${excursionData?.latitude},${excursionData?.longitude}`;

    if (validator.isLatLong(coordinates)) {
      setIsValidCoordinates(true);
    } else {
      setIsValidCoordinates(false);
    }
  }, [excursionData?.latitude, excursionData?.longitude]);

  var settings = {
    dots: false,
    lazyLoad: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    beforeChange: (oldIndex, newIndex) => setCurrentSlide(newIndex),
  };

  const googleMapsUrl = `https://www.google.com/maps?q=${excursionData?.latitude},${excursionData?.longitude}`;
  const adminUrl = import.meta.env.VITE_APP_ADMIN_URL;

  return (
    <div className='px-6 sm:px-8 lg:px-10 py-6'>
      <Helmet>
        <meta charSet='utf-8' />
        <title>Excursion Detail {PAGE_TITLE_SUFFIX}</title>
      </Helmet>

      {isLoading && (
        <div className='bg-white h-[calc(100vh-390px)] flex flex-col justify-center'>
          <CustomSpinner className='h-[50px] w-[40px] flex justify-center items-center'></CustomSpinner>
        </div>
      )}

      {!isLoading && (
        <div className='mt-8'>
          <div className='bg-white p-4 mb-4'>
            <div className='flex justify-between'>
              <div className='flex gap-4'>
                {excursionData?.images?.length > 1 ? (
                  <div className='w-[200px]'>
                    <Slider ref={outSliderRef} {...settings}>
                      {excursionData?.images?.map((item) => (
                        <img
                          key={item?.id}
                          id='myImg'
                          src={item?.image_path}
                          alt='excursion'
                          className='h-32 rounded-lg object-cover object-center'
                          onClick={() => {
                            setSelectedImage(item?.image_path);
                            setOpenImageModal(true);
                          }}
                        />
                      ))}
                    </Slider>
                  </div>
                ) : (
                  <img
                    src={
                      excursionData?.images?.length > 0
                        ? excursionData?.images[0]?.image_path
                        : ''
                    }
                    alt='excursion'
                    className='h-32 min-w-[200px] rounded-lg object-cover object-center cursor-pointer hover:opacity-70'
                    onClick={() => {
                      setSelectedImage(excursionData?.images[0]?.image_path);
                      setOpenImageModal(true);
                    }}
                  />
                )}

                <div>
                  <p className='text-xl font-semibold first-letter:uppercase'>
                    {excursionData?.excursion_name}
                  </p>

                  <div
                    className='pr-4 text-sm mt-2'
                    dangerouslySetInnerHTML={{
                      __html: accDesc,
                    }}
                  ></div>

                  {excursionData?.description?.length > maxChars && (
                    <button
                      onClick={() => setOpenDescModal(true)}
                      className='text-palette8 hover:text-palette4 font-medium text-sm'
                    >
                      Show more
                    </button>
                  )}
                </div>
              </div>

              <div>
                <div className='flex gap-2'>
                  {isValidCoordinates && (
                    <a
                      href={googleMapsUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      <Button size='sm'>Map</Button>
                    </a>
                  )}

                  {(userData?.role === 'admin' ||
                    userData?.role === 'staff') && (
                    <a
                      href={`${adminUrl}/excursion/view/${excursionId}`}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      <Button size='sm' isOutlined={true}>
                        Backend
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className='mt-4'>
              <div className='grid grid-cols-4 gap-4'>
                <div>
                  <DetailComponent
                    label='Location'
                    value={excursionData?.location}
                  />

                  <DetailComponent label='City' value={excursionData?.city} />
                </div>
                <div>
                  <DetailComponent
                    label='Min. person'
                    value={excursionData?.minimum_persons}
                  />

                  <DetailComponent
                    label='Max. person'
                    value={excursionData?.maximum_persons}
                  />

                  <DetailComponent
                    label='Distance'
                    value={excursionData?.distance}
                  />
                </div>
                <div>
                  <DetailComponent
                    label='Start time'
                    value={excursionData?.start_time}
                  />

                  <DetailComponent
                    label='Difficulty'
                    value={excursionData?.difficulty}
                  />

                  <DetailComponent
                    label='Duration'
                    value={excursionData?.duration}
                  />
                </div>
                <div>
                  <DetailComponent
                    label='Latitude'
                    value={excursionData?.latitude}
                  />

                  <DetailComponent
                    label='Longitude'
                    value={excursionData?.longitude}
                  />
                </div>
              </div>

              <div className='mt-4 flex'>
                <p className='first-letter:uppercase font-medium text-base min-w-[91px]'>
                  Included
                </p>
                &nbsp;:&nbsp;
                <div className='first-letter:uppercase text-gray-500 flex flex-wrap gap-2 mt-0.5'>
                  {excursionData?.included?.map((key) => {
                    return (
                      <Badge
                        key={key}
                        size='sm'
                        className={classNames(
                          'capitalize bg-green-50 font-medium text-green-700 ring-1 ring-inset ring-green-700/10'
                        )}
                      >
                        {key}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {prices?.length > 0 && (
            <div className='bg-white p-4 pt-0 mb-8'>
              {prices?.length > 0 && (
                <div className='border rounded-md'>
                  <table className='w-full price-table'>
                    <tbody>
                      <tr className='border-b'>
                        <td className='px-4 py-3 max-w-[20%]'></td>
                        <td className='px-4 py-3 font-medium text-sm text-gray-700 max-w-[15%]'>
                          Price per person
                        </td>
                        <td className='px-4 py-3 font-medium text-sm text-gray-700 max-w-[8%]'>
                          1 pax
                        </td>
                        <td className='px-4 py-3 font-medium text-sm text-gray-700 max-w-[8%]'>
                          2 pax
                        </td>
                        <td className='px-4 py-3 font-medium text-sm text-gray-700 max-w-[8%]'>
                          3 pax
                        </td>
                        <td className='px-4 py-3 font-medium text-sm text-gray-700 max-w-[8%]'>
                          4 pax
                        </td>
                        <td className='px-4 py-3 font-medium text-sm text-gray-700 max-w-[8%]'>
                          5 pax
                        </td>
                        <td className='px-4 py-3 font-medium text-sm text-gray-700 max-w-[8%]'>
                          6 pax
                        </td>
                        <td className='px-4 py-3 font-medium text-sm text-gray-700 max-w-[8%]'>
                          7 pax
                        </td>
                        <td className='px-4 py-3 font-medium text-sm text-gray-700 max-w-[8%]'>
                          8 pax
                        </td>
                      </tr>

                      {prices?.map((price, index) => (
                        <tr
                          className='align-baseline border-b last:border-0'
                          key={index}
                        >
                          <td className='px-4 py-3 flex items-center max-w-[20%] text-base'>
                            {moment(price?.date_plan?.from_date).format(
                              'DD-MM-YYYY'
                            )}{' '}
                            <ArrowRightIcon className='h-5 w-5 mx-2 text-gray-400' />{' '}
                            {moment(price?.date_plan?.to_date).format(
                              'DD-MM-YYYY'
                            )}
                          </td>

                          <td className='px-4 py-3 max-w-[15%]'>
                            {price?.price_per_person ? (
                              <span className='text-customBlue font-semibold group-hover:font-extrabold'>
                                {CURRENCY} {price?.price_per_person}
                              </span>
                            ) : (
                              'N/A'
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* {AddonListMutation?.data?.data?.length > 0 && (
                  <div className='mb-8'>
                    <p className='font-semibold text-lg'>Add-ons</p>
                    <div className='my-4 flex gap-4 flex-wrap'>
                      {AddonListMutation?.data?.data?.map((data, index) => (
                        <ExcursionAddonCard
                          key={index}
                          data={data}
                          deleteHandler={deleteHandler}
                          setOpenAddonModal={setOpenAddonModal}
                          setSelectedData={setSelectedData}
                        />
                      ))}
                    </div>
                  </div>
                )} */}
        </div>
      )}

      {openDescModal && (
        <CommonModal
          maxWidth='sm:max-w-xl'
          ModalHeader={`${excursionData?.excursion_name} - Description`}
          isOpen={openDescModal}
          onClose={setOpenDescModal}
          onSuccess={() => {}}
          showActionBtn={false}
        >
          <div className='max-modal-height overflow-auto pr-2'>
            <div
              className='first-letter:uppercase text-gray-500'
              dangerouslySetInnerHTML={{
                __html: excursionData?.description,
              }}
            ></div>
          </div>
        </CommonModal>
      )}

      {openImageModal && (
        <div id='myModal' className='modal popupModal'>
          <span className='close' onClick={() => setOpenImageModal(false)}>
            &times;
          </span>
          {excursionData?.images?.length > 1 ? (
            <Slider ref={modalSliderRef} {...settings}>
              {excursionData?.images?.map((item) => (
                <div className='text-center' key={item?.id}>
                  <img
                    id='myImg'
                    src={item?.image_path}
                    alt='excursion'
                    className='modal-content !cursor-default !opacity-100'
                  />
                </div>
              ))}
            </Slider>
          ) : (
            <img
              src={selectedImage}
              alt='excursion'
              className='modal-content'
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ExcursionDetail;
