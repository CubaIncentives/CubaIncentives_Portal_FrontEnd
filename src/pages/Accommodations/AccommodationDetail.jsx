import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Slider from 'react-slick';
import DetailPageSkeleton from '@/skeletons/DetailPageSkeleton';
import { ArrowRightIcon, CheckIcon, StarIcon } from '@heroicons/react/20/solid';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import moment from 'moment';
import validator from 'validator';

import { useWindowSize } from '@/hooks/useWindowSize';
import { Badge, Button, CommonModal } from '@/components/Common';
import Breadcrumbs from '@/components/Common/Breadcrumbs';
import DetailComponent from '@/components/Common/DetailComponent';
import ImageSlider from '@/components/Modal/ImageSlider';
import Map from '@/components/Modal/Map';
import NotificationList from '@/components/Notification/NotificationList';
import NotificationListModal from '@/components/Notification/NotificationListModal';
import api from '@/utils/api';
import {
  ACCOMMODATION_AMENITIES,
  CURRENCY,
  NotificationModalTitle,
  PAGE_TITLE_SUFFIX,
  PHONE_CODE,
} from '@/utils/constants';
import {
  capitalize,
  classNames,
  downloadMap,
  getLocalStorageItem,
  redireacToAdminSite,
} from '@/utils/helper';
import noImage from '@/assets/images/no-image.png';

import AccommodationRoomsList from './AccommodationRoomsList';

const breakpoints = [
  { width: 1950, maxChar: 1100 },
  { width: 1920, maxChar: 950 },
  { width: 1600, maxChar: 800 },
  { width: 1500, maxChar: 750 },
  { width: 1440, maxChar: 680 },
  { width: 1340, maxChar: 580 },
  { width: 1200, maxChar: 500 },
  { width: 1100, maxChar: 400 },
  { width: 1080, maxChar: 350 },
  { width: 0, maxChar: 280 },
];

