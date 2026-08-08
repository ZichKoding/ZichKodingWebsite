import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';

const { sendMock } = vi.hoisted(() => ({ sendMock: vi.fn() }));
vi.mock('resend', () => ({
  Resend: vi.fn(function Resend() {
    return { emails: { send: sendMock } };
  }),
}));

import { POST } from '../route';

const VALID_BODY = {
  name: 'John Doe',
  email: 'john@example.com',
  subject: 'Project Inquiry',
  message: 'I am interested in discussing a potential project with you.',
};

// Each test uses its own IP so the module-level rate limiter never bleeds
// between cases.
let ipCounter = 0;
function makeRequest(body: unknown, ip?: string): NextRequest {
  ipCounter += 1;
  return new NextRequest('http://localhost:3000/api/contact', {
    method: 'POST',
    headers: { 'x-forwarded-for': ip ?? `10.0.0.${ipCounter}` },
    body: JSON.stringify(body),
  });
}

describe('POST /api/contact', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sendMock.mockResolvedValue({ data: { id: 'email-id' }, error: null });
    vi.stubEnv('RESEND_API_KEY', 'test-key');
    vi.stubEnv('CONTACT_EMAIL', 'owner@example.com');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('sends the email and returns 201 for a valid submission', async () => {
    const response = await POST(makeRequest(VALID_BODY));

    expect(response.status).toBe(201);
    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(sendMock).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'owner@example.com',
        replyTo: VALID_BODY.email,
      })
    );
  });

  it('returns 400 for invalid input without sending', async () => {
    const response = await POST(
      makeRequest({ ...VALID_BODY, email: 'invalid-email', message: 'short' })
    );

    expect(response.status).toBe(400);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it('returns 500 when resend resolves with an error (no silent 201)', async () => {
    sendMock.mockResolvedValue({
      data: null,
      error: { message: 'recipient not allowed', name: 'validation_error' },
    });

    const response = await POST(makeRequest(VALID_BODY));

    expect(response.status).toBe(500);
  });

  it('silently accepts honeypot submissions without sending', async () => {
    const response = await POST(
      makeRequest({ ...VALID_BODY, website: 'https://spam.example' })
    );

    expect(response.status).toBe(200);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it('returns 500 when the mailer is not configured', async () => {
    vi.stubEnv('RESEND_API_KEY', '');

    const response = await POST(makeRequest(VALID_BODY));

    expect(response.status).toBe(500);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it('rate limits after 5 requests from the same IP', async () => {
    const ip = '192.168.77.77';
    for (let i = 0; i < 5; i++) {
      const ok = await POST(makeRequest(VALID_BODY, ip));
      expect(ok.status).toBe(201);
    }

    const limited = await POST(makeRequest(VALID_BODY, ip));
    expect(limited.status).toBe(429);
  });
});
