import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import ListingCardSkeleton from '@/skeletons/ListingCardSkeleton';
import { useMutation } from '@tanstack/react-query';

import AccommodationsCard from '@/components/AccommodationsCard';
import { Checkbox, SearchableSelect, SearchInput } from '@/components/Common';
import NoDataFound from '@/components/Common/NoDataFound';
import api from '@/utils/api';
import { PAGE_TITLE_SUFFIX } from '@/utils/constants';
import { capitalize, customSearchableSelectOptions } from '@/utils/helper';

const Accommodations = () => {
  const queryParams = new URLSearchParams(location.search);
  const discount = queryParams.get('discount');

  const [accommodations, setAccommodations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedChain, setSelectedChain] = useState(null);
  const [allLocations, setAllLocations] = useState([]);
  const [allChains, setAllChains] = useState([]);
  const [searchParam, setSearchParam] = useState('');
  const [check, setCheck] = useState({
    hotel: false,
    casa: false,
    specials: discount ? true : false,
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
    <div className='flex justify-center'>
      <div className='w-full max-w-[1920px]'>
        <Helmet>
          <meta charSet='utf-8' />
          <title>Accommodations {PAGE_TITLE_SUFFIX}</title>
        </Helmet>
        <div className='flex w-full'>
          <div className='w-full xl:max-w-xs lg:max-w-[24%] max-w-[30%]'>
            <div className='duration-300 relative min-h-[calc(100vh-170px)] mt-[30px]'>
              <div className='border-b pb-6 px-6 sm:px-8 lg:px-4 xl:px-10 min-[2000px]:pl-0'>
                <SearchInput
                  label='SEARCH'
                  name='searchParam'
                  type='text'
                  value={searchParam}
                  placeholder='Search by name or city...'
                  onChange={(e) => setSearchParam(e.target.value)}
                  setSearchTerm={setSearchParam}
                  labelClassName='!text-customBlackSidebar !text-sm xl:!text-base uppercase'
                  inputMarginTop='mt-3'
                />
              </div>

              <div className='border-b py-6 px-6 sm:px-8 lg:px-4 xl:px-10 min-[2000px]:pl-0'>
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

              <div className='border-b py-6 px-6 sm:px-8 lg:px-4 xl:px-10 min-[2000px]:pl-0'>
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

              <div className='border-b py-6 px-6 sm:px-8 lg:px-4 xl:px-10 min-[2000px]:pl-0'>
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

              <div className='border-b py-6 px-6 sm:px-8 lg:px-4 xl:px-10 min-[2000px]:pl-0'>
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

          <div className='w-full overflow-x-auto py-[30px] px-6 xl:px-4  2xl:px-10 pb-0 border-l'>
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
              <div className='full grid grid-cols-1 gap-6  sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 pb-6 border-b'>
                <AccommodationsCard accommodations={accommodations} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accommodations;
