import { NextApiRequest, NextApiResponse } from "next";
import { getCookies, getCookie, setCookies, removeCookies } from "cookies-next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const cookie = getCookie("appSession", { req, res });
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ cookie: cookie }));
  } else {
    res.statusCode = 405;
    res.end();
  }
}
