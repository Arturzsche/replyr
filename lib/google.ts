import { google, type Auth } from "googleapis"
import { prisma } from "@/lib/prisma"

const BUSINESS_SCOPE = "https://www.googleapis.com/auth/business.manage"

/** Raised when the user must sign in with Google again (missing account, scope or refresh token). */
export class GoogleAuthError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "GoogleAuthError"
  }
}

/**
 * Returns an OAuth2 client authorised as the given user. The client refreshes the access token
 * automatically when it expires, and refreshed tokens are written back to the Account table.
 */
export async function getGoogleAuthClient(userId: string): Promise<Auth.OAuth2Client> {
  const account = await prisma.account.findFirst({
    where: { userId, provider: "google" },
    select: {
      id: true,
      access_token: true,
      refresh_token: true,
      expires_at: true,
      scope: true,
    },
  })

  if (!account) {
    throw new GoogleAuthError("Nenhuma conta Google associada. Entre novamente com o Google.")
  }
  if (account.scope && !account.scope.split(" ").includes(BUSINESS_SCOPE)) {
    throw new GoogleAuthError(
      "A conta Google não autorizou o acesso ao Perfil da Empresa. Entre novamente com o Google.",
    )
  }
  if (!account.refresh_token && !account.access_token) {
    throw new GoogleAuthError("Sessão Google inválida. Entre novamente com o Google.")
  }

  const client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
  )
  client.setCredentials({
    access_token: account.access_token ?? undefined,
    refresh_token: account.refresh_token ?? undefined,
    // Account.expires_at is in seconds; google-auth-library expects milliseconds.
    expiry_date: account.expires_at ? account.expires_at * 1000 : undefined,
  })

  client.on("tokens", (tokens) => {
    prisma.account
      .update({
        where: { id: account.id },
        data: {
          access_token: tokens.access_token ?? undefined,
          expires_at: tokens.expiry_date ? Math.floor(tokens.expiry_date / 1000) : undefined,
          ...(tokens.refresh_token ? { refresh_token: tokens.refresh_token } : {}),
          ...(tokens.scope ? { scope: tokens.scope } : {}),
        },
      })
      .catch((error) => console.error("getGoogleAuthClient: failed to persist refreshed tokens", error))
  })

  const expired = !account.expires_at || account.expires_at * 1000 <= Date.now() + 60_000
  if (expired) {
    if (!account.refresh_token) {
      throw new GoogleAuthError("A sessão Google expirou. Entre novamente com o Google.")
    }
    try {
      // Forces a refresh now so an invalid/revoked grant surfaces as a clear auth error.
      await client.getAccessToken()
    } catch (error) {
      console.error("getGoogleAuthClient: token refresh failed", error)
      throw new GoogleAuthError(
        "Não foi possível renovar o acesso ao Google. Entre novamente com o Google.",
      )
    }
  }

  return client
}
