import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import ListingCardSkeleton from '@/skeletons/ListingCardSkeleton';
import { StarIcon } from '@heroicons/react/20/solid';
import { useMutation } from '@tanstack/react-query';

import {
  Checkbox,
  CommonModal,
  SearchableSelect,
  SearchInput,
} from '@/components/Common';
import NoDataFound from '@/components/Common/NoDataFound';
import api from '@/utils/api';
import { CURRENCY, PAGE_TITLE_SUFFIX } from '@/utils/constants';
import { capitalize, customSearchableSelectOptions } from '@/utils/helper';
import { ReactComponent as EyeIcon } from '@/assets/images/eye-icon.svg';
import SpecialImg from '@/assets/images/special-img.png';

import PriceTableModal from './PriceTableModal';

const Accommodations = () => {
  const navigate = useNavigate();

  const [accommodations, setAccommodations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedChain, setSelectedChain] = useState(null);
  const [allLocations, setAllLocations] = useState([]);
  const [allChains, setAllChains] = useState([]);
  const [searchParam, setSearchParam] = useState('');
  const [selectedAccommodation, setSelectedAccommodation] = useState(null);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [check, setCheck] = useState({
    hotel: false,
    casa: false,
    specials: false,
    early_bird: false,
  });

  const getTrueKey = (obj) => {
    return Object.keys(obj).find((key) => obj[key]);
  };

  const fetchAllAccommodations = async (location, chain, type, searchParam) => {
    let url = '/accommodation/agency';

    const params = [];

    if (location) {
      params.push(`location=${location?.value}`);
    }

    if (chain) {
      params.push(`chain_name=${chain?.value}`);
    }

    if (type) {
      params.push(`type=${type}`);
    }

    if (searchParam) {
      params.push(`search=${searchParam}`);
    }

    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }

    const res = await api.get(url);

    return res.data;
  };

  const AccommodationMutation = useMutation({
    mutationFn: ({ location, chain, type, searchParam }) =>
      fetchAllAccommodations(location, chain, type, searchParam),
  });

  const handleSelect = (selected, type) => {
    if (type === 'location') {
      setSelectedLocation(selected);
    } else if (type === 'chain') {
      setSelectedChain(selected);
    } else {
      return;
    }

    AccommodationMutation.mutate(
      {
        location: type === 'location' ? selected : selectedLocation,
        chain: type === 'chain' ? selected : selectedChain,
        type: getTrueKey(check),
        searchParam,
      },
      {
        onSuccess: (data) => {
          setAccommodations(data?.data);
        },
      }
    );
  };

  const handleCheck = (name) => {
    setCheck((prev) => {
      const newCheck = {
        hotel: name === 'hotel' ? !prev.hotel : false,
        casa: name === 'casa' ? !prev.casa : false,
        specials: name === 'specials' ? !prev.specials : false,
        early_bird: name === 'early_bird' ? !prev.early_bird : false,
      };

      AccommodationMutation.mutate(
        {
          location: selectedLocation,
          chain: selectedChain,
          type: getTrueKey(newCheck),
          searchParam,
        },
        {
          onSuccess: (data) => {
            setAccommodations(data?.data);
          },
        }
      );

      return newCheck;
    });
  };

  useEffect(() => {
    let delayDebounceFn;

    if (searchParam) {
      if (searchParam.length > 1) {
        delayDebounceFn = setTimeout(() => {
          AccommodationMutation.mutate(
            {
              location: selectedLocation,
              chain: selectedChain,
              type: getTrueKey(check),
              searchParam,
            },
            {
              onSuccess: (data) => {
                setAccommodations(data?.data);
              },
            }
          );
        }, 800);
      }
    } else {
      AccommodationMutation.mutate(
        {
          location: selectedLocation,
          chain: selectedChain,
          type: getTrueKey(check),
          searchParam,
        },
        {
          onSuccess: (data) => {
            const sortedLocations = data?.data;

            setAccommodations(sortedLocations);

            const onlyLocations = sortedLocations?.map((item) =>
              capitalize(item.location)
            );

            const onlyChains = sortedLocations?.map((item) => item?.chain_name);

            const uniqueChains = [
              ...new Set(
                onlyChains
                  .filter((chain) => chain != null)
                  .map((chain) => capitalize(chain))
              ),
            ];

            setAllLocations(
              customSearchableSelectOptions([...new Set(onlyLocations)])
            );
            setAllChains(customSearchableSelectOptions(uniqueChains));
          },
        }
      );
    }

    return () => {
      clearTimeout(delayDebounceFn);
    };
  }, [searchParam]);

  return (
    <div className='w-full'>
      <Helmet>
        <meta charSet='utf-8' />
        <title>Accommodations {PAGE_TITLE_SUFFIX}</title>
      </Helmet>
      <div className='flex w-full'>
        <div className='w-full xl:max-w-xs lg:max-w-[22%] max-w-[30%]'>
          <div className='duration-300 relative min-h-[calc(100vh-170px)] mt-[30px]'>
            <div className='border-b pb-6 px-6 sm:px-8 lg:px-10'>
              <SearchInput
                label='SEARCH'
                name='searchParam'
                type='text'
                value={searchParam}
                placeholder='Search by name or city...'
                onChange={(e) => setSearchParam(e.target.value)}
                setSearchTerm={setSearchParam}
                disabled={AccommodationMutation.isLoading}
                labelClassName='!text-customBlackSidebar !text-sm xl:!text-base uppercase'
                inputMarginTop='mt-3'
              />
            </div>

            <div className='border-b py-6 px-6 sm:px-8 lg:px-10'>
              <SearchableSelect
                label='Location'
                placeholder='Select location'
                options={allLocations}
                onChange={(e) => {
                  handleSelect(e, 'location');
                }}
                loading={AccommodationMutation.isLoading}
                disabled={AccommodationMutation.isLoading}
                labelClassName='!text-customBlackSidebar !text-sm uppercase'
                inputMarginTop='mt-3'
              />
            </div>

            <div className='border-b py-6 px-6 sm:px-8 lg:px-10'>
              <SearchableSelect
                label='Chain'
                placeholder='Select chain'
                options={allChains}
                onChange={(e) => {
                  handleSelect(e, 'chain');
                }}
                disabled={AccommodationMutation.isLoading}
                labelClassName='!text-customBlackSidebar !text-sm uppercase'
                inputMarginTop='mt-3'
              />
            </div>

            <div className='border-b py-6 px-6 sm:px-8 lg:px-10'>
              <label className='label !text-customBlackSidebar !text-sm uppercase'>
                Type
              </label>
              <div className='mt-3 flex gap-x-6 gap-y-2 flex-wrap'>
                <Checkbox
                  label='Hotels'
                  checked={check.hotel}
                  onClick={() => handleCheck('hotel')}
                  disabled={AccommodationMutation.isLoading}
                />
                <Checkbox
                  label='Casa'
                  checked={check.casa}
                  onClick={() => handleCheck('casa')}
                  disabled={AccommodationMutation.isLoading}
                />
              </div>
            </div>

            <div className='border-b py-6 px-6 sm:px-8 lg:px-10'>
              <label className='label !text-customBlackSidebar !text-sm uppercase'>
                Discounts
              </label>
              <div className='mt-3 flex gap-x-6 gap-y-2 flex-wrap'>
                <Checkbox
                  label='Specials only'
                  checked={check.specials}
                  onClick={() => handleCheck('specials')}
                  disabled={AccommodationMutation.isLoading}
                />
                <Checkbox
                  label='Earlybird discount'
                  checked={check.early_bird}
                  onClick={() => handleCheck('early_bird')}
                  disabled={AccommodationMutation.isLoading}
                />
              </div>
            </div>
          </div>
        </div>

        <div className='w-full overflow-x-auto py-[30px] px-6 sm:px-8 lg:px-10 pb-0 border-l'>
          {(AccommodationMutation.isLoading ||
            AccommodationMutation.isFetching) && <ListingCardSkeleton />}

          {!AccommodationMutation?.data?.data?.length &&
            !AccommodationMutation?.isFetching &&
            !AccommodationMutation?.isLoading && (
              <div className='bg-white h-[calc(100vh-390px)] flex flex-col justify-center'>
                <NoDataFound title='No accommodation found' />
              </div>
            )}

          {((!AccommodationMutation?.data?.data?.length > 0 &&
            !AccommodationMutation.isLoading) ||
            !AccommodationMutation.isFetching) && (
            <div className='full grid grid-cols-1 gap-6  sm:grid-cols-2 xl:grid-cols-3 pb-6 border-b'>
              {accommodations?.map((accommodation, index) => (
                <div
                  key={index}
                  className='col-span-1 rounded-lg cursor-pointer border hover:border-blueColor hover:shadow-lg'
                  onClick={() =>
                    navigate(`/accommodation/${accommodation?.id}`)
                  }
                >
                  <div className='relative'>
                    {accommodation?.has_room_special && (
                      <div className='block absolute z-[9] top-[7px] left-0 text-right shadow-[0px_0px_20px_0px_#00000080]'>
                        <img src={SpecialImg} alt='special' className='h-10' />
                      </div>
                    )}

                    <button
                      type='button'
                      className='absolute top-[7px] right-[10px] z-10 rounded-md'
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedAccommodation(accommodation);
                        setShowPriceModal(true);
                      }}
                    >
                      <EyeIcon className='w-[30px] h-[30px]' />
                    </button>
                    <img
                      src={
                        accommodation?.images?.find(
                          (item) => item?.image_type === '0'
                        )?.image_path
                      }
                      alt={accommodation?.name}
                      className='rounded-t-lg min-h-[160px] h-[190px] w-full object-cover'
                    />
                    {accommodation?.early_bird && (
                      <div className='absolute right-[10px] bottom-[10px] z-10 overflow-hidden bg-gradient-to-r from-customRed1 to-customRed2 px-[8px] py-[4px] rounded-md shadow-[0px_0px_20px_0px_#00000080]'>
                        <p className='text-xs font-medium text-white'>
                          Early Bird Discount
                        </p>
                      </div>
                    )}
                  </div>

                  <div className='flex justify-between items-center py-3 px-3.5'>
                    <div>
                      <p className='text-sm xl:text-base  font-semibold first-letter:uppercase text-customBlack max-w-[95%] line-clamp-2'>
                        {accommodation?.name}
                      </p>
                      <div className='flex mt-1'>
                        {[...Array(accommodation?.star_rating)].map(
                          (_, index) => (
                            <StarIcon
                              key={index}
                              className='text-yellow-400'
                              aria-hidden='true'
                              width={15}
                              height={15}
                            />
                          )
                        )}
                      </div>
                      <p className='text-sm first-letter:uppercase font-semibold text-blueColor max-w-[95%] mt-2.5 line-clamp-2'>
                        {accommodation?.city}
                      </p>
                    </div>

                    <div className='border rounded-md p-3.5 text-center min-w-[85px]'>
                      <p className='text-xs font-light'>From</p>
                      <p className='text-xl font-bold text-customBlue break-words'>
                        {CURRENCY} {accommodation?.price_start_from}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showPriceModal && (
        <CommonModal
          saveText='Verify'
          maxWidth='sm:max-w-3xl'
          ModalHeader={selectedAccommodation?.name}
          isOpen={showPriceModal}
          onClose={setShowPriceModal}
        >
          <PriceTableModal selectedAccommodation={selectedAccommodation} />
        </CommonModal>
      )}
    </div>
  );
};

export default Accommodations;
