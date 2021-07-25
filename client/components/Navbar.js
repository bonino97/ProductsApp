import React from 'react';
import { gql, useQuery } from '@apollo/client';

const GET_USER = gql`
  query GetUser {
    getUser {
      id
      email
    }
  }
`;

const Navbar = () => {
  const { data, loading, error } = useQuery(GET_USER);
  console.log(data);
  console.log(error);
  return (
    <div className='flex justify-end'>
      <p className='mr-2'></p>
      <button type='button'>Logout</button>
    </div>
  );
};

export default Navbar;
