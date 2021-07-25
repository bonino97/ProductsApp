import React from 'react';
import { gql, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { RiLogoutCircleRLine } from 'react-icons/ri';

const GET_USER = gql`
  query GetUser {
    getUser {
      id
      email
      name
      lastName
    }
  }
`;

const Navbar = () => {
  const { data, loading } = useQuery(GET_USER);
  const router = useRouter();

  if (loading) return null;

  const { name } = data?.getUser;

  const logOut = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className='flex justify-between mb-6'>
      <p className='mr-2'>
        User: <span className='font-black'>{name}</span>{' '}
      </p>
      <button
        onClick={() => logOut()}
        className='text-red-500 font-black rounded py-1 px-2 shadow-md'
        type='button'
      >
        <RiLogoutCircleRLine></RiLogoutCircleRLine>
      </button>
    </div>
  );
};

export default Navbar;
