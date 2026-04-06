import { Resend } from "resend";

const resendClient = new Resend(process?.env?.RESEND_API_KEY);

export async function sendMail({
  from = "Misk <onboarding@resend.dev>",
  to,
  subject,
  html,
}: {
  from?: string;
  to: string[];
  subject: string;
  html: string;
}) {
  await resendClient.emails.send({
    from,
    to,
    subject,
    html,
  });
}

export const generateMailTemplate = ({
  title,
  user,
  content,
  actionSubtitle,
  actionLink,
  actionTitle,
}: {
  title?: string;
  user?: string;
  content?: string;
  actionSubtitle?: string;
  actionLink?: string;
  actionTitle?: string;
}) => {
  const isAr = true;
  return `<!DOCTYPE html>
<html lang="ar" dir="${isAr ? "rtl" : "ltr"}">
  <head>
    <meta charset="UTF-8" />
    <title>${title ?? "--"}</title>
    <style type="text/css">
      @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap');

      body, p, h1, h4, a {
        font-family: 'Cairo', Arial, sans-serif;
      }
    </style>
  </head>
  <body style="margin:12px; padding:8px; background-color:#0d181c; font-family: Arial, sans-serif;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td align="center" style="padding: 80px;">
          <table role="presentation" dir="${
            isAr ? "rtl" : "ltr"
          }" cellpadding="0" cellspacing="0" width="600" style="background-color:#111e22; color:#ffffff; padding:20px; border-radius:6px; text-align:${
            isAr ? "right" : "left"
          };">
            
            <tr>
              <td align="center" style="padding-bottom:12px; border-bottom:1px solid #555;">
                <img src="https://ukbahlwracfvnetnxlba.supabase.co/storage/v1/object/public/agzakahan-public-portal/New%20Project%20(2).png" alt="Agzakhana Logo" width="150" style="display:block;" />
              </td>
            </tr>

            <tr>
              <td style="padding:24px;">
                <h1 style="color:#ffffff; font-size:24px; margin:0; font-weight:bold;">${
                  title ?? "--"
                }</h1>
              </td>
            </tr>

            <tr>
              <td style="padding: 0 24px;">
                <h4 style="color:#dddddd; margin:0; font-size:16px;">${
                  isAr ? "مرحبا بك " : "Welcome "
                }, ${user ?? "--"}</h4>
              </td>
            </tr>

            <tr>
              <td style="padding:6px 24px;">
                <p style="color:#bbbbbb; margin:0; font-size:14px;">
                  ${content ?? "--"}
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding:12px 24px;">
                <p style="color:#bbbbbb; margin:0; font-size:14px;">
                  ${actionSubtitle ?? "--"}
                </p>
              </td>
            </tr>

            <tr>
              <td align="center" style="padding:20px 0;">
                <a href="${actionLink ?? "/"}" 
                  style="background-color:#4CAF50; color:#ffffff; text-decoration:none; padding:12px 20px; border-radius:4px; display:inline-block; font-size:16px;">
                  ${actionTitle ?? "--"}
                </a>
              </td>
            </tr>

            <tr>
              <td style="padding:20px;">
                <p style="color:#999999; font-size:12px; margin:0;">
                  ${"MAILS.COMMON.IGNORE_TEXT"}
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
};
