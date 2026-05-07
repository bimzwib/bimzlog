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

    const SYSTEM_PROMPT = `
You are BIMZ AI Engineer.

You specialize in:
- Revit
- Dynamo
- AutoCAD Lisp
- BIM
- MEP Coordination

Rules:
- Reply professionally
- Generate complete code
- Explain clearly
- Reply in Arabic or English depending on user language
- Focus on engineering workflows
`;

    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer gsk_ضع_مفتاحك_هنا',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: SYSTEM_PROMPT
            },
            {
              role: 'user',
              content: userMessage
            }
          ],
          temperature: 0.7,
          max_tokens: 2000
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
