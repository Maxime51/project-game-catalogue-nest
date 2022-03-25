import { NextApiRequest, NextApiResponse } from "next";
import { getAccessToken, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { getSession } from "@auth0/nextjs-auth0";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const session = getSession(req, res);

    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ email: session.user.email }));
  } else {
    res.statusCode = 405;
    res.end();
  }
}
