import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { getDatabase } from "../../../../../src/database";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method === "POST") {
    const mongodb = await getDatabase();
    const userInfo = await mongodb
      .db()
      .collection("users")
      .updateOne(
        {
          _id: new ObjectId(request.query.id.toString()),
        },
        {
          $set: {
            name: request.body.name,
            email: request.body.email,
          },
        }
      )
      .then((response) => response);
    console.log(userInfo);

    response.setHeader("Content-Type", "application/json");
    response.end(JSON.stringify({ name: "John Doe" }));
  } else {
    response.statusCode = 405;
    response.end();
  }
}
