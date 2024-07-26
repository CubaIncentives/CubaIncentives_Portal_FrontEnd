import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useQuery } from '@tanstack/react-query';

import api from '@/utils/api';
import { PAGE_TITLE_SUFFIX } from '@/utils/constants';
import { classNames } from '@/utils/helper';

import LatestRecord from './LatestRecord';
import Notifications from './Notifications';
import PromoSlider from './PromoSlider';
import SpecialPrice from './SpecialPrice';

const Home = () => {
  const [homePageData, setHomePageData] = useState(null);
  const [isShowViewMoreSpecialPrice, setViewMoreSpecialPrice] = useState(false);
  const getCompanyData = async () => {
    const res = await api.get(`/dashboard/data`);

    return res.data;
  };

  const { isLoading, isFetching } = useQuery(
    ['dashboard'],
    () => getCompanyData(),
    {
      onSuccess: (data) => {
        const response = data?.data;

        setViewMoreSpecialPrice(data?.meta?.totalSpecials > 2 ? true : false);
        setHomePageData(response);
      },
    }
  );

  return (
    <div className='flex flex-row'>
      <Helmet>
        <meta charSet='utf-8' />
        <title>Home {PAGE_TITLE_SUFFIX}</title>
      </Helmet>

      <div className='main-container w-4/5 '>
        <div className='flex justify-center '>
          <PromoSlider
            isLoading={isLoading || isFetching}
            data={homePageData?.promos ?? []}
          />
        </div>

        <div className='flex justify-center'>
          <div className='flex justify-between flex-row lg:flex-wrap xl:flex-nowrap 2xl:py-[50px] py-10 2xl:gap-[60px] xl:gap-10 lg:gap-8 w-full max-w-[1920px] '>
            <div
              className={classNames(
                ' flex flex-col justify-start',
                homePageData?.accommodationSpecial.length > 0
                  ? '2xl:w-4/5 xl:w-9/12 lg:w-full'
                  : 'w-full'
              )}
            >
              <Notifications />
            </div>
            {homePageData?.accommodationSpecial.length > 0 ? (
              <div className='2xl:w-1/4 xl:w-1/3 lg:w-full  justify-end flex lg:flex-col '>
                <SpecialPrice
                  isLoading={isLoading || isFetching}
                  isShowViewMoreSpecialPrice={isShowViewMoreSpecialPrice}
                  data={homePageData?.accommodationSpecial ?? []}
                />
              </div>
            ) : null}
          </div>
        </div>

        <LatestRecord
          data={{
            accommodations: homePageData?.accommodations ?? [],
            excursions: homePageData?.excursions ?? [],
          }}
          isLoading={isLoading || isFetching}
        />
      </div>
    </div>
  );
};

export default Home;
