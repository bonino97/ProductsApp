import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaUserClock, FaClipboardList, FaCubes } from 'react-icons/fa';

const Sidebar = () => {
  const router = useRouter();

  return (
    <aside className='bg-gray-800 sm:w-1/2 xl:w-1/5 sm:min-h-screen p-5'>
      <div>
        <p className='text-gray-200 text-2xl font-black'>Products App!</p>
      </div>
      <nav className='mt-5 list-none'>
        <li
          className={
            router.pathname === '/'
              ? 'bg-gray-400 p-2 rounded-md font-black'
              : 'p-2 '
          }
        >
          <Link href='/'>
            <a className='text-white block inline-flex items-center py-1 px-3'>
              <FaUserClock></FaUserClock>
              <span className='ml-1'>Clients</span>
            </a>
          </Link>
        </li>
        <li
          className={
            router.pathname === '/orders'
              ? 'bg-gray-400 p-2 rounded-md font-black'
              : 'p-2'
          }
        >
          <Link href='/orders'>
            <a className='text-white block inline-flex items-center py-1 px-3'>
              <FaClipboardList></FaClipboardList>
              <span className='ml-1'>Orders</span>
            </a>
          </Link>
        </li>
        <li
          className={
            router.pathname === '/products'
              ? 'bg-gray-400 p-2 rounded-md font-black'
              : 'p-2'
          }
        >
          <Link href='/products'>
            <a className='text-white block inline-flex items-center py-1 px-3'>
              <FaCubes></FaCubes>
              <span className='ml-1'>Products</span>
            </a>
          </Link>
        </li>
      </nav>
    </aside>
  );
};

export default Sidebar;
