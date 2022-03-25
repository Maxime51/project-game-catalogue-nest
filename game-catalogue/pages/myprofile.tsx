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
      <section className="py-5">
  <div className="container px-4 px-lg-5 my-5">
        <div className="row gx-4 gx-lg-5 align-items-center">
          <div className="col-md-6">
            <img className="card-img-top mb-5 mb-md-0" src={user.picture} alt={user.name} />
          </div>
      <div className="col-md-6">
          <h1 className="display-5 fw-bolder">{user.name}</h1>
          <div className="fs-5 mb-5">
          </div>
          <p className="lead">{user.email}</p>
      </div>
    </div>
  </div>
  </section>
  </Layout>);
}
export const getServerSideProps = withPageAuthRequired();
