// lib/brevo.ts
export async function sendBrevoEmail({
  to,
  subject,
  htmlContent,
}: {
  to: string;
  subject: string;
  htmlContent: string;
}) {
  const apiKey = process.env.BREVO_API_KEY;

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'api-key': apiKey!,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      sender: { name: 'Audiophile', email: 'noreply@audiophile.com' },
      to: [{ email: to }],
      subject,
      htmlContent,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('❌ Brevo email error:', error);
    throw new Error(`Failed to send email: ${error}`);
  }

  console.log('✅ Email sent successfully via Brevo');
}
