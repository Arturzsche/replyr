import { Resend } from "resend"

export const resend = new Resend(process.env.RESEND_API_KEY)

// Resend's shared test sender works without a verified domain, but only delivers
// to the address that owns the Resend account.
export const ALERT_FROM = "Replyr <onboarding@resend.dev>"
