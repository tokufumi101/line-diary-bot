const crypto = require('crypto');
const https = require('https');

function verifySignature(body, signature, secret) {
  const hmac = crypto.createHmac('SHA256', secret);
  hmac.update(body);
  return hmac.digest('base64') === signature;
}

function replyMessage(replyToken, text, accessToken) {
  const body = JSON.stringify({
    replyToken,
    messages: [{ type: 'text', text }],
  });

  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: 'api.line.me',
        path: '/v2/bot/message/reply',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          'Content-Length': Buffer.byteLength(body),
        },
      },
      (res) => {
        res.on('data', () => {});
        res.on('end', resolve);
      }
    );
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

exports.handler = async (event) => {
  const signature = event.headers['x-line-signature'];
  const body = event.body;
  const secret = process.env.LINE_CHANNEL_SECRET;
  const accessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;

  if (!verifySignature(body, signature, secret)) {
    return { statusCode: 403, body: 'Forbidden' };
  }

  const { events } = JSON.parse(body);

  await Promise.all(
    events
      .filter((e) => e.type === 'message' && e.message.type === 'text')
      .map((e) => replyMessage(e.replyToken, e.message.text, accessToken))
  );

  return { statusCode: 200, body: 'OK' };
};
