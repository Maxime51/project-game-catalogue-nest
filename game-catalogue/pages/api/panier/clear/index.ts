import { getAccessToken } from "@auth0/nextjs-auth0";
import { getCookie } from "cookies-next";
import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { getDatabase } from "../../../../src/database";
import { getSession } from "@auth0/nextjs-auth0";
import { Client } from "@sendgrid/client";
import { ClientResponse } from "@sendgrid/client/src/response";
import { ResponseError } from "@sendgrid/helpers/classes";
import { MailDataRequired } from "@sendgrid/helpers/classes/mail";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const idGame = req.query.game;
    const cookie = getCookie("appSession", { req, res });
    const { accessToken } = await getAccessToken(req, res);
    const session = getSession(req, res);

    const response = await fetch(
      `https://${process.env.AUTH0_DOMAIN}/userinfo`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    //send email
    const sgMail = require("@sendgrid/mail");

    sgMail.setApiKey(`${process.env.SENDGRID_API_KEY.toString()}`);

    const data = await response.json();
    const mongodb = await getDatabase();
    //get user with email
    const idUser = await mongodb
      .db()
      .collection("users")
      .findOne({ email: session.user.email })
      .then((result) => result?._id);

    const panier = await mongodb
      .db()
      .collection("panier")
      .findOne({ users: idUser });

    const gameList = [];
    const emailPaniertest = await Promise.all(
      panier.content.map(async (element, index) => {
        const game = await mongodb
          .db()
          .collection("games")
          .findOne({ _id: element.article });
        gameList.push({ game: game, quantity: element.quantity });
        return `<tr>
              <th >${index}</th>
              <td>${game.name}</td>
              <td>${element.quantity}</td>
              <td>${
                parseFloat(element.quantity) * parseFloat(game.price)
              } €</td>
            </tr>`;
      })
    );

    const totalPanier = gameList.map((element) => {
      return parseFloat(element.quantity) * parseFloat(element.game.price);
    });
    let sum = 0;

    for (let i = 0; i < totalPanier.length; i++) {
      sum += totalPanier[i];
    }
    const msg = {
      to: `${session.user.email}`,
      from: "mmansuy@norauto.fr",
      subject: "Facture of your payment",
      text: "and easy to do anywhere, even with Node.js",
      html: `<strong><table >
          <thead>
            <tr>
              <th >#</th>
              <th >Game</th>
              <th >Quantity</th>
              <th >Price</th>
            </tr>
          </thead>
          <tbody>
            ${emailPaniertest.join(",")}
            <tr>
              <th ></th>
              <th >Gae</th>
              <th ></th>
              <th >Total :${sum}</th>
            </tr>
          </tbody>
                </table></strong>`,
    };
    sgMail
      .send(msg)
      .then(() => {
        console.log("Email sent");
      })
      .catch((error) => {
        console.error(error);
      });

    //get user with email

    const addGame = await mongodb
      .db()
      .collection("panier")
      .deleteOne({ users: new ObjectId(idUser) });

    await mongodb
      .db()
      .collection("panier")
      .insertOne({
        users: new ObjectId(idUser),
      });

    res.setHeader("Content-Type", "application/json");
    res.redirect("/");
    res.end(JSON.stringify({ cookie: "cookie" }));
  } else {
    res.statusCode = 405;
    res.end();
  }
}
