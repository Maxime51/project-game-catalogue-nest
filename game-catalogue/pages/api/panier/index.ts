import { NextApiRequest, NextApiResponse } from "next";
import { getCookies, getCookie, setCookies, removeCookies } from "cookies-next";
import { getDatabase } from "../../../src/database";
import { ObjectId } from "mongodb";

type Panier = {
  _id: ObjectId;
  users: ObjectId;
  content: [
    {
      article: ObjectId;
      quantity: number;
    }
  ];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const cookie = getCookie("appSession", { req, res });
    const mongodb = await getDatabase();

    //get user with cookie
    const idUser = await mongodb
      .db()
      .collection("users")
      .findOne({ token: cookie })
      .then((result) => result._id);

    //get braket of user
    const braket = await mongodb
      .db()
      .collection("panier")
      .findOne({ users: new ObjectId(idUser) })
      .then((result: Panier) => result.content)
      .then(async (content) => {
        const allArticles = await Promise.all(
          content.map((element) => {
            return mongodb
              .db()
              .collection("games")
              .findOne({ _id: element.article })
              .then((result) => result);
          })
        );
        return allArticles;
      });

    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ cookie: braket }));
  } else {
    res.statusCode = 405;
    res.end();
  }
}
