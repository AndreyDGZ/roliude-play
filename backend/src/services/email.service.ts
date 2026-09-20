import nodemailer from 'nodemailer';

interface PasswordResetEmailInput {
  email: string;
  resetLink: string;
  expiresInMinutes: number;
}

interface MailSettings {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
}

function getMailSettings(): MailSettings | null {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM;

  if (!host || !user || !pass || !from || !Number.isInteger(port)) {
    return null;
  }

  return {
    host,
    port,
    user,
    pass,
    from
  };
}

function renderPasswordResetText(resetLink: string, expiresInMinutes: number): string {
  return [
    'Olá,',
    '',
    'Recebemos uma solicitação para redefinir a senha da sua conta no Rolliude Play.',
    `Acesse o link abaixo para criar uma nova senha: ${resetLink}`,
    '',
    `Este link expira em ${expiresInMinutes} minutos e só pode ser usado uma vez.`,
    'Se você não pediu essa redefinição, ignore este e-mail.'
  ].join('\n');
}

export async function sendPasswordResetEmail(input: PasswordResetEmailInput): Promise<void> {
  const mailSettings = getMailSettings();

  if (!mailSettings) {
    return;
  }

  const transporter = nodemailer.createTransport({
    host: mailSettings.host,
    port: mailSettings.port,
    auth: {
      user: mailSettings.user,
      pass: mailSettings.pass
    }
  });

  await transporter.sendMail({
    from: mailSettings.from,
    to: input.email,
    subject: 'Rolliude Play - Redefinição de senha',
    text: renderPasswordResetText(input.resetLink, input.expiresInMinutes)
  });
}
