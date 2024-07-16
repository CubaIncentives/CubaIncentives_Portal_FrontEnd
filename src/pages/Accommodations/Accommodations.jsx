import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import ListingCardSkeleton from '@/skeletons/ListingCardSkeleton';
import { EyeIcon, StarIcon } from '@heroicons/react/20/solid';
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
        <div>
          <div className='w-[270px] duration-300 relative min-h-[calc(100vh-117px)] p-6'>
            <SearchInput
              label='Search'
              name='searchParam'
              type='text'
              value={searchParam}
              placeholder='Search by name or city...'
              onChange={(e) => setSearchParam(e.target.value)}
              setSearchTerm={setSearchParam}
              disabled={AccommodationMutation.isLoading}
            />

            <div className='mt-4'>
              <SearchableSelect
                label='Location'
                placeholder='Select location'
                options={allLocations}
                onChange={(e) => {
                  handleSelect(e, 'location');
                }}
                loading={AccommodationMutation.isLoading}
                disabled={AccommodationMutation.isLoading}
              />
            </div>

            <div className='mt-4'>
              <SearchableSelect
                label='Chain'
                placeholder='Select chain'
                options={allChains}
                onChange={(e) => {
                  handleSelect(e, 'chain');
                }}
                disabled={AccommodationMutation.isLoading}
              />
            </div>

            <div className='mt-4'>
              <label className='label'>Type</label>
              <div className='mt-1.5'>
                <Checkbox
                  label='Hotel'
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
                <Checkbox
                  label='Specials only'
                  checked={check.specials}
                  onClick={() => handleCheck('specials')}
                  disabled={AccommodationMutation.isLoading}
                />
              </div>
            </div>
          </div>
        </div>

        <div className='w-full overflow-x-auto p-6 pb-0 h-[calc(100vh-117px)] shadow-md border-l'>
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
            <div className='full mt-2 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 pt-4 pb-6 border-b'>
              {accommodations?.map((accommodation, index) => (
                <div
                  key={index}
                  className='col-span-1 rounded-lg cursor-pointer border hover:border-palette4 hover:shadow-lg relative overflow-hidden'
                  onClick={() =>
                    navigate(`/accommodation/${accommodation?.id}`)
                  }
                >
                  <div className='block absolute z-[9] -top-[5px] -right-[5px] overflow-hidden w-[75px] h-[75px] text-right'>
                    {accommodation?.has_room_special && (
                      <span className='text-xs text-white uppercase text-center rotate-45 bg-gradient-custom px-3 py-1 w-[100px] block absolute top-[19px] -right-[21px]'>
                        Special
                      </span>
                    )}
                  </div>
                  <img
                    src={
                      accommodation?.images?.find(
                        (item) => item?.image_type === '0'
                      )?.image_path
                    }
                    alt={accommodation?.name}
                    className='rounded-t-lg min-h-[160px] h-[190px] w-full object-cover'
                  />
                  {accommodation?.price_start_from && (
                    <div className='absolute right-[3px] bottom-[81px] z-10 overflow-hidden bg-[#283d5b] text-white px-[6px] py-[4px] rounded-sm text-sm min-w-[50px]'>
                      <span className='text-xs block'>From</span>
                      {CURRENCY} {accommodation?.price_start_from}
                    </div>
                  )}

                  <div className='py-3 px-4'>
                    <p className='font-semibold first-letter:uppercase'>
                      {accommodation?.name}
                    </p>
                    <div className='flex justify-between items-center'>
                      <div className='flex items-center'>
                        <p className='text-sm first-letter:uppercase'>
                          {accommodation?.city}
                        </p>
                        <div className='flex ml-4'>
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
                      </div>
                      <button
                        type='button'
                        className='z-10 border border-palette4 rounded-md p-1 px-1.5 group hover:bg-palette4'
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedAccommodation(accommodation);
                          setShowPriceModal(true);
                        }}
                      >
                        <EyeIcon className='w-5 h-5 text-palette4 group-hover:text-white' />
                      </button>
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
