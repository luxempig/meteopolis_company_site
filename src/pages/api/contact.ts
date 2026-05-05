import type { APIRoute } from 'astro';

export const prerender = false;

const ALLOWED_BUDGETS = ['under_5k', '5k_15k', '15k_50k', '50k_plus'];
const ALLOWED_TIMELINES = ['asap', 'within_1_month', '1_to_3_months', 'flexible'];

const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

interface CloudflareLocals {
  runtime?: { env?: { RESEND_API_KEY?: string } };
}

export const POST: APIRoute = async ({ request, locals }) => {
  const formData = await request.formData();
  const get = (key: string) => (formData.get(key)?.toString() ?? '').trim();

  if (get('company_url').length > 0) {
    return new Response('OK', { status: 200 });
  }

  const name = get('name');
  const email = get('email');
  const company = get('company');
  const description = get('description');
  const budget = get('budget');
  const timeline = get('timeline');

  const errors: string[] = [];
  if (!name || name.length > 200) errors.push('name');
  if (!email || !isEmail(email) || email.length > 200) errors.push('email');
  if (!description || description.length < 20 || description.length > 5000)
    errors.push('description');
  if (!ALLOWED_BUDGETS.includes(budget)) errors.push('budget');
  if (!ALLOWED_TIMELINES.includes(timeline)) errors.push('timeline');

  if (errors.length > 0) {
    return new Response(JSON.stringify({ error: 'validation_failed', fields: errors }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  const apiKey = (locals as CloudflareLocals).runtime?.env?.RESEND_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'misconfigured' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }

  const subject = `New inquiry from ${name}`;
  const text = [
    `From: ${name} <${email}>`,
    company ? `Company: ${company}` : null,
    `Budget: ${budget}`,
    `Timeline: ${timeline}`,
    '',
    'Project description:',
    description,
  ]
    .filter(Boolean)
    .join('\n');

  const resendResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Meteopolis Contact <hello@meteopolis.com>',
      to: ['hello@meteopolis.com'],
      reply_to: email,
      subject,
      text,
    }),
  });

  if (!resendResponse.ok) {
    return new Response(JSON.stringify({ error: 'send_failed' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }

  return new Response(null, {
    status: 303,
    headers: { Location: '/contact?sent=1' },
  });
};
