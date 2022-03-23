import { getCookie } from "cookies-next";
import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { getDatabase } from "../../../../../src/database";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const idGame = req.query.game;

    const mongodb = await getDatabase();
    //get user with email
    const idUser = await mongodb
      .db()
      .collection("users")
      .findOne({ email: req.query.info })
      .then((result) => result._id);

    //get user with email
    const addGame = await mongodb
      .db()
      .collection("panier")
      .updateOne(
        {
          users: new ObjectId(idUser),
        },
        {
          $push: {
            content: { article: new ObjectId(idGame.toString()), quantity: 1 },
          },
        }
      );

    res.setHeader("Content-Type", "application/json");
    res.redirect("/");
    res.end(JSON.stringify({ cookie: "cookie" }));
  } else {
    res.statusCode = 405;
    res.end();
  }
}
