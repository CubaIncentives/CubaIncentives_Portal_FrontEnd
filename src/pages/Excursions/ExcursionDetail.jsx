import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import Slider from 'react-slick';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { useQuery } from '@tanstack/react-query';
import moment from 'moment';
import validator from 'validator';

import { Badge, Button, CommonModal, CustomSpinner } from '@/components/Common';
import Breadcrumbs from '@/components/Common/Breadcrumbs';
import DetailComponent from '@/components/Common/DetailComponent';
import api from '@/utils/api';
import {
  CURRENCY,
  DATE_PRICEFIELDS_KEYS,
  PAGE_TITLE_SUFFIX,
} from '@/utils/constants';
import {
  classNames,
  getLocalStorageItem,
  redireacToAdminSite,
} from '@/utils/helper';
import noImage from '@/assets/images/no-image.png';

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

        {isLoading && (
          <div className='bg-white h-[calc(100vh-390px)] flex flex-col justify-center'>
            <CustomSpinner className='h-[50px] w-[40px] flex justify-center items-center'></CustomSpinner>
          </div>
        )}

        {!isLoading && (
          <>
            <div className='px-4'>
              <Breadcrumbs pages={pages} />
            </div>
            <div className='mt-6'>
              <div className='bg-white p-4 mb-4'>
                <div className='flex justify-between gap-2'>
                  <div className='flex lg:flex-nowrap flex-wrap gap-4  xl:w-3/4 lg:w-4/6 w-full'>
                    {excursionData?.images?.length > 1 ? (
                      <div className='w-[200px]'>
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
                        onError={(e) => {
                          e.target.src = noImage;
                        }}
                        src={
                          excursionData?.images?.length > 0
                            ? excursionData?.images[0]?.image_path
                            : ''
                        }
                        alt='excursion'
                        className='h-32 min-w-[200px] rounded-lg object-cover object-center cursor-pointer hover:opacity-70'
                        onClick={() => {
                          setSelectedImage(
                            excursionData?.images[0]?.image_path
                          );
                          setOpenImageModal(true);
                        }}
                      />
                    )}

                    <div className='w-11/12'>
                      <p className='2xl:text-3xl xl:text-xl text-lg font-semibold first-letter:uppercase text-customBlack text-wrap break-words'>
                        {excursionData?.excursion_name}
                      </p>

                      <div
                        className='pr-4 text-base mt-2 text-customBlack/75'
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
                  <div className='grid 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 gap-4 items-start'>
                    <DetailComponent
                      label='Location'
                      value={excursionData?.location ?? '-'}
                    />

                    <DetailComponent
                      label='City'
                      noCenter={true}
                      value={excursionData?.city}
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
                      label='Duration'
                      value={excursionData?.duration ?? '-'}
                    />

                    <DetailComponent
                      label='Start time'
                      value={excursionData?.start_time ?? '-'}
                    />

                    <DetailComponent
                      label='Difficulty'
                      value={excursionData?.difficulty ?? '-'}
                    />

                    <DetailComponent
                      label='Latitude'
                      value={excursionData?.latitude ?? '-'}
                    />

                    <DetailComponent
                      label='Longitude'
                      value={excursionData?.longitude ?? '-'}
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

              {prices && prices?.length > 0 && (
                <div className='bg-white p-4 pt-0 mb-8'>
                  {prices?.length > 0 && (
                    <div className='border rounded-md overflow-auto'>
                      <table className='w-full price-table'>
                        <tbody>
                          <tr className='order-b bg-[#EFEFEF]'>
                            <td className='px-4 py-3  min-w-64 font-semibold text-sm text-customBlack'>
                              Seasons
                            </td>
                            <td className='px-4 py-3 font-semibold text-sm text-customBlack  min-w-36'>
                              Price per person
                            </td>
                            {[...Array(7).keys()].map((i) => (
                              <td
                                key={i}
                                className='px-4 py-3 font-semibold text-sm text-customBlack min-w-28'
                              >
                                {i + 2} pax
                              </td>
                            ))}
                          </tr>

                          {prices?.map((price, index) => (
                            <tr
                              className='align-baseline border-b last:border-0'
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
                              {DATE_PRICEFIELDS_KEYS.map((data, index) => {
                                return (
                                  <td
                                    key={index}
                                    className='px-4 py-3 min-w-36'
                                  >
                                    <span
                                      className={classNames(
                                        price?.[data]
                                          ? 'text-customBlue  font-semibold text-base group-hover:font-extrabold'
                                          : 'text-customBlack'
                                      )}
                                    >
                                      {price?.[data]
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
                      onError={(e) => {
                        e.target.src = noImage;
                      }}
                      alt='excursion'
                      className='modal-content !cursor-default !opacity-100'
                    />
                  </div>
                ))}
              </Slider>
            ) : (
              <img
                src={selectedImage}
                onError={(e) => {
                  e.target.src = noImage;
                }}
                alt='excursion'
                className='modal-content'
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExcursionDetail;
