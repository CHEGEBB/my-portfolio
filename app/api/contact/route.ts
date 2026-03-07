import { Resend } from "resend"
import { NextResponse } from "next/server"

const resend = new Resend(process.env.NEXT_RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json()

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 })
    }

    const { data, error } = await resend.emails.send({
      from: "Contact Form <onboarding@resend.dev>",
      to: "chegephil24@gmail.com",
      replyTo: email,
      subject: `[Portfolio] ${subject}`,
      html: `
        <div style="font-family:monospace;max-width:600px;margin:0 auto;padding:2rem;background:#0d0d1c;color:#e8e8f0;border-radius:8px;">
          <h2 style="color:#ff6b35;margin:0 0 1.5rem;font-size:1.5rem;letter-spacing:-.02em;">New message from portfolio</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:.5rem 0;color:#888;font-size:.75rem;letter-spacing:.1em;text-transform:uppercase;width:80px;">Name</td><td style="padding:.5rem 0;color:#e8e8f0;">${name}</td></tr>
            <tr><td style="padding:.5rem 0;color:#888;font-size:.75rem;letter-spacing:.1em;text-transform:uppercase;">Email</td><td style="padding:.5rem 0;"><a href="mailto:${email}" style="color:#ff6b35;">${email}</a></td></tr>
            <tr><td style="padding:.5rem 0;color:#888;font-size:.75rem;letter-spacing:.1em;text-transform:uppercase;">Subject</td><td style="padding:.5rem 0;color:#e8e8f0;">${subject}</td></tr>
          </table>
          <div style="margin-top:1.5rem;padding-top:1.5rem;border-top:1px solid rgba(255,255,255,0.08);">
            <p style="color:#888;font-size:.75rem;letter-spacing:.1em;text-transform:uppercase;margin:0 0 .75rem;">Message</p>
            <p style="color:#e8e8f0;line-height:1.7;margin:0;white-space:pre-wrap;">${message}</p>
          </div>
        </div>
      `,
    })

    if (error) {
      console.error("Resend error:", error)
      return NextResponse.json({ error: "Failed to send email." }, { status: 500 })
    }

    return NextResponse.json({ success: true, id: data?.id })
  } catch (err) {
    console.error("Contact API error:", err)
    return NextResponse.json({ error: "Internal server error." }, { status: 500 })
  }
}