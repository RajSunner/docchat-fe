import { generateBotMessage } from "../../utils";
import { getSession } from "next-auth/react"

export default async function handler(req, res) {
  const { message } = req.body;
  const session = await getSession({ req })
  if (session) {
  // process the user's message here
  const botMessage = generateBotMessage();
  res.status(200).json({ response: botMessage.message });
  }
  else {
    res.send({
      error: "You must sign in to view movies.",
    })
  }
};
