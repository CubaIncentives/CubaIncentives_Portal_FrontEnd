import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

import { Button } from '@/components/Common';
import { PAGE_TITLE_SUFFIX } from '@/utils/constants';
import GroupTransferImg from '@/assets/images/group_transfer.jpg';
import PrivateTransferImg from '@/assets/images/private_transfer.jpg';
import ViazulImg from '@/assets/images/viazul.jpg';

const Transport = () => {
  const transports = [
    {
      name: 'Private transfers',
      img: PrivateTransferImg,
      to: '/transport/private-transfer',
    },
    {
      name: 'Group transfers',
      img: GroupTransferImg,
      to: '/transport/group-transfer',
    },
    {
      name: 'Viazul',
      img: ViazulImg,
      to: '/transport/viazul',
    },
  ];

  return (
    <div className='w-full mx-auto max-w-6xl overflow-x-auto p-6 py-10 h-[calc(100vh-117px)]'>
      <Helmet>
        <meta charSet='utf-8' />
        <title>Transport {PAGE_TITLE_SUFFIX}</title>
      </Helmet>
      <div className='w-full grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        {transports.map((transport, index) => (
          <Link
            key={index}
            to={transport.to}
            className='col-span-1 rounded-lg bg-white cursor-pointer border hover:border-blueColor hover:shadow-lg'
          >
            <img
              src={transport.img}
              alt={transport.name}
              className='rounded-t-lg object-cover min-h-[160px] w-full'
            />
            <div className='flex justify-between items-center py-3 px-4'>
              <p className='font-semibold text-sm lg:text-base'>
                {transport?.name}
              </p>
              <div>
                <Button size='sm' type='button' className='lg:text-sm text-xs'>
                  View Routes
                </Button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Transport;