export default async function (req, res) {
  
  const response = await fetch(process.env.LCC_ENDPOINT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      question: req.body.question,
      history: req.body.history,
      file_name: req.body.file_name,
      url : req.body.url,
      dname: req.body.dname
    }),
  });

    const data = await response.json();

    res.status(200).json({ result: data })
}