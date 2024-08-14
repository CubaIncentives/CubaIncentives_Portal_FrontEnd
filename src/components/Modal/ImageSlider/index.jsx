import Slider from 'react-slick';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import PropTypes from 'prop-types';

import noImage from '@/assets/images/no-image.png';

const ImageSlider = (props) => {
  const {
    open,
    setOpen,
    images,
    modalSliderRef,
    setCurrentSlide,
    selectedImage,
  } = props;

  var settings = {
    dots: false,
    lazyLoad: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    beforeChange: (oldIndex, newIndex) => setCurrentSlide(newIndex),
  };

  return (
    <Dialog open={open} onClose={setOpen} className='relative z-20'>
      <DialogBackdrop
        transition
        className='fixed inset-0 bg-black/95 bg-opacity-90 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in'
      />

      <div className='fixed inset-0 z-10 w-screen overflow-y-auto'>
        <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
          <DialogPanel
            transition
            className='relative transform overflow-hidden rounded-lg bg-black/5 px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full max-w-7xl sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95'
          >
            <div className='absolute right-0 -top-4 hidden pr-4 pt-4 sm:block z-20'>
              <button
                type='button'
                onClick={() => setOpen(false)}
                className='rounded-md  text-white hover:text-gray-500 focus:outline-none focus:ring-0 focus:ring-indigo-500 focus:ring-offset-0'
              >
                <span className='sr-only'>Close</span>
                <XMarkIcon aria-hidden='true' className='h-6 w-6' />
              </button>
            </div>
            <div>
              {images && images.length > 1 ? (
                <Slider ref={modalSliderRef} {...settings}>
                  {images?.map((item) => (
                    <div className='text-center' key={item?.id}>
                      <img
                        id='myImg'
                        src={item?.image_path}
                        onError={(e) => {
                          e.target.src = noImage;
                        }}
                        alt='accommodation'
                        className='w-screen h-screen  max-h-[600px] object-contain !cursor-default !opacity-100'
                      />
                    </div>
                  ))}
                </Slider>
              ) : (
                <img
                  src={selectedImage}
                  onError={(e) => {
                    e.target.src = noImage;
                  }}
                  alt='accommodation'
                  className='w-screen  max-h-[600px] object-contain h-screen'
                />
              )}
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

ImageSlider.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  images: PropTypes.array,
  modalSliderRef: PropTypes.any,
  setCurrentSlide: PropTypes.any,
  selectedImage: PropTypes.string,
};

export default ImageSlider;
