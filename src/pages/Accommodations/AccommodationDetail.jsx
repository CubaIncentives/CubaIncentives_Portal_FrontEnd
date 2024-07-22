import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import Slider from 'react-slick';
import { ArrowRightIcon, StarIcon } from '@heroicons/react/20/solid';
import { useQuery } from '@tanstack/react-query';
import moment from 'moment';
import validator from 'validator';

import { Badge, Button, CommonModal, CustomSpinner } from '@/components/Common';
import DetailComponent from '@/components/Common/DetailComponent';
import api from '@/utils/api';
import { CURRENCY, PAGE_TITLE_SUFFIX, PHONE_CODE } from '@/utils/constants';
import {
  capitalize,
  classNames,
  getLocalStorageItem,
  redireacToAdminSite,
} from '@/utils/helper';

import AccommodationRoomsList from './AccommodationRoomsList';

const AccommodationDetail = () => {
  const maxChars = 350;
  const { accommodationId } = useParams();

  const userData = getLocalStorageItem('userData')
    ? JSON.parse(getLocalStorageItem('userData'))
    : {};

  const modalSliderRef = useRef(null);
  const outSliderRef = useRef(null);

  const [accommodationData, setAccommodationData] = useState({});
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [openImageModal, setOpenImageModal] = useState(false);
  const [openPolicyModal, setOpenPolicyModal] = useState(false);
  const [openDescModal, setOpenDescModal] = useState(false);
  const [accDesc, setAccDesc] = useState('');
  const [isValidCoordinates, setIsValidCoordinates] = useState(false);

  const getAccommodationData = async (id) => {
    const res = await api.get(`/accommodation/agency/${id}`);

    return res.data;
  };

  const { isLoading } = useQuery(
    ['get-accommodation-data', accommodationId],
    () => getAccommodationData(accommodationId),
    {
      enabled: !!accommodationId,
      onSuccess: (data) => {
        setAccommodationData(data?.data);
      },
    }
  );

  useEffect(() => {
    if (accommodationData?.description) {
      const plainText = accommodationData?.description?.replace(/<[^>]+>/g, '');
      const displayedText =
        accommodationData?.description?.length < maxChars
          ? accommodationData?.description
          : plainText?.slice(0, maxChars) + '...';

      setAccDesc(displayedText || '');
    }
  }, [accommodationData?.description]);

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
    const coordinates = `${accommodationData?.latitude},${accommodationData?.longitude}`;

    if (validator.isLatLong(coordinates)) {
      setIsValidCoordinates(true);
    } else {
      setIsValidCoordinates(false);
    }
  }, [accommodationData?.latitude, accommodationData?.longitude]);

  var settings = {
    dots: false,
    lazyLoad: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    beforeChange: (oldIndex, newIndex) => setCurrentSlide(newIndex),
  };

  const googleMapsUrl = `https://www.google.com/maps?q=${accommodationData?.latitude},${accommodationData?.longitude}`;

  return (
    <div className='px-6 sm:px-8 lg:px-10 py-6'>
      <Helmet>
        <meta charSet='utf-8' />
        <title>Accommodation Detail {PAGE_TITLE_SUFFIX}</title>
      </Helmet>
      {isLoading && (
        <div className='bg-white h-[calc(100vh-390px)] flex flex-col justify-center'>
          <CustomSpinner className='h-[50px] w-[40px] flex justify-center items-center'></CustomSpinner>
        </div>
      )}

      {!isLoading && (
        <div className='mb-4'>
          <div className='bg-white p-4 mb-4'>
            <div className='flex justify-between gap-2'>
              <div className='flex gap-4'>
                {accommodationData?.images?.length > 1 ? (
                  <div className='w-[200px]'>
                    <Slider ref={outSliderRef} {...settings}>
                      {accommodationData?.images?.map((item) => (
                        <img
                          key={item?.id}
                          id='myImg'
                          src={item?.image_path}
                          alt='accommodation'
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
                      accommodationData?.images?.length > 0
                        ? accommodationData?.images[0]?.image_path
                        : ''
                    }
                    alt='accommodation'
                    className='h-32 min-w-[200px] rounded-lg object-cover object-center cursor-pointer hover:opacity-70'
                    onClick={() => {
                      setSelectedImage(
                        accommodationData?.images[0]?.image_path
                      );
                      setOpenImageModal(true);
                    }}
                  />
                )}

                <div>
                  <div className='flex items-center gap-2'>
                    <div className='flex gap-2'>
                      <p className='text-xl font-semibold first-letter:uppercase'>
                        {accommodationData?.name}{' '}
                      </p>

                      <div className='mt-1'>
                        <Badge
                          size='sm'
                          className={classNames(
                            'bg-white capitalize',
                            accommodationData?.type === 'casa'
                              ? 'bg-blue-50 font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10'
                              : 'bg-purple-50 font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10'
                          )}
                        >
                          {capitalize(accommodationData?.type)}
                        </Badge>
                      </div>
                    </div>

                    <div className='self-start'>
                      <div className='flex'>
                        {[...Array(5)].map((_, index) => (
                          <StarIcon
                            key={index}
                            className={
                              index < accommodationData?.star_rating
                                ? 'text-yellow-500'
                                : 'text-gray-300'
                            }
                            aria-hidden='true'
                            width={24}
                            height={24}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {accommodationData?.type === 'casa' && (
                    <p className='text-base font-medium lowercase flex items-center my-1'>
                      <span className='first-letter:uppercase'>
                        {accommodationData?.parent_accommodation?.id !== 0
                          ? accommodationData?.parent_accommodation?.name
                          : 'Parent casa'}
                      </span>
                      {accommodationData?.parent_accommodation?.id !== 0 && (
                        <span className='ml-1 font-normal text-sm text-gray-500 first-letter:uppercase'>{`(Parent)`}</span>
                      )}
                    </p>
                  )}

                  <div
                    dangerouslySetInnerHTML={{
                      __html: accDesc,
                    }}
                  ></div>

                  {accommodationData?.description?.length > maxChars && (
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
                    <Button
                      size='sm'
                      isOutlined={true}
                      onClick={() => {
                        redireacToAdminSite(
                          `accommodation/view/${accommodationId}`
                        );
                      }}
                    >
                      Backend
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className='mt-4'>
              <div className='grid grid-cols-4 gap-4'>
                <div>
                  <DetailComponent
                    noCenter={true}
                    label='Address'
                    value={accommodationData?.address}
                  />

                  <DetailComponent
                    label='Location'
                    value={accommodationData?.location}
                  />

                  <DetailComponent
                    label='City'
                    value={accommodationData?.city}
                  />
                </div>

                <div>
                  <DetailComponent
                    label='Contact'
                    value={
                      PHONE_CODE +
                      ' ' +
                      (accommodationData?.contact
                        ? accommodationData?.contact
                        : '')
                    }
                  />

                  <DetailComponent
                    label='Meal plan'
                    value={capitalize(accommodationData?.meal_plan_type)}
                  />

                  <DetailComponent
                    label='Last date'
                    value={
                      accommodationData?.last_date
                        ? moment(accommodationData?.last_date).format(
                            'DD-MM-YYYY'
                          )
                        : ''
                    }
                  />
                </div>

                <div>
                  <DetailComponent
                    label='Latitude'
                    value={accommodationData?.latitude}
                  />

                  <DetailComponent
                    label='Longitude'
                    value={accommodationData?.longitude}
                  />
                </div>

                <div className='mt-2'>
                  <p
                    className='font-medium text-base min-w-[75px] cursor-pointer text-palette8 hover:text-palette4'
                    onClick={() => setOpenPolicyModal(true)}
                  >
                    Policy
                  </p>
                </div>
              </div>

              <div className='mt-4 flex'>
                <p className='first-letter:uppercase font-medium text-base min-w-[91px]'>
                  Amenities
                </p>
                &nbsp;:&nbsp;
                <div className='first-letter:uppercase text-gray-500 flex flex-wrap gap-2 mt-0.5'>
                  {accommodationData?.amenities_list?.map((amenityKey) => {
                    return (
                      <Badge
                        key={amenityKey}
                        size='sm'
                        className={classNames(
                          'capitalize bg-green-50 font-medium text-green-700 ring-1 ring-inset ring-green-700/10'
                        )}
                      >
                        {amenityKey}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {accommodationData?.rooms?.map((data, index) => (
            <AccommodationRoomsList
              key={index}
              data={data}
              accommodationId={accommodationId}
              accommodationData={accommodationData}
            />
          ))}

          {accommodationData?.supplements?.length > 0 && (
            <div className='bg-white p-4 mb-8 border rounded-md shadow-md'>
              <p className='text-gray-600 font-semibold text-lg mr-2 first-letter:uppercase'>
                Supplements
              </p>

              <div className='mt-4'>
                <table className='w-full price-table'>
                  <tbody>
                    {accommodationData?.supplements?.map((supplement) => (
                      <tr
                        key={supplement?.id}
                        className='border-b last:border-0'
                      >
                        <td className='max-w-[40%] p-[12px]'>
                          {supplement?.information}
                        </td>
                        <td className='p-[12px]'>
                          {CURRENCY} {supplement?.price}{' '}
                          {supplement?.price_type === 'per_room'
                            ? 'Per room'
                            : 'Per person'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {accommodationData?.childpolicy?.length > 0 && (
            <div className='bg-white p-4 mb-8 border rounded-md shadow-md'>
              <p className='text-gray-600 font-semibold text-lg mr-2 first-letter:uppercase'>
                Child policy
              </p>
              <div className='mt-4'>
                <table className='w-full price-table'>
                  <tbody>
                    {accommodationData?.childpolicy?.map((policy) => (
                      <tr key={policy?.id} className='border-b last:border-0'>
                        <td className='max-w-[15%] p-[12px] flex items-center'>
                          {policy?.min_age}{' '}
                          <ArrowRightIcon className='h-5 w-5 mx-1 text-gray-400' />{' '}
                          {policy?.max_age} year
                        </td>
                        <td className='max-w-[15%] p-[12px]'>
                          {policy?.discount === '0'
                            ? 'Free'
                            : policy?.discount === 'n/a'
                              ? 'No discount'
                              : policy?.discount + '% discount'}
                        </td>
                        <td className='p-[12px]'>
                          {policy?.additional_discount_information}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {openImageModal && (
        <div id='myModal' className='modal popupModal'>
          <span className='close' onClick={() => setOpenImageModal(false)}>
            &times;
          </span>
          {accommodationData?.images?.length > 1 ? (
            <Slider ref={modalSliderRef} {...settings}>
              {accommodationData?.images?.map((item) => (
                <div className='text-center' key={item?.id}>
                  <img
                    id='myImg'
                    src={item?.image_path}
                    alt='accommodation'
                    className='modal-content !cursor-default !opacity-100'
                  />
                </div>
              ))}
            </Slider>
          ) : (
            <img
              src={selectedImage}
              alt='accommodation'
              className='modal-content'
            />
          )}
        </div>
      )}

      {openDescModal && (
        <CommonModal
          maxWidth='sm:max-w-xl'
          ModalHeader={`${accommodationData?.name} - Description`}
          isOpen={openDescModal}
          onClose={setOpenDescModal}
          onSuccess={() => {}}
          showActionBtn={false}
        >
          <div className='max-modal-height overflow-auto pr-2'>
            <div
              className='first-letter:uppercase text-gray-500'
              dangerouslySetInnerHTML={{
                __html: accommodationData?.description,
              }}
            ></div>
          </div>
        </CommonModal>
      )}

      {openPolicyModal && (
        <CommonModal
          maxWidth='sm:max-w-lg'
          ModalHeader={`${accommodationData?.name} - Policy`}
          isOpen={openPolicyModal}
          onClose={setOpenPolicyModal}
          onSuccess={() => {}}
          showActionBtn={false}
        >
          <div className='max-modal-height overflow-auto pr-2'>
            {accommodationData?.policy_info ? (
              <div
                className='first-letter:uppercase text-gray-500'
                dangerouslySetInnerHTML={{
                  __html: accommodationData?.policy_info,
                }}
              ></div>
            ) : (
              'No policy information'
            )}
          </div>
        </CommonModal>
      )}
    </div>
  );
};

export default AccommodationDetail;
