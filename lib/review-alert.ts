import { ALERT_FROM, resend } from "@/lib/resend"

export type ReviewAlert = {
  to: string
  businessId: string
  businessName: string
  authorName: string
  rating: number
  comment: string | null
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

function appUrl() {
  return (process.env.AUTH_URL ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000").replace(/\/$/, "")
}

function renderAlertHtml(alert: ReviewAlert) {
  const rating = Math.min(5, Math.max(0, Math.round(alert.rating)))
  const stars = "★".repeat(rating) + "☆".repeat(5 - rating)
  const starColor = rating >= 4 ? "#f59e0b" : rating === 3 ? "#a1a1aa" : "#dc2626"
  const comment = alert.comment?.trim()
  const link = `${appUrl()}/dashboard/business/${alert.businessId}`

  return `<!doctype html>
<html lang="pt-BR">
  <body style="margin:0;padding:24px;background:#f4f4f5;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#18181b;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e4e4e7;border-radius:12px;">
      <tr>
        <td style="padding:28px;">
          <p style="margin:0 0 4px;font-size:13px;color:#71717a;">Replyr · ${escapeHtml(alert.businessName)}</p>
          <h1 style="margin:0 0 20px;font-size:20px;line-height:1.3;">Nova avaliação de ${escapeHtml(alert.authorName)}</h1>
          <p style="margin:0 0 16px;font-size:22px;letter-spacing:2px;color:${starColor};">${stars} <span style="font-size:14px;color:#71717a;letter-spacing:0;">${rating}/5</span></p>
          <div style="margin:0 0 24px;padding:16px;background:#f4f4f5;border-radius:8px;font-size:15px;line-height:1.6;white-space:pre-line;">${
            comment ? escapeHtml(comment) : '<em style="color:#71717a;">Avaliação sem comentário.</em>'
          }</div>
          <a href="${escapeHtml(link)}" style="display:inline-block;padding:10px 18px;background:#18181b;color:#ffffff;text-decoration:none;border-radius:8px;font-size:14px;font-weight:600;">Responder no Replyr</a>
        </td>
      </tr>
    </table>
    <p style="max-width:560px;margin:16px auto 0;font-size:12px;color:#a1a1aa;text-align:center;">Você recebeu este e-mail porque os alertas de avaliação estão ativos para ${escapeHtml(alert.businessName)}.</p>
  </body>
</html>`
}

/** Sends the alert e-mail. No auth checks: callers must have authorised the business already. */
export async function deliverReviewAlert(alert: ReviewAlert) {
  const { data, error } = await resend.emails.send({
    from: ALERT_FROM,
    to: alert.to,
    subject: `Nova avaliação ${alert.rating}★ em ${alert.businessName}`,
    html: renderAlertHtml(alert),
  })
  if (error) throw new Error(`Resend: ${error.name} - ${error.message}`)
  return data
}
