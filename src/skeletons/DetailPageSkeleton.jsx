import Skeleton from 'react-loading-skeleton';
import PropTypes from 'prop-types';

const DetailPageSkeleton = (props) => {
  const { pageName } = props;

  return (
    <div className='bg-white p-4 mb-4'>
      <Skeleton count={1} className='max-w-[10%] mb-5' height={30} />
      {pageName !== 'carRental' ? (
        <>
          <div className='flex flex-wrap justify-between gap-2 pt-4  mb-4'>
            <div className='flex lg:flex-nowrap flex-wrap gap-4 2xl:w-10/12  xl:w-5/6 lg:w-10/12  w-full'>
              <Skeleton
                count={1}
                width={400}
                className=' max-w-[400px] max-h-[280px] rounded-lg  '
                height={280}
              />
              <div className='2xl:w-11/12  w-screen'>
                <Skeleton count={1} height={30} className='max-w-[50%]' />

                <Skeleton count={7} height={30} className=' ' />
              </div>
            </div>
            <div className='lg:w-[15%] w-1/5'>
              <div className='flex gap-2 justify-end'>
                <Skeleton
                  count={2}
                  width={60}
                  height={30}
                  containerClassName='flex flex-1 gap-2'
                />
              </div>
            </div>
          </div>
          <div className='mt-4'>
            <div className='grid 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 gap-4 items-start'>
              {Array.from({
                length: pageName === 'accommodation' ? 8 : 10,
              }).map((_, index) => (
                <div
                  className='flex gap-2 items-center justify-start'
                  key={index}
                >
                  <Skeleton width={80} height={20} />
                  <Skeleton
                    height={20}
                    className='max-w-[80%] w-full'
                    containerClassName='w-full'
                  />
                </div>
              ))}
            </div>

            <div className='py-4 flex flex-col gap-4'>
              {pageName === 'accommodation' ? (
                <Skeleton width={80} height={20} />
              ) : null}
              <div className='flex gap-4'>
                <Skeleton width={80} height={20} />
                <div className='0 flex flex-wrap gap-2'>
                  {Array.from({ length: 8 }).map((_, index) => (
                    <div
                      className='flex gap-2 items-center justify-start'
                      key={index}
                    >
                      <Skeleton width={80} height={20} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className='flex items-center justify-between w-full'>
            <Skeleton
              containerClassName='flex flex-1 gap-2 max-w-[19%]'
              height={30}
            />

            <div>
              <div className='flex gap-2 justify-end'>
                <Skeleton
                  count={3}
                  width={60}
                  height={30}
                  containerClassName='flex flex-1 gap-2'
                />
              </div>
            </div>
          </div>
          <div className='mt-6 flex border-[#E4E5E8] gap-6'>
            <Skeleton
              count={1}
              width={400}
              className=' max-w-[400px] max-h-[280px] rounded-lg  '
              height={280}
            />
            <div className='w-screen'>
              <Skeleton count={4} height={30} className='max-w-[100%]' />
              <div className='grid grid-cols-3 gap-1 place-content-start mt-3 xl:max-w-[50%]'>
                {Array.from({
                  length: 2,
                }).map((_, index) => (
                  <div
                    className='flex gap-3 items-center justify-start'
                    key={index}
                  >
                    <Skeleton width={20} height={20} />
                    <Skeleton height={20} width={30} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

DetailPageSkeleton.propTypes = {
  pageName: PropTypes.string,
};

export default DetailPageSkeleton;
