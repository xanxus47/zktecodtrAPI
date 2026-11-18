import { neon } from '@neondatabase/serverless'

type QueryResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; status: 500 | 502 }

export function getSql(env: CloudflareBindings) {
  if (!env.ATTENDANCE_DATABASE_URL) {
    return null
  }

  return neon(env.ATTENDANCE_DATABASE_URL)
}

export async function query<T>(
  env: CloudflareBindings,
  text: string,
  params: unknown[] = []
): Promise<QueryResult<T[]>> {
  const sql = getSql(env)
  if (!sql) {
    return {
      ok: false,
      status: 500,
      error: 'Missing ATTENDANCE_DATABASE_URL. Add your Neon connection string to .dev.vars for local development.',
    }
  }

  try {
    const rows = await sql.query(text, params)
    return { ok: true, data: rows as T[] }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Neon query failed'
    return { ok: false, status: 502, error: message }
  }
}
