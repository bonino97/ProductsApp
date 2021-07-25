import React from 'react';
import Head from 'next/head';
import router, { useRouter } from 'next/router';

import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Products App!</title>
        <link
          rel='stylesheet'
          href='https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css'
          integrity='sha512-NhSC1YmyruXifcj/KFRWoC561YpHpc5Jtzgvbuzx5VozKpWvQ+4nXhPdFgmx8xqexRcpAglTj9sIBWINXa8x5w=='
          crossOrigin='anonymous'
          referrerPolicy='no-referrer'
        />
      </Head>
      {router.pathname === '/login' || router.pathname === '/register' ? (
        <div className='bg-gray-800 min-h-screen flex flex-col justify-center'>
          <div>{children}</div>
        </div>
      ) : (
        <div className='bg-gray-200 min-h-screen'>
          <div className='flex min-h-screen'>
            <Sidebar></Sidebar>
            <main className='sm:w-1/2 xl:w-4/5 sm:min-h-screen p-5'>
              <Navbar></Navbar>
              {children}
            </main>
          </div>
        </div>
      )}
    </>
  );
};

export default Layout;
