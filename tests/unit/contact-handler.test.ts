import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../../src/pages/api/contact';

const makeContext = (
  formData: Record<string, string>,
  env: Record<string, string> = { RESEND_API_KEY: 'test_key' },
) =>
  ({
    request: {
      formData: async () => {
        const fd = new FormData();
        for (const [k, v] of Object.entries(formData)) fd.append(k, v);
        return fd;
      },
      headers: new Headers({
        'content-type': 'application/x-www-form-urlencoded',
      }),
    },
    locals: {
      runtime: { env },
    },
  }) as any;

describe('contact handler', () => {
  beforeEach(() => {
    global.fetch = vi.fn(
      async () => new Response(JSON.stringify({ id: 'msg_123' }), { status: 200 }),
    );
  });

  it('rejects when honeypot field is filled', async () => {
    const res = await POST(
      makeContext({
        name: 'Bot',
        email: 'bot@example.com',
        description: 'spam',
        budget: '5k_15k',
        timeline: 'asap',
        company_url: 'http://spam.example.com',
      }),
    );
    expect(res.status).toBe(200);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('rejects missing required fields', async () => {
    const res = await POST(makeContext({ name: 'Alice' }));
    expect(res.status).toBe(400);
  });

  it('rejects invalid email format', async () => {
    const res = await POST(
      makeContext({
        name: 'Alice',
        email: 'not-an-email',
        description: 'project description here that is long enough',
        budget: '5k_15k',
        timeline: 'asap',
      }),
    );
    expect(res.status).toBe(400);
  });

  it('returns 500 if RESEND_API_KEY is missing', async () => {
    const res = await POST(
      makeContext(
        {
          name: 'Alice',
          email: 'alice@example.com',
          description: 'description that is plenty long for the validator',
          budget: '5k_15k',
          timeline: 'asap',
        },
        {}, // no env
      ),
    );
    expect(res.status).toBe(500);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('sends email via Resend and redirects on valid submission', async () => {
    const res = await POST(
      makeContext({
        name: 'Alice',
        email: 'alice@example.com',
        description: 'I want to hire you for a project that needs a custom backend.',
        budget: '15k_50k',
        timeline: '1_to_3_months',
      }),
    );
    expect(res.status).toBe(303);
    expect(res.headers.get('Location')).toBe('/contact?sent=1');
    expect(global.fetch).toHaveBeenCalledOnce();

    const [url, opts] = (global.fetch as any).mock.calls[0];
    expect(url).toBe('https://api.resend.com/emails');

    expect((opts as any).headers.Authorization).toBe('Bearer test_key');
  });

  it('returns 500 if Resend API fails', async () => {
    global.fetch = vi.fn(async () => new Response('boom', { status: 500 }));
    const res = await POST(
      makeContext({
        name: 'Alice',
        email: 'alice@example.com',
        description: 'description that is plenty long for the validator',
        budget: '5k_15k',
        timeline: 'asap',
      }),
    );
    expect(res.status).toBe(500);
  });
});
