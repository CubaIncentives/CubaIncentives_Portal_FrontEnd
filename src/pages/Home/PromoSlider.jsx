import { useRef } from 'react';
import Slider from 'react-slick';
import PromoSliderSkeleton from '@/skeletons/PromoSliderSkeleton';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/20/solid';
import PropTypes from 'prop-types';

import { Button } from '@/components/Common';
import { classNames } from '@/utils/helper';
import noImage from '@/assets/images/no-image.png';

const PromoSlider = (props) => {
  const { data, isLoading } = props;
  const slider = useRef(null);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    initialSlide: 0,
    fade: true,
    arrows: false,
    className: 'promo-slider',
    autoplay: true,
    autoplaySpeed: 7000,
    swipe: data && data.length > 1 ? true : false,
  };

  return isLoading ? (
    <PromoSliderSkeleton />
  ) : (
    <div className='w-full  promo-seaction  shadow-lg rounded-lg max-w-[1920px]'>
      {data && data.length > 0 ? (
        <Slider ref={slider} {...settings}>
          {data.map((promo) => {
            return (
              <div
                className='!flex !flex-row border rounded-lg'
                key={promo?.id}
              >
                <div className='w-8/12'>
                  <img
                    src={promo?.image}
                    onError={(e) => {
                      e.target.src = noImage;
                    }}
                    className='w-full 2xl:h-[482px] xl:h-[400px] lg:h-[300px] h-[300px] object-cover rounded-l-lg'
                    alt='cuba promos'
                  />
                </div>
                <div className='w-1/3 bg-[#D6E6FF] px-10 py-6 flex flex-col gap-6 justify-between'>
                  <div>
                    <h6 className='text-xl font-semibold text-center text-customBlack'>
                      NEWS
                    </h6>

                    <h1 className='font-semibold xl:text-lg text-base text-customBlack text-center line-clamp-5 pt-6 text-wrap break-words'>
                      {promo?.text ?? ''}
                    </h1>
                  </div>

                  <div
                    className={classNames(
                      'flex  items-center',
                      data.length > 1 ? 'justify-between' : 'justify-center'
                    )}
                  >
                    {data.length > 1 && (
                      <div className='bg-white p-3 rounded-full'>
                        <ArrowLeftIcon
                          aria-hidden='true'
                          onClick={() => slider?.current?.slickPrev()}
                          className='h-5 w-5 flex-shrink-0 text-customBlack cursor-pointer hover:text-black/40'
                        />
                      </div>
                    )}
                    <div>
                      <Button
                        isOutlined
                        className='text-base font-medium bg-customBlack px-8'
                        onClick={() => {
                          window.open(promo?.url ?? '');
                        }}
                      >
                        Read
                      </Button>
                    </div>
                    {data.length > 1 && (
                      <div className='bg-white p-3 rounded-full'>
                        <ArrowRightIcon
                          aria-hidden='true'
                          onClick={() => slider?.current?.slickNext()}
                          className='h-5 w-5 flex-shrink-0 text-customBlack cursor-pointer hover:text-black/40'
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </Slider>
      ) : null}
    </div>
  );
};

PromoSlider.propTypes = {
  data: PropTypes.array,
  isLoading: PropTypes.bool,
};

export default PromoSlider;
