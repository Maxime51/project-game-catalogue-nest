import { getAccessToken } from "@auth0/nextjs-auth0";
import { getDatabase } from "../../src/database";
import { ObjectId } from "mongodb";
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Create Checkout Sessions from body params.

      const panier = await JSON.parse(req.query.panier)
      const session = await stripe.checkout.sessions.create({
        line_items: panier.map((element) => {
          return {
            price: element.payment,
            quantity:element.quantity
          }
        }),
        mode: 'payment',
        success_url: `${req.headers.origin}/api/panier/clear`,
        cancel_url: `${process.env.AUTH0_BASE_URL}/panier`,

      });


      res.redirect(303, session.url);
    } catch (err) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
