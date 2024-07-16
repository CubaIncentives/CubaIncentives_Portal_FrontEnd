import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/20/solid';
import PropTypes from 'prop-types';

import { classNames } from '@/utils/helper';

const CommonModal = ({
  maxWidth,
  isOverflow = false,
  ModalHeader,
  children,
  isOpen,
  onClose,
}) => {
  return (
    <Transition.Root appear show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-[99]' onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-gray-900 opacity-70' />
        </Transition.Child>

        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <div
                className={classNames(
                  isOverflow ? 'overflow-visible' : 'overflow-hidden',
                  maxWidth,
                  'relative transform rounded-xl bg-white text-left shadow-xl transition-all sm:w-full'
                )}
              >
                <div className='absolute right-0 top-0 hidden pr-6 pt-4 sm:block'>
                  <button
                    type='button'
                    className='rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none border hover:border-gray-300 focus:border-gray-300'
                    onClick={() => onClose(false)}
                  >
                    <span className='sr-only'>Close</span>
                    <XMarkIcon className='h-6 w-6' aria-hidden='true' />
                  </button>
                </div>

                <div className={`text-center sm:text-left`}>
                  <Dialog.Title
                    as='h1'
                    className='text-xl font-semibold leading-6 pl-6 py-5 first-letter:uppercase'
                  >
                    {ModalHeader ?? ''}
                  </Dialog.Title>
                  <hr className='border border-gray-300' />

                  {/* BODY */}
                  <div className='z-10 p-6'>{children}</div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

CommonModal.propTypes = {
  maxWidth: PropTypes.string,
  isOverflow: PropTypes.bool,
  ModalHeader: PropTypes.string,
  children: PropTypes.node,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

export default CommonModal;
