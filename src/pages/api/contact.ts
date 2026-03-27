import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

const resend = new Resend(import.meta.env.RESEND_API_KEY);

const CONTACT_EMAIL = import.meta.env.CONTACT_EMAIL ?? 'kontakt@ksiazczak-parkiet.pl';
const FROM_EMAIL = import.meta.env.FROM_EMAIL ?? 'formularz@ksiazczak-parkiet.pl';

function sanitize(str: string): string {
  return str.replace(/[<>&"']/g, (c) => {
    const map: Record<string, string> = {
      '<': '&lt;',
      '>': '&gt;',
      '&': '&amp;',
      '"': '&quot;',
      "'": '&#39;',
    };
    return map[c] ?? c;
  });
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();

    // Honeypot anti-spam
    const honeypot = formData.get('_honeypot')?.toString();
    if (honeypot && honeypot.length > 0) {
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    }

    const name = sanitize(formData.get('name')?.toString() ?? '');
    const phone = sanitize(formData.get('phone')?.toString() ?? '');
    const email = sanitize(formData.get('email')?.toString() ?? '');
    const service = sanitize(formData.get('service')?.toString() ?? '');
    const message = sanitize(formData.get('message')?.toString() ?? '');

    // Basic validation
    if (!name || !phone || !message) {
      return new Response(
        JSON.stringify({ error: 'Wymagane pola: imię, telefon, wiadomość' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const serviceLabels: Record<string, string> = {
      cyklinowanie: 'Cyklinowanie bezpyłowe',
      lakierowanie: 'Lakierowanie podłóg',
      olejowanie: 'Olejowanie podłóg',
      ukladanie: 'Układanie parkietu',
      schody: 'Schody drewniane',
      inne: 'Inne / Nie wiem',
    };

    const serviceLabel = service ? (serviceLabels[service] ?? service) : 'Nie podano';

    const { error } = await resend.emails.send({
      from: `Formularz Książczak <${FROM_EMAIL}>`,
      to: [CONTACT_EMAIL],
      replyTo: email || undefined,
      subject: `Nowa wiadomość od ${name} – ${serviceLabel}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #C8933A; padding: 20px 30px; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 20px;">📬 Nowa wiadomość z formularza</h1>
            <p style="color: rgba(255,255,255,0.8); margin: 5px 0 0; font-size: 14px;">ksiazczak-parkiet.pl</p>
          </div>
          <div style="background: #f9f9f7; padding: 30px; border: 1px solid #e5e5e5; border-top: none; border-radius: 0 0 10px 10px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #888; font-size: 13px; width: 120px; vertical-align: top;">Imię i nazwisko</td>
                <td style="padding: 8px 0; font-weight: bold; color: #1c1917;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #888; font-size: 13px; vertical-align: top;">Telefon</td>
                <td style="padding: 8px 0; font-weight: bold; color: #1c1917;">
                  <a href="tel:${phone.replace(/\s/g, '')}" style="color: #C8933A;">${phone}</a>
                </td>
              </tr>
              ${email ? `
              <tr>
                <td style="padding: 8px 0; color: #888; font-size: 13px; vertical-align: top;">Email</td>
                <td style="padding: 8px 0; color: #1c1917;">${email}</td>
              </tr>` : ''}
              <tr>
                <td style="padding: 8px 0; color: #888; font-size: 13px; vertical-align: top;">Usługa</td>
                <td style="padding: 8px 0; color: #1c1917;">
                  <span style="background: #FEF3C7; color: #92400E; padding: 3px 10px; border-radius: 20px; font-size: 13px;">${serviceLabel}</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #888; font-size: 13px; vertical-align: top;">Wiadomość</td>
                <td style="padding: 8px 0; color: #1c1917; white-space: pre-wrap;">${message}</td>
              </tr>
            </table>

            <div style="margin-top: 25px; padding: 15px; background: #fff; border-radius: 8px; border: 1px solid #e5e5e5; text-align: center;">
              <a href="tel:${phone.replace(/\s/g, '')}"
                style="display: inline-block; background: #16a34a; color: white; padding: 12px 30px; border-radius: 30px; text-decoration: none; font-weight: bold; font-size: 16px;">
                📞 Oddzwoń: ${phone}
              </a>
            </div>

            <p style="margin-top: 20px; font-size: 12px; color: #aaa; text-align: center;">
              Wiadomość wysłana z formularza na ksiazczak-parkiet.pl
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return new Response(
        JSON.stringify({ error: 'Błąd wysyłania emaila' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Contact API error:', err);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
