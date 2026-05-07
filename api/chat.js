export default async function handler(req, res) {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed'
    });
  }

  try {

    const { messages } = req.body;

    const userMessage =
      messages?.[messages.length - 1]?.content || 'Hello';

    const response = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'mistralai/mistral-7b-instruct:free',
          messages: [
            {
              role: 'user',
              content: userMessage
            }
          ]
        })
      }
    );

    const data = await response.json();

    console.log(JSON.stringify(data));

    const reply =
      data?.choices?.[0]?.message?.content
      || JSON.stringify(data);

    return res.status(200).json({
      content: [
        {
          text: reply
        }
      ]
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      error: err.message
    });

  }

}
