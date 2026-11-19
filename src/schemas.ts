import { z } from '@hono/zod-openapi'

export const ErrorSchema = z
  .object({
    error: z.string().openapi({ example: 'Not found' }),
  })
  .openapi('Error')

export const IdParamSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/)
    .openapi({
      param: { name: 'id', in: 'path' },
      example: '1',
    }),
})

export const UserIdParamSchema = z.object({
  user_id: z
    .string()
    .regex(/^\d+$/)
    .openapi({
      param: { name: 'user_id', in: 'path' },
      example: '1',
    }),
})

export const PayTypeSchema = z.enum(['daily_rate', 'record_only'])
export const ScheduleTypeSchema = z.enum(['regular', 'shift_day', 'shift_night'])

export const EmployeeSchema = z
  .object({
    id: z.number().int().openapi({ example: 1 }),
    name: z.string().openapi({ example: 'Jane Doe' }),
    position: z.string().nullable().openapi({ example: 'Cashier' }),
    daily_rate: z.coerce.number().nullable().openapi({ example: 550.0 }),
    pay_type: PayTypeSchema.openapi({ example: 'daily_rate' }),
    schedule_type: ScheduleTypeSchema.openapi({ example: 'regular' }),
    active: z.boolean().openapi({ example: true }),
  })
  .openapi('Employee')

export const EmployeeListQuerySchema = z.object({
  active: z
    .enum(['true', 'false'])
    .optional()
    .openapi({ param: { name: 'active', in: 'query' }, example: 'true' }),
  pay_type: PayTypeSchema.optional().openapi({
    param: { name: 'pay_type', in: 'query' },
    example: 'daily_rate',
  }),
  schedule_type: ScheduleTypeSchema.optional().openapi({
    param: { name: 'schedule_type', in: 'query' },
    example: 'regular',
  }),
  limit: z
    .string()
    .regex(/^\d+$/)
    .optional()
    .openapi({ param: { name: 'limit', in: 'query' }, example: '50' }),
  offset: z
    .string()
    .regex(/^\d+$/)
    .optional()
    .openapi({ param: { name: 'offset', in: 'query' }, example: '0' }),
})

export const AttendanceSchema = z
  .object({
    id: z.number().int().openapi({ example: 1 }),
    user_id: z.number().int().openapi({ example: 1 }),
    timestamp: z.string().openapi({
      example: '2026-11-18T00:00:00+08:00',
    }),
  })
  .openapi('Attendance')

export const AttendanceListQuerySchema = z.object({
  from: z
    .string()
    .optional()
    .openapi({
      param: { name: 'from', in: 'query' },
      example: '2026-11-01T00:00:00+08:00',
      description: 'Inclusive lower bound for timestamp',
    }),
  to: z
    .string()
    .optional()
    .openapi({
      param: { name: 'to', in: 'query' },
      example: '2026-11-18T23:59:59+08:00',
      description: 'Inclusive upper bound for timestamp',
    }),
  limit: z
    .string()
    .regex(/^\d+$/)
    .optional()
    .openapi({ param: { name: 'limit', in: 'query' }, example: '50' }),
  offset: z
    .string()
    .regex(/^\d+$/)
    .optional()
    .openapi({ param: { name: 'offset', in: 'query' }, example: '0' }),
})

export type Employee = z.infer<typeof EmployeeSchema>
export type Attendance = z.infer<typeof AttendanceSchema>
