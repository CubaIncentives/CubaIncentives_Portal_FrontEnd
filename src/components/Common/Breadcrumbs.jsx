import { ChevronLeftIcon } from '@heroicons/react/20/solid';
import PropTypes from 'prop-types';

import { classNames } from '@/utils/helper';

const Breadcrumbs = (props) => {
  const { pages } = props;
  let index = 0;

  return (
    <nav aria-label='Breadcrumb' className='flex'>
      <ol role='list' className='flex items-center space-x-1'>
        {pages.map((page) => {
          index++;

          return (
            <li key={page.name}>
              <div className='flex items-center'>
                <a
                  href={page?.href}
                  aria-current={page?.current ? 'page' : undefined}
                  className={classNames(
                    'xl:text-lg lg:text-base',
                    !page?.current
                      ? 'text-primaryColor hover:text-blue-800 font-extrabold '
                      : 'font-normal text-[#787878] hover:text-gray-400'
                  )}
                >
                  {page.name}
                </a>
                {pages.length !== index ? (
                  <ChevronLeftIcon
                    aria-hidden='true'
                    className='h-5 w-5 flex-shrink-0 text-customBlack'
                  />
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

Breadcrumbs.propTypes = {
  pages: PropTypes.array,
};

export default Breadcrumbs;
