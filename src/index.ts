import { swaggerUI } from '@hono/swagger-ui'
import { OpenAPIHono } from '@hono/zod-openapi'
import { query } from './lib/db'
import {
  getAttendanceRoute,
  getEmployeeRoute,
  listAttendanceRoute,
  listEmployeesRoute,
} from './routes'
import type { Attendance, Employee } from './schemas'

const app = new OpenAPIHono<{ Bindings: CloudflareBindings }>()

const defaultLimit = 50

app.openapi(listEmployeesRoute, async (c) => {
  const q = c.req.valid('query')
  const conditions: string[] = []
  const params: unknown[] = []

  if (q.active !== undefined) {
    params.push(q.active === 'true')
    conditions.push(`active = $${params.length}`)
  }
  if (q.pay_type) {
    params.push(q.pay_type)
    conditions.push(`pay_type = $${params.length}`)
  }
  if (q.schedule_type) {
    params.push(q.schedule_type)
    conditions.push(`schedule_type = $${params.length}`)
  }

  params.push(Number(q.limit ?? defaultLimit))
  const limitPlaceholder = `$${params.length}`
  params.push(Number(q.offset ?? 0))
  const offsetPlaceholder = `$${params.length}`

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
  const result = await query<Employee>(
    c.env,
    `SELECT id, name, position, daily_rate, pay_type, schedule_type, active
     FROM employees
     ${where}
     ORDER BY id ASC
     LIMIT ${limitPlaceholder}
     OFFSET ${offsetPlaceholder}`,
    params
  )

  if (!result.ok) {
    return c.json({ error: result.error }, result.status)
  }

  return c.json(result.data, 200)
})

app.openapi(getEmployeeRoute, async (c) => {
  const { id } = c.req.valid('param')
  const result = await query<Employee>(
    c.env,
    `SELECT id, name, position, daily_rate, pay_type, schedule_type, active
     FROM employees
     WHERE id = $1
     LIMIT 1`,
    [Number(id)]
  )

  if (!result.ok) {
    return c.json({ error: result.error }, result.status)
  }

  const employee = result.data[0]
  if (!employee) {
    return c.json({ error: 'Employee not found' }, 404)
  }

  return c.json(employee, 200)
})

app.openapi(listAttendanceRoute, async (c) => {
  const q = c.req.valid('query')
  const conditions: string[] = []
  const params: unknown[] = []

  if (q.user_id) {
    params.push(Number(q.user_id))
    conditions.push(`user_id = $${params.length}`)
  }
  if (q.from) {
    params.push(q.from)
    conditions.push(`timestamp >= $${params.length}`)
  }
  if (q.to) {
    params.push(q.to)
    conditions.push(`timestamp <= $${params.length}`)
  }

  params.push(Number(q.limit ?? defaultLimit))
  const limitPlaceholder = `$${params.length}`
  params.push(Number(q.offset ?? 0))
  const offsetPlaceholder = `$${params.length}`

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
  const result = await query<Attendance>(
    c.env,
    `SELECT id, user_id, timestamp
     FROM attendance
     ${where}
     ORDER BY timestamp DESC
     LIMIT ${limitPlaceholder}
     OFFSET ${offsetPlaceholder}`,
    params
  )

  if (!result.ok) {
    return c.json({ error: result.error }, result.status)
  }

  return c.json(result.data, 200)
})

app.openapi(getAttendanceRoute, async (c) => {
  const { id } = c.req.valid('param')
  const result = await query<Attendance>(
    c.env,
    `SELECT id, user_id, timestamp
     FROM attendance
     WHERE id = $1
     LIMIT 1`,
    [Number(id)]
  )

  if (!result.ok) {
    return c.json({ error: result.error }, result.status)
  }

  const record = result.data[0]
  if (!record) {
    return c.json({ error: 'Attendance record not found' }, 404)
  }

  return c.json(record, 200)
})

app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    title: 'Endpoint Attendance API',
    version: '1.0.0',
    description: 'Read-only endpoints for employees and attendance.',
  },
})

app.get('/ui', swaggerUI({ url: '/doc' }))

app.get('/', (c) => c.redirect('/ui'))

export default app
