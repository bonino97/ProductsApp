import React, { useState } from 'react';

import { useRouter } from 'next/router';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import { IoMdLogIn } from 'react-icons/io';
import { BiErrorCircle, BiCheckCircle } from 'react-icons/bi';

import { useMutation, gql } from '@apollo/client';

import Layout from '../components/Layout';

const AUTH_USER = gql`
  mutation AuthUser($authUserInput: AuthInput) {
    authenticateUser(authInput: $authUserInput) {
      token
    }
  }
`;

const Login = () => {
  // State to mannage error messages.
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  //Mutation to authenticate users.
  const [authenticateUser] = useMutation(AUTH_USER);

  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().required('Email required.').email('Invalid email'),
      password: Yup.string()
        .required('Password required.')
        .min(6, 'Password must contain more than six characters'),
    }),
    onSubmit: async (values) => {
      try {
        const { email, password } = values;
        console.log(values);
        const { data } = await authenticateUser({
          variables: {
            authUserInput: {
              email,
              password,
            },
          },
        });

        if (data) {
          setSuccessMsg(`Autenticando...`);
          const { token } = data.authenticateUser;
          localStorage.setItem('token', token);

          setTimeout(() => {
            setSuccessMsg(null);
            router.push('/');
          }, 2000);
        }
      } catch (error) {
        console.log(error);
        setErrorMsg(error.message);
        setTimeout(() => {
          setErrorMsg(null);
        }, 3000);
      }
    },
  });

  const showErrorMessage = () => {
    return (
      <div className='bg-white py-2 px-3 w-full my-3 max-w-sm mx-auto border-red-500 border-l-4 rounded shadow animate-pulse'>
        <div className='flex flex-column'>
          <BiErrorCircle className='mt-1 mr-1 text-red-500'></BiErrorCircle>
          <p className='text-red-500'>{errorMsg}</p>
        </div>
      </div>
    );
  };

  const showSuccessMessage = () => {
    return (
      <div className='bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto border-blue-500 border-b-2 rounded shadow animate-pulse'>
        <div className='flex flex-column inline-flex'>
          <div className='m-auto'>
            <p className='text-blue-500'>{successMsg}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <h1 className='text-center text-2xl text-white font-light'>Sign In</h1>
      <div className='flex justify-center mt-5'>
        <div className='w-full max-w-sm'>
          <form
            className='bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4'
            onSubmit={formik.handleSubmit}
          >
            <div className='mb-6'>
              <label
                className='block text-gray-700 text-sm font-bold mb-2'
                htmlFor='email'
              >
                Email
              </label>
              <input
                type='text'
                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                id='email'
                placeholder='Email'
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.error || formik.errors.email ? (
                <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 shadow rounded p-2 text-center animate-pulse'>
                  <div className='flex flex-column inline-block'>
                    <BiErrorCircle className='mt-1 mr-1'></BiErrorCircle>
                    <p>{formik.errors.email}</p>
                  </div>
                </div>
              ) : (
                ''
              )}
            </div>
            <div>
              <label
                className='block text-gray-700 text-sm font-bold mb-2'
                htmlFor='password'
              >
                Password
              </label>
              <input
                type='password'
                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                id='password'
                placeholder='Password'
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.error || formik.errors.password ? (
                <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 shadow rounded p-2 text-center animate-pulse'>
                  <div className='flex flex-column inline-block'>
                    <BiErrorCircle className='mt-1 mr-1'></BiErrorCircle>
                    <p>{formik.errors.password}</p>
                  </div>
                </div>
              ) : (
                ''
              )}
            </div>
            <button
              type='submit'
              className='bg-gray-800 w-full mt-5 p-2 text-white hover:bg-gray-900 rounded shadow hover:font-black'
            >
              <div className='inline-flex items-center py-1 px-3 '>
                <span className='mr-1'>Sign in</span>
                <IoMdLogIn></IoMdLogIn>
              </div>
            </button>
          </form>
          {errorMsg ? showErrorMessage() : null}
          {successMsg ? showSuccessMessage() : null}
        </div>
      </div>
    </Layout>
  );
};

export default Login;
