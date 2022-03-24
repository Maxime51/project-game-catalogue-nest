import { getAccessToken } from "@auth0/nextjs-auth0";
import { getCookie } from "cookies-next";
import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { getDatabase } from "../../../../src/database";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const idGame = req.query.game;
    const cookie = getCookie("appSession", { req, res });
    const { accessToken } = await getAccessToken(req, res);

    const response = await fetch(
      `https://${process.env.AUTH0_DOMAIN}/userinfo`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const data = await response.json();
    const mongodb = await getDatabase();
    //get user with email
    const idUser = await mongodb
      .db()
      .collection("users")
      .findOne({ email: data.email })
      .then((result) => result?._id);

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
