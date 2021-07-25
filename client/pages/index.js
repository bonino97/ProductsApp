import React, { useState } from 'react';
import Layout from '../components/Layout';

import { gql, useQuery } from '@apollo/client';

const GET_CLIENTS = gql`
  query GetClients {
    getClients {
      id
      name
      lastName
      email
      enterprise
      user
    }
  }
`;

const Home = () => {
  const { data, loading, error } = useQuery(GET_CLIENTS);
  return (
    <div>
      <Layout>
        <h2 className='text-2xl text-gray-800 font-light'>Clients</h2>
        <div className='flex justify-center my-10'>
          {loading ? <p>Loading...</p> : null}
          {data?.getClients?.length === 0 ? (
            <h1 className='text-center text-2xl text-blue-700 font-light'>
              You haven't got clients.
            </h1>
          ) : (
            <table className='table-auto shadow-md mt-10 w-full w-lg '>
              <thead className='bg-gray-800'>
                <tr className='text-white'>
                  <th className='w-1/5 py-2'>Name</th>
                  <th className='w-1/5 py-2'>Enterprise</th>
                  <th className='w-1/5 py-2'>Email</th>
                </tr>
              </thead>
              <tbody className='bg-white'>
                {data?.getClients?.map((client) => (
                  <tr key={client.id}>
                    <td className='border px-4 py-2'>
                      {client.name} {client.lastName}
                    </td>
                    <td className='border px-4 py-2'>{client.enterprise}</td>
                    <td className='border px-4 py-2'>{client.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Layout>
    </div>
  );
};

export default Home;
