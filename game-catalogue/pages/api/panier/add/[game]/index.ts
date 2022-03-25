import { getAccessToken } from "@auth0/nextjs-auth0";
import { getCookie } from "cookies-next";
import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { getDatabase } from "../../../../../src/database";
import { getSession } from "@auth0/nextjs-auth0";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const idGame = req.query.game;
    const cookie = getCookie("appSession", { req, res });
    const session = getSession(req, res);
    console.log(session);
    const { accessToken } = await getAccessToken(req, res);
    if (session) {
      const response = await fetch(
        `https://${process.env.AUTH0_DOMAIN}/userinfo`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await response.json();
      console.log("ici");
      const mongodb = await getDatabase();
      //get user with email
      const idUser = await mongodb
        .db()
        .collection("users")
        .findOne({ email: session.user.email })
        .then((result) => result._id);

      //get user with email

      const gameExist = await mongodb
        .db()
        .collection("panier")
        .findOne({
          users: new ObjectId(idUser),
          "content.article": new ObjectId(idGame.toString()),
        })
        .then((result) => {
          return result?.content?.map((element) => {
            if (
              element.article.toString() ===
              new ObjectId(idGame.toString()).toString()
            ) {
              return element.quantity;
            }
          });
        });

      if (gameExist === undefined) {
        const addGame = await mongodb
          .db()
          .collection("panier")
          .updateOne(
            {
              users: new ObjectId(idUser),
            },
            {
              $push: {
                content: {
                  article: new ObjectId(idGame.toString()),
                  quantity: 1,
                },
              },
            }
          );
      } else {
        const gameExitFormat = gameExist.filter(
          (element) => element !== undefined
        );
        const addGame = await mongodb
          .db()
          .collection("panier")
          .updateOne(
            {
              users: new ObjectId(idUser),
              "content.article": new ObjectId(idGame.toString()),
            },
            {
              $set: {
                "content.$.quantity": gameExitFormat[0] + 1,
              },
            }
          );
      }
      res.setHeader("Content-Type", "application/json");
      res.redirect("/panier");
      res.end(JSON.stringify({ cookie: "cookie" }));
    } else {
      console.log("paslog");
      res.setHeader("Content-Type", "application/json");
      res.redirect("/");
      res.end(JSON.stringify({ cookie: "cookie" }));
    }
  } else {
    res.statusCode = 405;
    res.end();
  }
}
