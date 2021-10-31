import nodemailer from 'nodemailer'

type SendMailInput = {
  from: string
  to: string
  subject: string
  text: string
  html?: string
}

export type SendEmail = (input: SendMailInput) => Promise<void>

export async function sendEmail({
  from,
  to,
  subject,
  text,
  html
}: SendMailInput) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST!,
    port: process.env.EMAIL_PORT,
    secure: process.env.SECURE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })

  const info = await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html
  })

  console.log('Message sent: %s', info.messageId)
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
}
