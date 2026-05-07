export default async function handler(req, res) {

  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed'
    });
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {

    const { messages } = req.body;

    const userMessage =
      messages[messages.length - 1]?.content || '';

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: userMessage
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    console.log(JSON.stringify(data));

const reply =
data?.candidates?.[0]?.content?.parts?.[0]?.text
|| JSON.stringify(data)
|| "AI did not return a valid response.";

const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text
|| data?.candidates?.[0]?.output
|| "AI did not return a valid response.";
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
      error: 'Internal server error'
    });

  }
}
