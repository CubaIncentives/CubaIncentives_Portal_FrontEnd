import React, { Fragment, useEffect, useState } from 'react';
import TableSkeleton from '@/skeletons/TableSkeleton';
import { ArrowLongRightIcon, ChevronDownIcon } from '@heroicons/react/20/solid';
import PropTypes from 'prop-types';

import { CURRENCY } from '@/utils/constants';
import { classNames, sortedTimes } from '@/utils/helper';
import { ReactComponent as TransportArrowIcon } from '@/assets/images/arrows-left-right-solid.svg';
import { ReactComponent as TwowayArrowIcon } from '@/assets/images/fork_left.svg';

import Badge from './Badge';

const getNestedValue = (obj, path) => {
  return path?.split('.').reduce((acc, part) => acc && acc[part], obj);
};

const CommonTable = ({
  isNormalHover = false,
  headers,
  subHeaders,
  stopHeaders = [],
  data,
  showSkeleton,
  name = '',
}) => {
  const [hoveredElement, setHoveredElement] = useState(null);
  const [activeId, setActiveId] = useState({});

  const handleMouseEnter = (value) => {
    setHoveredElement(value);
  };

  const handleMouseLeave = () => {
    setHoveredElement(null);
  };

  const toggleDescription = (transferId) => {
    setActiveId((prevOpenRows) => ({
      ...prevOpenRows,
      [transferId]: !prevOpenRows[transferId],
    }));
  };

  useEffect(() => {
    if (data && data.length > 0) {
      let openListOfData = {};

      data &&
        data?.forEach((item) => {
          if (item?.stops && item?.stops.length > 0) {
            openListOfData[item?.id] = true;
          }
        });

      if (Object.keys(openListOfData).length > 0) {
        setActiveId(openListOfData);
      }
    }
  }, [data]);

  return (
    <table className='shadow-none price-table min-w-full divide-y divide-gray-200 overflow-hidden'>
      <thead>
        {headers && data?.length > 0 && (
          <tr
            className={classNames(
              'bg-[#EFEFEF] text-left border-b ',
              !isNormalHover ? 'hover:bg-[#fff9e6]' : ''
            )}
          >
            {name === 'private_transfer' && <th className='max-w-[2%]'></th>}
            {headers?.map((header, index) => (
              <th
                key={index}
                scope='col'
                className={classNames(
                  'p-3  text-sm',
                  header?.className,
                  !isNormalHover && hoveredElement === 'mh' + index
                    ? 'highlight'
                    : '',
                  !isNormalHover ? 'hover:bg-secondaryColor' : ''
                )}
                colSpan={header?.colSpan || 1}
                onMouseEnter={() => handleMouseEnter('mh' + index)}
                onMouseLeave={handleMouseLeave}
              >
                {header?.label}
              </th>
            ))}
          </tr>
        )}
        {data?.length > 0 && (
          <tr
            className={classNames(
              'bg-[#EFEFEF]',
              !isNormalHover ? ' hover:bg-[#fff9e6]' : ''
            )}
          >
            {name === 'private_transfer' && <th className='max-w-[2%]'></th>}
            {subHeaders?.map((subHeader, index) => (
              <th
                key={index}
                scope='col'
                className={classNames(
                  'p-3 whitespace-nowrap text-sm font-semibold text-left ',
                  subHeader?.className,
                  !isNormalHover &&
                    hoveredElement === 'sh' + (index + headers?.length)
                    ? 'highlight'
                    : '',
                  !isNormalHover ? ' hover:bg-secondaryColor' : ''
                )}
                onMouseEnter={() =>
                  handleMouseEnter('sh' + (index + headers?.length))
                }
                onMouseLeave={handleMouseLeave}
              >
                {subHeader?.label}
              </th>
            ))}
          </tr>
        )}
      </thead>
      <tbody>
        {showSkeleton ? (
          data?.length > 0 ? (
            data?.map((item) => (
              <Fragment key={item?.id}>
                <tr
                  className={classNames(
                    'border-b',
                    !isNormalHover
                      ? ' hover:bg-[#fff9e6]'
                      : 'hover:bg-gray-100',
                    item?.stops && item?.stops?.length > 0 && 'cursor-pointer'
                  )}
                  onClick={() => toggleDescription(item?.id)}
                >
                  {item?.stops && (
                    <td
                      className={classNames(
                        'max-w-[2%] py-3 text-gray-600 ',
                        !isNormalHover ? ' hover:bg-secondaryColor' : ''
                      )}
                    >
                      {item?.stops?.length > 0 && (
                        <ChevronDownIcon
                          className={classNames(
                            'h-5 w-5 transform transition-transform',
                            activeId[item?.id] ? '-rotate-180' : 'rotate-0'
                          )}
                        />
                      )}
                    </td>
                  )}

                  {subHeaders?.map((column, index) => {
                    const value = getNestedValue(item, column.key);

                    return (
                      <td
                        key={index}
                        className={classNames(
                          'whitespace-nowrap p-3 text-sm text-gray-600 break-words text-wrap first-letter:uppercase group ',
                          !isNormalHover ? ' hover:bg-secondaryColor' : '',
                          !isNormalHover &&
                            hoveredElement === 'gd' + (headers?.length + index)
                            ? 'highlight'
                            : '',
                          column.className
                        )}
                        onMouseEnter={() =>
                          handleMouseEnter('gd' + (headers?.length + index))
                        }
                        onMouseLeave={handleMouseLeave}
                      >
                        {column.key === 'separator' ? (
                          <div className='flex justify-center'>
                            {name === 'private_transfer' ? (
                              <TransportArrowIcon className='w-4 h-4 mt-[0.2rem]' />
                            ) : (
                              <ArrowLongRightIcon className='w-5 h-5 text-black' />
                            )}
                          </div>
                        ) : column.key.includes('time') ? (
                          Array.isArray(value) && value?.length > 0 ? (
                            <div className='flex gap-1 flex-wrap'>
                              {sortedTimes(value)?.map((time, index) => (
                                <Badge
                                  size='sm'
                                  key={index}
                                  className='bg-yellow-50 font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20'
                                >
                                  {time}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <Badge
                              size='sm'
                              className='bg-yellow-50 font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20'
                            >
                              {value}
                            </Badge>
                          )
                        ) : value ? (
                          column.key.includes('price') ? (
                            <span className='text-customBlue font-semibold group-hover:font-extrabold'>
                              {CURRENCY} {value}
                            </span>
                          ) : (
                            value
                          )
                        ) : (
                          'N/A'
                        )}
                      </td>
                    );
                  })}
                </tr>

                {item?.stops &&
                  item?.stops?.length > 0 &&
                  item?.stops?.map((stop) => (
                    <tr
                      key={stop?.id}
                      className={classNames(
                        !isNormalHover ? ' hover:bg-[#fff9e6]' : '',
                        'border-dashed border-b',
                        activeId[item?.id] ? 'block' : '!hidden'
                      )}
                    >
                      <td className='max-w-[2%]'></td>
                      <td className='max-w-[15%]'></td>
                      <td className='max-w-[6.2%]'></td>
                      {stopHeaders?.map((column, index) => {
                        const value = getNestedValue(stop, column.key);

                        return (
                          <td
                            key={index}
                            className={classNames(
                              'whitespace-nowrap p-3 text-sm break-words text-wrap first-letter:uppercase group  max-w-[14%]',
                              !isNormalHover ? ' hover:bg-secondaryColor' : '',
                              !isNormalHover &&
                                hoveredElement ===
                                  'sd' + (stopHeaders?.length + index)
                                ? 'highlight'
                                : '',
                              column.className,
                              ''
                            )}
                            onMouseEnter={() =>
                              handleMouseEnter(
                                'sd' + (stopHeaders?.length + index)
                              )
                            }
                            onMouseLeave={handleMouseLeave}
                          >
                            {column.key === 'to_text' ? (
                              <span className='flex gap-2 text-xs text-[#7e7e8c] flex-wrap break-words text-wrap'>
                                <TwowayArrowIcon className='w-3 h-3' />{' '}
                                {stop?.stop_duration ?? ''} &nbsp;stop at{' '}
                                {stop?.stop_location?.name ?? '-'}
                              </span>
                            ) : value ? (
                              column.key.includes('price') ? (
                                <span className='text-[#8AB0F7] font-semibold group-hover:font-extrabold'>
                                  {CURRENCY} {value}
                                </span>
                              ) : (
                                value
                              )
                            ) : (
                              'N/A'
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
              </Fragment>
            ))
          ) : (
            <tr>
              <td className='p-3 text-gray-500 font-medium'>
                No data available
              </td>
            </tr>
          )
        ) : (
          <TableSkeleton />
        )}
      </tbody>
    </table>
  );
};

CommonTable.propTypes = {
  isNormalHover: PropTypes.bool,
  headers: PropTypes.array,
  subHeaders: PropTypes.array,
  stopHeaders: PropTypes.array,
  data: PropTypes.array,
  showSkeleton: PropTypes.bool,
  name: PropTypes.string,
};

export default CommonTable;
