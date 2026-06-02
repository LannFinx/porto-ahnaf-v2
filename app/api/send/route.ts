// app/api/send/route.ts
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Inisialisasi Resend dengan API Key dari .env.local
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, subject, message } = body;

        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'Nama, Email, dan Pesan wajib diisi.' },
                { status: 400 }
            );
        }

        // Mengirim email menggunakan Resend
        const data = await resend.emails.send({
            from: 'Portfolio Contact <onboarding@resend.dev>', // Gunakan onboarding@resend.dev untuk testing
            to: ['ahnafisa02@gmail.com'], // Email tujuan Anda
            replyTo: email,
            subject: `[Misi Baru] ${subject || 'Pesan dari Portofolio'}`,
            html: `
        <div style="font-family: monospace; padding: 20px; background-color: #05070a; color: #f0f0f0; border: 1px solid #D4AF37;">
          <h2 style="color: #D4AF37; text-transform: uppercase;">Pesan Transmisi Baru</h2>
          <p><strong>Dari:</strong> ${name} (${email})</p>
          <p><strong>Subjek:</strong> ${subject}</p>
          <hr style="border-color: rgba(212, 175, 55, 0.2);" />
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      `,
        });

        return NextResponse.json({ success: true, data });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}