const AccommodationDetail = () => {
  const [width] = useWindowSize();
  const navigate = useNavigate();
  const [maxChars, setMaxChar] = useState(
    breakpoints[breakpoints.length - 1].maxChar
  );

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
  const [notificationData, setNotificationData] = useState({});
  const queryClient = useQueryClient();
  const [isShowLoader, setIsLoaderFlag] = useState(true);
  const [isShowNotificationModal, setIsShowNotificationModal] = useState(false);
  const [isShowMap, setIsShowMap] = useState(false);

  useEffect(() => {
    const currentBreakpoint = breakpoints.find((bp) => width >= bp.width);

    const finalWidth =
      accommodationData?.type === 'casa'
        ? currentBreakpoint.maxChar
        : currentBreakpoint.maxChar + 50;

    setMaxChar(finalWidth);
  }, [width]);

  const getNotificationData = async (id) => {
    const res = await api.get(
      `notification?category=accommodations&content_id=${id}`
    );

    return res.data;
  };

  const getAccommodationData = async (id) => {
    const res = await api.get(`/accommodation/agency/${id}`);

    return res.data;
  };

  const fetchAccommodationData = async () => {
    try {
      const data = await queryClient.fetchQuery(
        ['get-accommodation-data', accommodationId],
        () => getAccommodationData(accommodationId)
      );

      setIsLoaderFlag(false);
      setAccommodationData(data?.data);
    } catch (error) {
      setIsLoaderFlag(false);
    }
  };

  useQuery(
    ['get-accommodation-notification', accommodationId],
    () => getNotificationData(accommodationId),
    {
      enabled: !!accommodationId,
      onSuccess: (data) => {
        setNotificationData(data?.data);
        setIsShowNotificationModal(
          data?.data?.pop_up && data?.data?.pop_up.length > 0
        );
        fetchAccommodationData();
      },
      onError: () => {
        fetchAccommodationData();
      },
    }
  );

  useEffect(() => {
    if (accommodationData?.description) {
      const displayedText =
        accommodationData?.description?.length < maxChars
          ? accommodationData?.description
          : accommodationData?.description?.slice(0, maxChars) + '...';

      setAccDesc(displayedText || '');
    }
  }, [accommodationData?.description, maxChars]);

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

  const pages = [
    { name: 'Accommodation', href: '/accommodations', current: false },
    { name: accommodationData?.name ?? '', href: '', current: true },
  ];

  const findAmenityLabelByKey = (key) => {
    const amenity = ACCOMMODATION_AMENITIES.find((item) => item.key === key);

    return amenity ? amenity.label : null;
  };

  return (
    <div className='px-6 flex justify-center sm:px-8 lg:px-10 py-6'>
      <div className='max-w-[1920px] w-full'>
        <Helmet>
          <meta charSet='utf-8' />
          <title>Accommodation Detail {PAGE_TITLE_SUFFIX}</title>
        </Helmet>
        {isShowLoader && <DetailPageSkeleton pageName='accommodation' />}

        {!isShowLoader && (
          <>
            <div className='px-4'>
              <Breadcrumbs pages={pages} />
            </div>
            <div className='mb-4 mt-6'>
              {notificationData && (
                <NotificationList notifications={notificationData} />
              )}

              <div className='bg-white p-4 mb-4'>
                <div className='flex flex-wrap justify-between gap-2'>
                  <div className='flex lg:flex-nowrap flex-wrap gap-4 2xl:w-10/12  xl:w-5/6 lg:w-10/12  w-full'>
                    {accommodationData?.images &&
                    accommodationData?.images?.length > 1 ? (
                      <div className='w-full max-w-[400px] max-h-[280px] rounded-md detail-slider'>
                        <Slider ref={outSliderRef} {...settings}>
                          {accommodationData?.images?.map((item) => (
                            <img
                              key={item?.id}
                              id='myImg'
                              src={item?.image_path}
                              onError={(e) => {
                                e.target.src = noImage;
                              }}
                              alt='accommodation'
                              className='w-full max-w-[400px] max-h-[280px]  h-screen object-cover object-center rounded-md hover:opacity-70 '
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
                          accommodationData?.images &&
                          accommodationData?.images?.length > 0
                            ? accommodationData?.images[0]?.image_path
                            : ''
                        }
                        alt='accommodation'
                        className='w-full max-w-[400px] max-h-[280px] h-screen rounded-md object-cover cursor-pointer  hover:opacity-70 object-center '
                        onError={(e) => {
                          e.target.src = noImage;
                        }}
                        onClick={() => {
                          setSelectedImage(
                            accommodationData?.images[0]?.image_path
                          );
                          setOpenImageModal(true);
                        }}
                      />
                    )}

                    <div className='2xl:w-11/12'>
                      <div className='flex flex-wrap items-center gap-2'>
                        <div className='flex flex-wrap gap-3 items-center'>
                          <p className='2xl:text-3xl xl:text-xl text-lg  font-semibold first-letter:uppercase'>
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

                        <div className='self-center'>
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
                        <Link
                          to={
                            accommodationData?.parent_accommodation?.id !== 0
                              ? `/accommodation/${accommodationData?.parent_accommodation?.id}`
                              : ''
                          }
                          className={classNames(
                            'text-sm xl:text-base font-medium lowercase flex items-center my-1 text-gray-600',
                            accommodationData?.parent_accommodation?.id !== 0
                              ? 'cursor-pointer'
                              : 'cursor-default'
                          )}
                        >
                          <span className={'first-letter:uppercase'}>
                            {accommodationData?.parent_accommodation?.id !== 0
                              ? accommodationData?.parent_accommodation?.name
                              : 'Parent casa'}
                          </span>
                        </Link>
                      )}

                      <div
                        className='break-words text-wrap pt-3'
                        dangerouslySetInnerHTML={{
                          __html: accDesc,
                        }}
                      />

                      {accommodationData?.description &&
                        accommodationData?.description?.length > maxChars && (
                          <button
                            onClick={() => setOpenDescModal(true)}
                            className='text-palette8 hover:text-palette4 font-medium text-sm'
                          >
                            Show more
                          </button>
                        )}
                    </div>
                  </div>

                  <div className='lg:w-[15%] w-1/5'>
                    <div className='flex gap-2 justify-end'>
                      {isValidCoordinates && (
                        <Button size='sm' onClick={() => setIsShowMap(true)}>
                          Map
                        </Button>
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
                  <div className='grid xl:grid-cols-3 lg:grid-cols-2 gap-4 items-start'>
                    <DetailComponent
                      noCenter={true}
                      label='Address'
                      value={accommodationData?.address ?? '-'}
                    />

                    <DetailComponent
                      label='Location'
                      value={accommodationData?.location ?? '-'}
                    />

                    <div className=''>
                      <DetailComponent
                        label='City'
                        noCenter={true}
                        value={accommodationData?.city ?? '-'}
                      />
                    </div>
                    <DetailComponent
                      label='Contact'
                      value={
                        (accommodationData?.contact ? PHONE_CODE : '') +
                        ' ' +
                        (accommodationData?.contact
                          ? accommodationData?.contact
                          : '-')
                      }
                    />

                    <DetailComponent
                      label='Meal plan'
                      value={
                        accommodationData?.meal_plan_type
                          ? accommodationData?.meal_plan_type.toUpperCase()
                          : '-'
                      }
                    />

                    <DetailComponent
                      label='Last date'
                      value={
                        accommodationData?.last_date
                          ? moment(accommodationData?.last_date).format(
                              'DD-MM-YYYY'
                            )
                          : '-'
                      }
                    />

                    <p
                      className='font-medium text-base min-w-[75px] cursor-pointer text-palette8  hover:text-palette4'
                      onClick={() => setOpenPolicyModal(true)}
                    >
                      Policy
                    </p>
                  </div>

                  <div className='mt-4 flex'>
                    <p className='first-letter:uppercase font-medium  text-base min-w-[91px]'>
                      Amenities
                    </p>
                    &nbsp;:&nbsp;
                    {accommodationData?.amenities_list &&
                    accommodationData?.amenities_list.length > 0 ? (
                      <div className='first-letter:uppercase text-gray-500 flex flex-wrap gap-2 mt-0.5'>
                        {accommodationData?.amenities_list?.map(
                          (amenityKey) => {
                            const label = findAmenityLabelByKey(amenityKey);

                            if (label) {
                              return (
                                <Badge
                                  key={amenityKey}
                                  size='sm'
                                  className={classNames(
                                    'capitalize bg-green-50 font-medium text-green-700 ring-1  ring-inset ring-green-700/10 '
                                  )}
                                >
                                  {findAmenityLabelByKey(amenityKey)}
                                </Badge>
                              );
                            }
                          }
                        )}
                      </div>
                    ) : (
                      '-'
                    )}
                  </div>
                </div>

                {accommodationData?.parent_accommodation?.id !== 0 ? (
                  <>
                    <div className='mt-4 flex gap-4 flex-col  bg-white border rounded-lg shadow-md'>
                      <div className='flex justify-between p-3 rounded-t-lg bg-gray-300'>
                        <div className='first-letter:uppercase font-medium  text-base min-w-[91px]'>
                          Room Offers
                        </div>
                        <div>
                          <Button
                            size='sm'
                            onClick={() =>
                              navigate(
                                `/accommodation/${accommodationData?.parent_accommodation?.id}`
                              )
                            }
                          >
                            <span className='text-xs not-italic leading-normal'>
                              Click here for prices
                            </span>
                          </Button>
                        </div>
                      </div>

                      {accommodationData?.casa_rooms &&
                      accommodationData?.casa_rooms.length > 0 ? (
                        <div className='first-letter:uppercase text-gray-500 flex flex-col p-3  gap-4'>
                          {accommodationData?.casa_rooms?.map((room) => {
                            if (room) {
                              return (
                                <div
                                  className='flex flex-row items-center gap-2 w-full'
                                  key={room?.name}
                                >
                                  <div className=''>
                                    <CheckIcon className='w-4 h-4 text-black' />
                                  </div>
                                  <div>
                                    <span className='text-gray-900 font-normal text-base not-italic leading-normal'>
                                      {room?.name}
                                    </span>
                                  </div>
                                </div>
                              );
                            }
                          })}
                        </div>
                      ) : (
                        '-'
                      )}
                    </div>
                  </>
                ) : null}
              </div>

              {accommodationData?.rooms?.map((data, index) => (
                <AccommodationRoomsList
                  key={index}
                  data={data}
                  accommodationData={accommodationData}
                />
              ))}

              {accommodationData?.supplements &&
                accommodationData?.supplements?.length > 0 && (
                  <div className='bg-white p-4 mb-8 border rounded-md shadow-md'>
                    <p className='text-customBlack font-semibold text-lg mr-2 first-letter:uppercase'>
                      Supplements
                    </p>

                    <div className='mt-4 border rounded-md'>
                      <table className='w-full price-table'>
                        <tbody className='bg-[#FAFAFA]'>
                          {accommodationData?.supplements?.map((supplement) => (
                            <tr
                              key={supplement?.id ?? '-'}
                              className='border-b last:border-0 hover:bg-gray-100'
                            >
                              <td className='max-w-[30%] w-full p-[12px] break-all font-medium'>
                                {supplement?.information ?? '-'}
                              </td>
                              <td className='p-[12px] text-gray-500'>
                                {CURRENCY} {supplement?.price ?? 0}{' '}
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

              {accommodationData?.childpolicy &&
                accommodationData?.childpolicy?.length > 0 && (
                  <div className='bg-white p-4 mb-8 border rounded-md shadow-md'>
                    <p className='text-customBlack font-semibold text-lg mr-2 first-letter:uppercase'>
                      Child policy
                    </p>
                    <div className='mt-4 border rounded-md'>
                      <table className='w-full price-table'>
                        <tbody className='bg-[#FAFAFA]'>
                          {accommodationData?.childpolicy?.map((policy) => (
                            <tr
                              key={policy?.id}
                              className='border-b last:border-0 hover:bg-gray-100'
                            >
                              <td className='max-w-[15%] p-[12px] flex items-center font-medium'>
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
                              <td className='p-[12px] text-gray-500'>
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
          </>
        )}

        <ImageSlider
          open={openImageModal}
          setOpen={setOpenImageModal}
          images={accommodationData?.images}
          modalSliderRef={modalSliderRef}
          setCurrentSlide={setCurrentSlide}
          selectedImage={selectedImage}
        />

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
                className='first-letter:uppercase text-gray-500 break-words max-h-[500px] overflow-auto'
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
                  className='first-letter:uppercase text-gray-500 break-words max-h-[500px] overflow-auto'
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

        <CommonModal
          maxWidth='max-w-5xl'
          ModalHeader={NotificationModalTitle}
          isOpen={isShowNotificationModal}
          onClose={setIsShowNotificationModal}
          onSuccess={() => {}}
          showActionBtn={false}
        >
          <NotificationListModal notifications={notificationData} />
        </CommonModal>

        <CommonModal
          maxWidth='max-w-7xl'
          ModalHeader={accommodationData?.name ?? 'Map'}
          isOpen={isShowMap}
          onClose={setIsShowMap}
          onSuccess={() => {}}
          showActionBtn={false}
          isShowDownload={true}
          callBackDownloadBtn={() => downloadMap(accommodationData?.name)}
        >
          <Map
            pinTitle={accommodationData?.name ?? ''}
            latitude={accommodationData?.latitude ?? null}
            longitude={accommodationData?.longitude ?? null}
          />
        </CommonModal>
      </div>
    </div>
  );
};

export default AccommodationDetail;
