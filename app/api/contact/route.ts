import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;
    if (!DISCORD_WEBHOOK_URL) {
      console.error('DISCORD_WEBHOOK_URL is not set');
      return NextResponse.json(
        { error: 'Server misconfiguration.' },
        { status: 500 }
      );
    }
    const { firstName, lastName, email, message, source } = await req.json();

    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json(
        { error: 'All fields are required.' },
        { status: 400 }
      );
    }

    const now = new Date();
    const submittedAt = now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }) +
      ' ' +
      now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });

    const embed = {
      title: '📬 New Contact Form Submission',
      color: 0x0b2545,
      fields: [
        {
          name: '👤 Name',
          value: `${firstName} ${lastName}`,
          inline: true,
        },
        {
          name: '📧 Email',
          value: email,
          inline: true,
        },
        {
          name: '🕐 Submitted',
          value: submittedAt,
          inline: false,
        },
        {
          name: '🌐 Source',
          value: source || 'Unknown',
          inline: false,
        },
        {
          name: '📝 Message',
          value: `\`\`\`${message}\`\`\``,
          inline: false,
        },
      ],
      footer: {
        text: `Webbly Media Contact System • ${submittedAt}`,
      },
    };

    const discordRes = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'Webbly Media Contact Bot',
        embeds: [embed],
      }),
    });

    if (!discordRes.ok) {
      const errText = await discordRes.text();
      console.error('Discord webhook error:', errText);
      return NextResponse.json(
        { error: 'Failed to send message.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
