import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useQuery } from '@tanstack/react-query';

import api from '@/utils/api';
import { PAGE_TITLE_SUFFIX } from '@/utils/constants';

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

        <div className='flex justify-center pb-5'>
          <div className='flex justify-between flex-row pt-12 h-full max-h-[680px] gap-5 w-full max-w-[1920px]'>
            <div className='xl:w-4/5 lg:w-[70%] flex flex-col justify-start '>
              <Notifications />
            </div>
            <div className='xl:w-[20%] lg:w-1/3 flex justify-end'>
              <SpecialPrice
                isLoading={isLoading || isFetching}
                isShowViewMoreSpecialPrice={isShowViewMoreSpecialPrice}
                data={homePageData?.accommodationSpecial ?? []}
              />
            </div>
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
