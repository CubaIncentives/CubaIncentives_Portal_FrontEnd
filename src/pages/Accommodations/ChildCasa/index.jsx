import { useState } from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { useNavigate } from 'react-router-dom';
import { FaceFrownIcon } from '@heroicons/react/20/solid';
import { useQuery } from '@tanstack/react-query';
import PropTypes from 'prop-types';

import api from '@/utils/api';
import noImage from '@/assets/images/no-image.png';

const ChildCasa = (props) => {
  const { casaId } = props;
  const navigate = useNavigate();

  const [searchData, setSearchData] = useState('');
  const [casaData, setCasaData] = useState([]);

  const fetchAllParentAccommodations = async () => {
    let url = `/accommodation/agency?parent_id=${casaId}`;

    const res = await api.get(url);

    return res.data;
  };

  const { isLoading, isFetching } = useQuery(
    ['get-parent-accommodation', casaId],
    () => fetchAllParentAccommodations(),
    {
      enabled: !!casaId,
      onSuccess: (data) => {
        setCasaData(data?.data);
      },
      onError: () => {
        setCasaData([]);
      },
    }
  );

  const filteredCasa = casaData.filter((item) =>
    [item.location, item.name].some((field) =>
      field.toLowerCase().includes(searchData.toLowerCase())
    )
  );

  const renderCasaCard = (data) => {
    const findMainImage = data?.images.find((item) => item.image_type === '0');
    const imgUrl = findMainImage?.image_path ?? noImage;

    return (
      <div
        key={data.id}
        className='max-w-sm bg-white border border-gray-200 rounded-lg shadow cursor-pointer'
        onClick={() => navigate(`/accommodation/${data.id}`)}
      >
        <img
          className='rounded-t-lg w-screen max-w-sm h-screen object-cover max-h-44 border-b'
          src={imgUrl}
          alt={data.name}
        />
        <div className='p-2.5'>
          <h5 className='text-lg break-words font-bold tracking-tight text-gray-900'>
            {data.name}
          </h5>
          <p className='font-normal break-words text-gray-700'>
            {data.location}
          </p>
        </div>
      </div>
    );
  };

  if (isFetching || isLoading) {
    return (
      <div>
        <SkeletonTheme baseColor='#F2F4F7' highlightColor='#EAECF0'>
          <div className='w-full grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 pb-6'>
            {[...Array(3)].map((_, index) => (
              <Skeleton
                key={index}
                count={1}
                height={270}
                className='rounded-lg col-span-1 max-w-sm max-h-96 h-full w-full'
              />
            ))}
          </div>
        </SkeletonTheme>
      </div>
    );
  }

  return (
    <div className='flex gap-10 flex-col justify-center'>
      {casaData.length > 0 ? (
        <div className='relative'>
          <input
            type='search'
            onChange={(e) => setSearchData(e.target.value)}
            className='relative m-0 block w-full rounded-lg border border-solid border-neutral-200 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-surface outline-none transition duration-200 ease-in-out placeholder:text-neutral-500 focus:z-[3] focus:border-primary focus:shadow-inset focus:outline-none motion-reduce:transition-none'
            placeholder='Search'
            aria-label='Search'
            id='casa-search'
          />
        </div>
      ) : null}
      {filteredCasa.length > 0 ? (
        <div className='grid grid-cols-2 xl:grid-cols-3 gap-4 max-h-[540px] overflow-y-auto'>
          {filteredCasa.map(renderCasaCard)}
        </div>
      ) : (
        <div className='flex items-center gap-3'>
          <FaceFrownIcon className='h-5 w-5' />
          <span className='text-wrap break-words xl:text-lg lg:text-base font-extrabold text-[#585858] normal-case'>
            No data found
          </span>
        </div>
      )}
    </div>
  );
};

ChildCasa.propTypes = {
  casaId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default ChildCasa;
