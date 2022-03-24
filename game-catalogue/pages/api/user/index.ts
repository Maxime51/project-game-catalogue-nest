import { NextApiRequest, NextApiResponse } from "next";
import { getAccessToken, withApiAuthRequired } from "@auth0/nextjs-auth0";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
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

    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ email: data.email }));
  } else {
    res.statusCode = 405;
    res.end();
  }
}
