import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const webhookUrl = process.env.FORM_DISCORD_WEBHOOK_URL;
    if (!webhookUrl) {
      console.error('FORM_DISCORD_WEBHOOK_URL is not set');
      return NextResponse.json(
        { error: 'Server misconfiguration.' },
        { status: 500 }
      );
    }

    const { firstName, lastName, email, message, selectedServices, source } = await req.json();

    if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: 'All fields are required.' },
        { status: 400 }
      );
    }

    const now = new Date();
    const submittedAt = now.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const servicesList =
      Array.isArray(selectedServices) && selectedServices.length > 0
        ? selectedServices.join(', ')
        : '—';

    const embed = {
      title: '📋 New contact form submission',
      description: 'A visitor submitted the contact modal from the website.',
      color: 0x0b2545,
      fields: [
        {
          name: '👤 Name',
          value: `**${firstName.trim()}** ${lastName.trim()}`,
          inline: true,
        },
        {
          name: '📧 Email',
          value: email.trim(),
          inline: true,
        },
        {
          name: '🕐 Submitted',
          value: submittedAt,
          inline: true,
        },
        {
          name: '🏷️ Selected services',
          value: servicesList,
          inline: false,
        },
        {
          name: '🌐 Source',
          value: source && typeof source === 'string' ? source : '—',
          inline: false,
        },
        {
          name: '💬 Message',
          value: message.trim().slice(0, 1000) + (message.length > 1000 ? '…' : ''),
          inline: false,
        },
      ],
      footer: {
        text: 'Zephlo Tech • Contact Modal',
      },
      timestamp: now.toISOString(),
    };

    const discordRes = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'Zephlo Tech Form',
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
    console.error('Contact modal API error:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
