import type { APIRoute } from 'astro';
import { Resend } from 'resend';

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();

    // Honeypot: si bot-field tiene contenido, silenciosamente rechazar
    if (data['bot-field']) {
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    }

    const nombre   = (data.nombre   as string)?.trim();
    const telefono = (data.telefono as string)?.trim();
    const email    = (data.email    as string)?.trim();
    const consulta = (data.consulta as string)?.trim();

    if (!nombre || !email || !consulta) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Campos requeridos incompletos.' }),
        { status: 400 },
      );
    }

    await resend.emails.send({
      from: 'Ferraro Contactología <onboarding@resend.dev>',
      to:   'matiasjriosb@gmail.com', // temporal hasta verificar ferraroptico@yahoo.com.ar en Resend
      replyTo: email,
      subject: `Nueva consulta web — ${nombre}`,
      html: `
        <h2 style="font-family:sans-serif;color:#0d1424;">Nueva consulta desde el sitio web</h2>
        <table style="font-family:sans-serif;font-size:15px;border-collapse:collapse;width:100%">
          <tr><td style="padding:6px 12px;font-weight:bold;width:120px">Nombre:</td><td style="padding:6px 12px">${nombre}</td></tr>
          ${telefono ? `<tr><td style="padding:6px 12px;font-weight:bold">Teléfono:</td><td style="padding:6px 12px">${telefono}</td></tr>` : ''}
          <tr><td style="padding:6px 12px;font-weight:bold">Email:</td><td style="padding:6px 12px">${email}</td></tr>
          <tr><td style="padding:6px 12px;font-weight:bold;vertical-align:top">Consulta:</td><td style="padding:6px 12px">${consulta.replace(/\n/g, '<br>')}</td></tr>
        </table>
        <p style="font-family:sans-serif;font-size:13px;color:#666;margin-top:24px">
          Podés responder este mensaje directamente — llegará al correo del consultante.
        </p>
      `,
    });

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    console.error('[contact] Error sending email:', err);
    return new Response(
      JSON.stringify({ ok: false, error: 'Error al enviar el mensaje. Intente nuevamente.' }),
      { status: 500 },
    );
  }
};
