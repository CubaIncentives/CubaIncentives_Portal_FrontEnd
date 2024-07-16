import React, { Fragment, useState } from 'react';
import TableSkeleton from '@/skeletons/TableSkeleton';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import PropTypes from 'prop-types';

import { CURRENCY } from '@/utils/constants';
import { classNames, sortedTimes } from '@/utils/helper';
import { ReactComponent as RightArrowIcon } from '@/assets/images/right-arrow.svg';
import { ReactComponent as TurnArrowIcon } from '@/assets/images/turn-arrow.svg';
import { ReactComponent as TwoWayArrowIcon } from '@/assets/images/two-way-arrow.svg';

import Badge from './Badge';

const getNestedValue = (obj, path) => {
  return path?.split('.').reduce((acc, part) => acc && acc[part], obj);
};

const CommonTable = ({
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

  return (
    <table className='shadow-none price-table min-w-full divide-y divide-gray-200 overflow-hidden'>
      <thead>
        {headers && data?.length > 0 && (
          <tr className='bg-white text-left border-b hover:bg-blue-50'>
            {headers?.map((header, index) => (
              <th
                key={index}
                scope='col'
                className={classNames(
                  'p-3 hover:bg-blue-300 text-sm hover:text-white',
                  header?.className,
                  hoveredElement === 'mh' + index ? 'highlight' : ''
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
          <tr className='hover:bg-blue-50'>
            {name === 'private_transfer' && <th className='max-w-[2%]'></th>}
            {subHeaders?.map((subHeader, index) => (
              <th
                key={index}
                scope='col'
                className={classNames(
                  'p-3 whitespace-nowrap text-sm font-semibold text-left hover:bg-blue-300 hover:text-white',
                  subHeader?.className,
                  hoveredElement === 'sh' + (index + headers?.length)
                    ? 'highlight'
                    : ''
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
                    'hover:bg-blue-50 border-b',
                    item?.stops && item?.stops?.length > 0 && 'cursor-pointer'
                  )}
                  onClick={() => toggleDescription(item?.id)}
                >
                  {item?.stops && (
                    <td className='max-w-[2%] py-3 text-gray-600 hover:bg-blue-300 hover:text-white'>
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
                          'whitespace-nowrap p-3 text-sm text-gray-600 break-words text-wrap first-letter:uppercase group hover:bg-blue-300 hover:text-white',
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
                          column.side === 'right' ? (
                            <RightArrowIcon className='w-4 h-4 text-black group-hover:text-white mt-[0.2rem]' />
                          ) : (
                            <TwoWayArrowIcon className='w-4 h-4 text-black group-hover:text-white mt-[0.2rem]' />
                          )
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
                            `${CURRENCY} ${value}`
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
                        'hover:bg-blue-50 border-dashed border-b',
                        activeId[item?.id] ? 'block' : '!hidden'
                      )}
                    >
                      <td className='max-w-[2%]'></td>
                      {stopHeaders?.map((column, index) => {
                        const value = getNestedValue(stop, column.key);

                        return (
                          <td
                            key={index}
                            className={classNames(
                              'whitespace-nowrap p-3 text-sm text-gray-400 break-words text-wrap first-letter:uppercase group hover:bg-blue-300 hover:text-white',
                              hoveredElement ===
                                'sd' + (stopHeaders?.length + index)
                                ? 'highlight'
                                : '',
                              column.className
                            )}
                            onMouseEnter={() =>
                              handleMouseEnter(
                                'sd' + (stopHeaders?.length + index)
                              )
                            }
                            onMouseLeave={handleMouseLeave}
                          >
                            {column.key === 'to_text' ? (
                              <span className='flex gap-2 text-xs'>
                                <TurnArrowIcon className='w-3 h-3 text-gray-400 group-hover:text-white' />
                                Stop at {stop?.stop_location?.name}
                              </span>
                            ) : value ? (
                              column.key.includes('price') ? (
                                `${CURRENCY} ${value}`
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
  headers: PropTypes.array,
  subHeaders: PropTypes.array,
  stopHeaders: PropTypes.array,
  data: PropTypes.array,
  showSkeleton: PropTypes.bool,
  name: PropTypes.string,
};

export default CommonTable;
