// @ts-ignore
import type { NextApiRequest, NextApiResponse } from 'next';
import { render } from '@react-email/render';
import FormMail from '@/emails/FormMail';
import { sendEmail } from '@/utils/mailProvider';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { emails, subject, body, formLink } = req.body;
  const errors = [];
  const sent = [];

  // Helper function to send emails and track successes/failures
  const sendMailToRecipient = async (email: string) => {
    try {
      const html = render(
        FormMail({
          subject,
          body,
          formLink
        })
      );

      const info = await sendEmail({
        to: email,
        subject,
        html
      });

      sent.push(info);
    } catch (error) {
      errors.push({ email, error });
    }
  };

  // Loop through each email and send the mail
  await Promise.all(emails.map((email: string) => sendMailToRecipient(email)));

  // Prepare the response
  const response = {
    sent: sent.length,
    failed: errors.length,
    errors: errors.map((err) => ({
      email: err.email,
      errorMessage: err.error.message
    }))
  };

  // Send the response back
  res.status(200).json(response);
}
