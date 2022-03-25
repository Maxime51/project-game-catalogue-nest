import { getAccessToken, useUser } from "@auth0/nextjs-auth0";
import axios from "axios";
import { ObjectId } from "mongodb";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useEffect, useState } from "react"
import { json } from "stream/consumers";
import Layout from "../components/Layout";
import React from 'react';
import { loadStripe } from '@stripe/stripe-js';

type Game = {
  _id: ObjectId,
  quantity:number
}
const stripePromise = loadStripe("pk_test_51Kgm6WE5ULZw6nvxhiSrYZQilH8wWRcUEhLraMqW3vvrevr4rKsqSLLXa3qQfk72BeneXd56M5Qi6eyvXCF7jeIJ00N9ImRcLw");
export function PreviewPage() {
  React.useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);
    if (query.get('success')) {
      console.log('Order placed! You will receive an email confirmation.');
    }

    if (query.get('canceled')) {
      console.log('Order canceled -- continue to shop around and checkout when you’re ready.');
    }
  }, []);
}
export default function Panier() {

  const [panier, setPanier] = useState([]);
  const { user, error, isLoading } = useUser();
  const [count, setcount] = useState(0);
  const [priceTotal, setPriceTotal] = useState(0);
  const [affichePayment,setPayment] = useState(<></>)


  async function more(idGame) {
    setcount(count + 1)
    await fetch(`/api/panier/add/${idGame}`);
    const data = fetch("/api/panier", {
      method:"GET",
    }).then((response) => response.json());
    data.then((result) => setPanier(result.panier))
  }
  async function less(idGame,quantity) {

    if (quantity <= 1) {
      await fetch(`/api/panier/supp/${idGame}?supp=true`)
      const data = fetch("/api/panier", {
      method:"GET",
    }).then((response) => response.json());
    data.then((result) => setPanier(result.panier))
    } else {
      setcount(count - 1)
      await fetch(`/api/panier/supp/${idGame}?supp=false&quantity=${quantity}`)
      const data = fetch("/api/panier", {
      method:"GET",
    }).then((response) => response.json());
    data.then((result) => setPanier(result.panier))
    }
  }

  useEffect(() => {
    const data = fetch("/api/panier", {
      method:"GET",
    }).then((response) => response.json());
    data.then((result) => setPanier(result.panier))

  }, []);

  let price = 0;
  const paniersend = [];
  return <Layout>
    <div className="container">
    <div className="row">
    <div className="col-sm-8">
          {panier.map((element, index) => {
        paniersend.push({payment:element.game.payment,quantity:element.quantity})
        price += (((element.game.price)) * (element.quantity));
          return (
          <div key={index} className="card mb-5" style={{ maxWidth: "1000px", height:"250px" }}>
            <div className="row g-0">
              <div className="col-md-4">
                <img src={element.game.cover.url} style={{ width: "200px", height:"200px" }}className="img-fluid rounded-start" alt="..." />
              </div>
              <div className="col-md-6">
                <div className="card-body">
                  <h5 className="card-title">{element.game.name}</h5>
                    <p className="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                    <p className="card-text"><small className="text-muted">Last updated 3 mins ago</small></p>
                    <a href={`/api/panier/supp/${element.game._id}?info=${user?.email}&supp=true`}><button className="btn btn-primary">Delete</button></a>
                </div>
                </div>
                <div className="col-md-2">

                  <h3>{Math.round(((element.game.price) * element.quantity) * 100) / 100} €</h3>
                  <button onClick={() => {less(element.game._id,element.quantity)}}>-</button><input placeholder={`${element.quantity}`} style={{ maxWidth: "50px", textAlign: "center" }}></input><button onClick={() => { more(element.game._id) }}>+</button>
              </div>
              </div>
            </div>

          );
      })}
        </div>
      <div className="col-4">
          <h1>Total basket : {Math.round(price * 100) / 100} €</h1>
          <form action={`/api/checkout_sessions?panier=${JSON.stringify(paniersend)}`} method="POST">
      <section>
        <button type="submit" className="btn btn-primary" role="link">
          Payment
        </button>
        </section>
        </form>
        </div>

    </div>
    </div>
  </Layout>
}
function req(req: any, res: any): { accessToken: any; } | PromiseLike<{ accessToken: any; }> {
  throw new Error("Function not implemented.");
}

function res(req: (req: any, res: any) => { accessToken: any; } | PromiseLike<{ accessToken: any; }>, res: any): { accessToken: any; } | PromiseLike<{ accessToken: any; }> {
  throw new Error("Function not implemented.");
}

function getStripe() {
  throw new Error("Function not implemented.");
}

