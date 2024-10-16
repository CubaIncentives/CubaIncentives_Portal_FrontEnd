import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import Slider from 'react-slick';
import DetailPageSkeleton from '@/skeletons/DetailPageSkeleton';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
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
  CURRENCY,
  NotificationModalTitle,
  PAGE_TITLE_SUFFIX,
} from '@/utils/constants';
import {
  classNames,
  downloadMap,
  getLocalStorageItem,
  redireacToAdminSite,
} from '@/utils/helper';
import noImage from '@/assets/images/no-image.png';

const breakpoints = [
  { width: 1950, maxChar: 1100 },
  { width: 1920, maxChar: 950 },
  { width: 1600, maxChar: 800 },
  { width: 1500, maxChar: 750 },
  { width: 1440, maxChar: 680 },
  { width: 1340, maxChar: 580 },
  { width: 1200, maxChar: 500 },
  { width: 1100, maxChar: 400 },
  { width: 0, maxChar: 350 },
];

const ExcursionDetail = () => {
  const [width] = useWindowSize();
  const [maxChars, setMaxChar] = useState(
    breakpoints[breakpoints.length - 1].maxChar
  );

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
  const [priceTableKeys, setPriceTableKeys] = useState([]);
  const [isValidCoordinates, setIsValidCoordinates] = useState(false);
  const [notificationData, setNotificationData] = useState({});
  const queryClient = useQueryClient();
  const [isShowLoader, setIsLoaderFlag] = useState(true);
  const [isShowNotificationModal, setIsShowNotificationModal] = useState(false);
  const [isShowMap, setIsShowMap] = useState(false);

  useEffect(() => {
    const currentBreakpoint = breakpoints.find((bp) => width >= bp.width);

    setMaxChar(currentBreakpoint.maxChar);
  }, [width]);

  const getNotificationData = async (id) => {
    const res = await api.get(
      `notification?category=excursions&content_id=${id}`
    );

    return res.data;
  };

  const getExcursionData = async (id) => {
    const res = await api.get(`/excursion/agency/${id}`);

    return res.data;
  };

  const fetchExcursionData = async () => {
    try {
      const data = await queryClient.fetchQuery(
        ['get-excursion-data', excursionId],
        () => getExcursionData(excursionId)
      );
      const response = data?.data;

      setIsLoaderFlag(false);
      setExcursionData(response?.excursion);
      if (response?.price_dates?.length > 0) {
        const keysToCheck = {
          price_per_person: 'Price per person',
          taxi_price_two_pax: '2 pax',
          minibus_price_three_pax: '3 pax',
          minibus_price_four_pax: '4 pax',
          minibus_price_five_pax: '5 pax',
          minibus_price_six_pax: '6 pax',
          minibus_price_seven_pax: '7 pax',
          minibus_price_eight_pax: '8 pax',
        };

        const nullPassengerLabels = [];

        for (let key in keysToCheck) {
          const isNullForAll = response?.price_dates.every(
            (obj) => obj[key] === null
          );

          if (!isNullForAll) {
            nullPassengerLabels.push({ [key]: keysToCheck[key] });
          }
        }

        setPriceTableKeys(nullPassengerLabels);

        setPrices(response?.price_dates);
      } else {
        setPrices([]);
      }
    } catch (error) {
      setIsLoaderFlag(false);
    }
  };

  useQuery(
    ['get-excursion-notification', excursionId],
    () => getNotificationData(excursionId),
    {
      enabled: !!excursionId,
      onSuccess: (data) => {
        setNotificationData(data?.data);
        setIsShowNotificationModal(
          data?.data?.pop_up && data?.data?.pop_up.length > 0
        );
        fetchExcursionData();
      },
      onError: () => {
        fetchExcursionData();
      },
    }
  );

  useEffect(() => {
    if (excursionData?.description) {
      const displayedText =
        excursionData?.description?.length < maxChars
          ? excursionData?.description
          : excursionData?.description?.slice(0, maxChars) + '...';

      setAccDesc(displayedText || '');
    }
  }, [excursionData?.description, maxChars]);

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

  const pages = [
    { name: 'Excursions', href: '/excursions', current: false },
    { name: excursionData?.excursion_name ?? '', href: '', current: true },
  ];

  return (
    <div className='px-6 sm:px-8 lg:px-10 py-6 flex justify-center'>
      <div className='max-w-[1920px] w-full'>
        <Helmet>
          <meta charSet='utf-8' />
          <title>Excursion Detail {PAGE_TITLE_SUFFIX}</title>
        </Helmet>

        {isShowLoader && <DetailPageSkeleton pageName='excursion' />}

        {!isShowLoader && (
          <>
            <div className='px-4'>
              <Breadcrumbs pages={pages} />
            </div>
            <div className='mt-6'>
              <NotificationList notifications={notificationData} />

              <div className='bg-white p-4 mb-4'>
                <div className='flex flex-wrap  justify-between gap-2'>
                  <div className='flex lg:flex-nowrap flex-wrap gap-4  2xl:w-10/12  xl:w-5/6 lg:w-10/12  w-full'>
                    {excursionData?.images?.length > 1 ? (
                      <div className='w-full max-w-[400px] max-h-[280px] rounded-md detail-slider'>
                        <Slider ref={outSliderRef} {...settings}>
                          {excursionData?.images?.map((item) => (
                            <img
                              key={item?.id}
                              id='myImg'
                              src={item?.image_path}
                              onError={(e) => {
                                e.target.src = noImage;
                              }}
                              alt='excursion'
                              className='w-full max-w-[400px] max-h-[280px] h-screen  object-cover object-center rounded-md hover:opacity-70 '
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
                        onError={(e) => {
                          e.target.src = noImage;
                        }}
                        src={
                          excursionData?.images?.length > 0
                            ? excursionData?.images[0]?.image_path
                            : ''
                        }
                        alt='excursion'
                        className='w-full max-w-[400px] max-h-[280px] rounded-md object-cover cursor-pointer  hover:opacity-70 object-center '
                        onClick={() => {
                          setSelectedImage(
                            excursionData?.images[0]?.image_path
                          );
                          setOpenImageModal(true);
                        }}
                      />
                    )}

                    <div className='w-11/12'>
                      <p className='2xl:text-3xl xl:text-xl text-lg font-semibold first-letter:uppercase text-customBlack text-wrap break-all break-words'>
                        {excursionData?.excursion_name}
                      </p>

                      <div
                        className='pr-4 text-base break-words mt-2 text-customBlack/75'
                        dangerouslySetInnerHTML={{
                          __html: accDesc,
                        }}
                      />

                      {excursionData?.description?.length > maxChars && (
                        <button
                          onClick={() => setOpenDescModal(true)}
                          className='text-palette8 hover:text-palette4 font-medium text-sm xl:text-base'
                        >
                          Show more
                        </button>
                      )}
                    </div>
                  </div>

                  <div className='lg:w-[15%] w-1/5'>
                    <div className='flex justify-end gap-2'>
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
                              `excursion/view/${excursionId}`
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
                      label='Location'
                      value={excursionData?.location ?? '-'}
                    />

                    <DetailComponent
                      label='City'
                      noCenter={true}
                      value={excursionData?.city ?? '-'}
                    />

                    <DetailComponent
                      label='Distance'
                      value={excursionData?.distance ?? '-'}
                    />
                    <DetailComponent
                      label='Min. person'
                      value={excursionData?.minimum_persons ?? '-'}
                    />

                    <DetailComponent
                      label='Max. person'
                      value={excursionData?.maximum_persons ?? '-'}
                    />

                    <DetailComponent
                      label='Difficulty'
                      value={
                        excursionData?.difficulty === 'not_available'
                          ? 'N/A'
                          : (excursionData?.difficulty ?? '-')
                      }
                    />

                    <DetailComponent
                      label='Start time'
                      value={excursionData?.start_time ?? '-'}
                    />

                    <DetailComponent
                      label='Duration'
                      value={excursionData?.duration ?? '-'}
                    />
                  </div>

                  <div className='mt-4 flex'>
                    <p className='first-letter:uppercase font-medium text-base min-w-[91px]'>
                      Included
                    </p>
                    &nbsp;:&nbsp;
                    <div className='first-letter:uppercase text-gray-500 flex flex-wrap gap-2 mt-0.5'>
                      {excursionData?.included &&
                      excursionData?.included.length > 0
                        ? excursionData?.included?.map((key) => {
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
                          })
                        : '-'}
                    </div>
                  </div>
                </div>
              </div>

              {prices &&
                prices?.length > 0 &&
                priceTableKeys &&
                priceTableKeys.length > 0 && (
                  <div className='bg-white p-4 pt-0 mb-8'>
                    {prices?.length > 0 && (
                      <div
                        className={classNames(
                          'border rounded-md  overflow-auto',
                          priceTableKeys.length !== 8 ? 'w-fit' : 'w-full'
                        )}
                      >
                        <table className='price-table w-full'>
                          <tbody>
                            <tr className='order-b bg-[#EFEFEF]'>
                              <td className='px-4 py-3 flex items-center max-w-[20%]  text-base text-customBlack   min-w-64'>
                                Seasons
                              </td>

                              {priceTableKeys.map((item, index) => (
                                <td
                                  key={index}
                                  className={classNames(
                                    'px-4 py-3 font-semibold text-sm max-w-[10%] text-customBlack',
                                    Object.keys(item)[0] === 'price_per_person'
                                      ? ' min-w-36'
                                      : ' min-w-32'
                                  )}
                                >
                                  {Object.values(item)[0]}
                                </td>
                              ))}
                            </tr>

                            {prices?.map((price, index) => (
                              <tr
                                className='align-baseline border-b last:border-0 hover:bg-gray-100'
                                key={index}
                              >
                                <td className='px-4 py-3 flex items-center max-w-[20%]  text-base text-customBlack   min-w-64'>
                                  {moment(price?.date_plan?.from_date).format(
                                    'DD-MM-YYYY'
                                  )}{' '}
                                  <ArrowRightIcon className='h-5 w-5 mx-2 text-gray-400' />{' '}
                                  {moment(price?.date_plan?.to_date).format(
                                    'DD-MM-YYYY'
                                  )}
                                </td>
                                {priceTableKeys
                                  .map((item) => Object.keys(item)[0])
                                  .map((data, index) => {
                                    return (
                                      <td
                                        key={index}
                                        className={classNames(
                                          'px-4 py-3 max-w-[10%] ',
                                          data === 'price_per_person'
                                            ? ' min-w-36'
                                            : ' min-w-32'
                                        )}
                                      >
                                        <span
                                          className={classNames(
                                            price?.[data] !== null &&
                                              price?.[data] !== '' &&
                                              price?.[data] !== undefined
                                              ? 'text-customBlue  font-semibold text-base group-hover:font-extrabold'
                                              : ''
                                          )}
                                        >
                                          {price?.[data] !== null &&
                                          price?.[data] !== '' &&
                                          price?.[data] !== undefined
                                            ? CURRENCY + price?.[data]
                                            : 'N/A'}
                                        </span>
                                      </td>
                                    );
                                  })}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

              {excursionData?.addons && excursionData?.addons.length > 0 ? (
                <div className='mb-4  p-4 '>
                  <p className='text-customBlack font-semibold text-lg mr-2 first-letter:uppercase'>
                    Add-ons
                  </p>

                  <div className=' my-4 grid 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 gap-4'>
                    {excursionData?.addons.map((data) => {
                      return (
                        <div
                          key={data?.id}
                          className='flex px-4  py-2 flex-col gap-4 bg-white border  overflow-auto shadow-lg rounded-md'
                        >
                          <div>
                            <span className='text-customBlack text-base not-italic font-bold leading-normal break-normal'>
                              {data?.addon_description ?? ''}
                            </span>
                          </div>
                          {data?.price_rule && data?.price_rule.length > 0 ? (
                            <div className='bg-white border  rounded-md'>
                              <table className='table-auto w-full rounded-md '>
                                <thead>
                                  <tr className='bg-[#EFEFEF] '>
                                    <th className='border-r border-slate-300 px-4 py-2 max-w-[20%] text-center not-italic font-semibold text-sm text-gray-600 leading-normal w-full'>
                                      Price
                                    </th>
                                    <th className='px-4 py-2 not-italic font-semibold text-sm text-gray-600 leading-normal'>
                                      Information
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {data?.price_rule.map((item, index) => (
                                    <tr key={index} className='border-b'>
                                      <td className='border-r border-slate-200 text-center px-4 py-2'>
                                        <span className='not-italic  text-sm leading-normal font-normal text-customBlack'>
                                          ${item?.sell_price ?? 0}
                                        </span>
                                      </td>
                                      <td className=' px-4 py-2 '>
                                        <span className='not-italic  break-normal text-sm leading-normal font-normal text-gray-500'>
                                          {item?.information ?? ''}
                                        </span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>
          </>
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
                className='first-letter:uppercase  text-wrap break-words text-gray-500'
                dangerouslySetInnerHTML={{
                  __html: excursionData?.description,
                }}
              ></div>
            </div>
          </CommonModal>
        )}

        <ImageSlider
          open={openImageModal}
          setOpen={setOpenImageModal}
          images={excursionData?.images}
          modalSliderRef={modalSliderRef}
          setCurrentSlide={setCurrentSlide}
          selectedImage={selectedImage}
        />

        <CommonModal
          maxWidth='max-w-5xl'
          ModalHeader={NotificationModalTitle}
          isOpen={isShowNotificationModal}
          onClose={setIsShowNotificationModal}
          onSuccess={() => {}}
          showActionBtn={false}
        >
          <NotificationListModal notifications={notificationData ?? {}} />
        </CommonModal>

        <CommonModal
          maxWidth='max-w-7xl'
          ModalHeader={excursionData?.excursion_name ?? 'Map'}
          isOpen={isShowMap}
          onClose={setIsShowMap}
          onSuccess={() => {}}
          showActionBtn={false}
          isShowDownload={true}
          callBackDownloadBtn={() => downloadMap(excursionData?.excursion_name)}
        >
          <Map
            pinTitle={excursionData?.excursion_name ?? ''}
            latitude={excursionData?.latitude ?? null}
            longitude={excursionData?.longitude ?? null}
          />
        </CommonModal>
      </div>
    </div>
  );
};

export default ExcursionDetail;
