import React from 'react';
import { useUser } from '@auth0/nextjs-auth0';
import Layout from '../components/Layout';
import { withPageAuthRequired } from "@auth0/nextjs-auth0";

export default function Profile() {

const { user, error, isLoading } = useUser();
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    <Layout>
      <div>
        <img src={user.picture} alt={user.name} />
        <h2>{user.name}</h2>
        <p>{user.email}</p>
      </div>
  </Layout>);
}
export const getServerSideProps = withPageAuthRequired();
