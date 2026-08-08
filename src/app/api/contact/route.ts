import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createContactSchema } from '@/lib/validations/contact';

const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60_000;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > RATE_LIMIT;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Honeypot: hidden "website" field — humans never see it, bots fill it.
    // Silent 200 with no send so bots can't tell they were filtered.
    if (typeof body?.website === 'string' && body.website.trim() !== '') {
      return NextResponse.json(
        { success: true, message: 'Message sent successfully' },
        { status: 200 }
      );
    }

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests — please try again in a minute' },
        { status: 429 }
      );
    }

    const validation = createContactSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation error', details: validation.error.issues },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.CONTACT_EMAIL;
    if (!apiKey || !to) {
      console.error(
        'Contact form not configured: RESEND_API_KEY and/or CONTACT_EMAIL missing'
      );
      return NextResponse.json(
        { error: 'Contact form is not configured yet' },
        { status: 500 }
      );
    }

    const { name, email, subject, message } = validation.data;
    const resend = new Resend(apiKey);
    // Resend resolves with { error } on a failed send instead of throwing —
    // a bare try/catch would return a false-success 201 for rejected sends.
    const { error } = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to,
      replyTo: email,
      subject: `[zichkoding.com] ${subject}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    });

    if (error) {
      console.error('Resend send failed:', error);
      return NextResponse.json(
        { error: 'Failed to send message' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Message sent successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
