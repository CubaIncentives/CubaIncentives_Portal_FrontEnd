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
    // autoplay: true,
    // autoplaySpeed: 7000,
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
                <div className='2xl:w-1/3 w-2/5 bg-[#D6E6FF] px-10 py-6 flex flex-col gap-6 justify-between'>
                  <div>
                    <h6 className=' xl:text-3xl lg:text-lg text-lg font-semibold text-center text-customBlack manrope'>
                      NEWS
                    </h6>

                    <h1 className='font-semibold 2xl:text-5xl 2xl:!leading-[66px] xl:text-4xl xl:!leading-[50px] lg:text-xl lg:!leading-9 text-xl text-customBlack text-center xl:line-clamp-4  line-clamp-3 xl:pt-6 pt-4 text-wrap break-words manrope '>
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
                      <div
                        className='bg-white 2xl:p-5 xl:p-3.5 lg:p-2 rounded-full text-customBlack hover:text-black/40'
                        role='button'
                        onClick={() => slider?.current?.slickNext()}
                      >
                        <ArrowLeftIcon
                          aria-hidden='true'
                          className='2xl:h-6 2xl:w-6 lg:h-5 lg:w-5 flex-shrink-0  cursor-pointer '
                        />
                      </div>
                    )}
                    <div>
                      <Button
                        isOutlined
                        className='xl:text-xl text-base rounded-lg font-medium bg-customBlack px-8 2xl:py-4 xl:py-3 py-2'
                        onClick={() => {
                          window.open(promo?.url ?? '');
                        }}
                      >
                        Read
                      </Button>
                    </div>
                    {data.length > 1 && (
                      <div
                        className='bg-white 2xl:p-5 xl:p-3.5 lg:p-2 rounded-full text-customBlack hover:text-black/40'
                        role='button'
                        onClick={() => slider?.current?.slickNext()}
                      >
                        <ArrowRightIcon
                          aria-hidden='true'
                          // onClick={() => slider?.current?.slickNext()}
                          className='2xl:h-6 2xl:w-6 lg:h-5 lg:w-5 flex-shrink-0 '
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
