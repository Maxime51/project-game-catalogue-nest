import { NextApiRequest, NextApiResponse } from "next";
import { getCookies, getCookie, setCookies, removeCookies } from "cookies-next";
import { getDatabase } from "../../../../src/database";
import { getSession } from "@auth0/nextjs-auth0";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const cookie = getCookie("appSession", { req, res });
    const mongodb = await getDatabase();
    const data = JSON.parse(req.body);
    const session = getSession(req, res);

    const user = await mongodb.db().collection("users").findOne({
      email: session.user.email,
    });

    if (user === null) {
      if (data.name !== undefined) {
        const idUser = await mongodb
          .db()
          .collection("users")
          .insertOne({
            name: data.name,
            email: session.user.email,
            token: cookie,
          })
          .then((result) => result.insertedId);

        //create panier
        await mongodb.db().collection("panier").insertOne({
          users: idUser,
        });
      }
    }
    //get user with email
    const addGame = await mongodb
      .db()
      .collection("users")
      .updateOne(
        {
          email: session.user.email,
        },
        {
          $set: {
            token: cookie,
          },
        }
      );

    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ cookie: cookie }));
  } else {
    res.statusCode = 405;
    res.end();
  }
}
