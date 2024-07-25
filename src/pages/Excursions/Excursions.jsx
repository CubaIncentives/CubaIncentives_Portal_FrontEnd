import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import ListingCardSkeleton from '@/skeletons/ListingCardSkeleton';
import { useMutation } from '@tanstack/react-query';

import { SearchableSelect, SearchInput } from '@/components/Common';
import NoDataFound from '@/components/Common/NoDataFound';
import ExcursionsCard from '@/components/ExcursionsCard';
import api from '@/utils/api';
import { PAGE_TITLE_SUFFIX } from '@/utils/constants';
import {
  capitalize,
  classNames,
  customSearchableSelectOptions,
} from '@/utils/helper';

const Excursions = () => {
  const navigate = useNavigate();
  const [excursions, setExcursions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [allLocations, setAllLocations] = useState([]);
  const [searchParam, setSearchParam] = useState('');

  const fetchAllExcursions = async (location, searchParam) => {
    let url = '/excursion/agency';

    const params = [];

    if (location) {
      params.push(`location=${location?.value}`);
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

  const ExcursionsMutation = useMutation({
    mutationFn: ({ location, searchParam }) =>
      fetchAllExcursions(location, searchParam),
  });

  const handleSelect = (selectedLocation) => {
    setSelectedLocation(selectedLocation);

    ExcursionsMutation.mutate(
      { location: selectedLocation, searchParam },
      {
        onSuccess: (data) => {
          setExcursions(data?.data);
        },
      }
    );
  };

  useEffect(() => {
    let delayDebounceFn;

    if (searchParam) {
      if (searchParam.length > 1) {
        delayDebounceFn = setTimeout(() => {
          ExcursionsMutation.mutate(
            {
              location: selectedLocation,
              searchParam,
            },
            {
              onSuccess: (data) => {
                setExcursions(data?.data);
              },
            }
          );
        }, 800);
      }
    } else {
      ExcursionsMutation.mutate(
        {
          location: selectedLocation,
          searchParam,
        },
        {
          onSuccess: (data) => {
            setExcursions(data?.data);

            const sortedLocations = data?.data;

            const onlyLocations = sortedLocations?.map((item) =>
              capitalize(item.location)
            );

            setAllLocations(
              customSearchableSelectOptions([...new Set(onlyLocations)])
            );
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
        <title>Excursions {PAGE_TITLE_SUFFIX}</title>
      </Helmet>
      <div className='flex w-full'>
        <div className='w-full xl:max-w-xs lg:max-w-[22%] max-w-[30%]'>
          <div className='duration-300 relative min-h-[calc(100vh-117px)] p-6'>
            <SearchInput
              label='Search'
              name='searchParam'
              labelClassName='!text-sm xl:!text-base uppercase'
              type='text'
              value={searchParam}
              placeholder='Search by name or city...'
              onChange={(e) => setSearchParam(e.target.value)}
              setSearchTerm={setSearchParam}
              disabled={ExcursionsMutation.isLoading}
            />

            <div className='mt-4'>
              <SearchableSelect
                label='Location'
                labelClassName='!text-sm xl:!text-base uppercase'
                placeholder='Select location'
                options={allLocations}
                onChange={(e) => {
                  handleSelect(e, 'location');
                }}
                loading={ExcursionsMutation.isLoading}
                disabled={ExcursionsMutation.isLoading}
              />
            </div>
          </div>
        </div>
        <div className='w-full overflow-x-auto p-6 pb-0 h-[calc(100vh-117px)] shadow-md border-l'>
          {(ExcursionsMutation.isLoading || ExcursionsMutation.isFetching) && (
            <ListingCardSkeleton />
          )}

          {!ExcursionsMutation?.data?.data?.length &&
            !ExcursionsMutation?.isFetching &&
            !ExcursionsMutation?.isLoading && (
              <div className='bg-white h-[calc(100vh-390px)] flex flex-col justify-center'>
                <NoDataFound title='No excursion found' />
              </div>
            )}

          {((ExcursionsMutation?.data?.data?.length > 0 &&
            !ExcursionsMutation.isLoading) ||
            !ExcursionsMutation.isFetching) &&
            excursions?.map((location, index) => (
              <div
                key={index}
                className={classNames(
                  'pt-4 pb-6 border-b',
                  index === 0 && 'pt-0'
                )}
              >
                <p className='text-2xl font-medium first-letter:uppercase'>
                  {location?.location}
                </p>
                <div className='w-full mt-2 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3'>
                  <ExcursionsCard excursions={location?.location_excursions} />
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Excursions;
