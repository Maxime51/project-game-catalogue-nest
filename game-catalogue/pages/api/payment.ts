import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, null);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 10000, // prix de votre produit / commande
      currency: "eur", // devise
      payment_method: "pm_card_visa",
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
    //get user with email
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
