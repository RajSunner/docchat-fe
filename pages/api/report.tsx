import { getSession } from "next-auth/react";
import client from "../../lib/prismadb";

async function createReport(req, res) {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ unauthorised: true });
  }
  const user = await client.user.findUnique({
    where: { email: session.user?.email },
  });
  if (!req.body.name || !req.body.url) {
    return res.status(500).json({ error: "validation error" });
  }
  const post = await client.report.create({
    data: {
      userId: user.id,
      name: req.body.name,
      url: req.body.url,
      embedded: false,
    },
  });

  if (post.id) {
    res.status(200).json(post);
  } else {
    return res.status(500).json({ error: "something went wrong" });
  }
}
export default async function handler(req, res) {
  if (req.method === "POST") {
    return createReport(req, res);
  }
}
