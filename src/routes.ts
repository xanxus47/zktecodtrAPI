import { createRoute, z } from '@hono/zod-openapi'
import {
  AttendanceListQuerySchema,
  AttendanceSchema,
  EmployeeListQuerySchema,
  EmployeeSchema,
  ErrorSchema,
  IdParamSchema,
} from './schemas'

const json = <T>(schema: T, description: string) => ({
  content: {
    'application/json': { schema },
  },
  description,
})

export const listEmployeesRoute = createRoute({
  method: 'get',
  path: '/employees',
  tags: ['Employees'],
  summary: 'List employees',
  request: {
    query: EmployeeListQuerySchema,
  },
  responses: {
    200: json(z.array(EmployeeSchema), 'Employee list'),
    500: json(ErrorSchema, 'Server or configuration error'),
    502: json(ErrorSchema, 'Upstream Neon error'),
  },
})

export const getEmployeeRoute = createRoute({
  method: 'get',
  path: '/employees/{id}',
  tags: ['Employees'],
  summary: 'Get employee by id',
  request: {
    params: IdParamSchema,
  },
  responses: {
    200: json(EmployeeSchema, 'Employee'),
    404: json(ErrorSchema, 'Employee not found'),
    500: json(ErrorSchema, 'Server or configuration error'),
    502: json(ErrorSchema, 'Upstream Neon error'),
  },
})

export const listAttendanceRoute = createRoute({
  method: 'get',
  path: '/attendance',
  tags: ['Attendance'],
  summary: 'List attendance records',
  request: {
    query: AttendanceListQuerySchema,
  },
  responses: {
    200: json(z.array(AttendanceSchema), 'Attendance list'),
    500: json(ErrorSchema, 'Server or configuration error'),
    502: json(ErrorSchema, 'Upstream Neon error'),
  },
})

export const getAttendanceRoute = createRoute({
  method: 'get',
  path: '/attendance/{id}',
  tags: ['Attendance'],
  summary: 'Get attendance record by id',
  request: {
    params: IdParamSchema,
  },
  responses: {
    200: json(AttendanceSchema, 'Attendance record'),
    404: json(ErrorSchema, 'Attendance record not found'),
    500: json(ErrorSchema, 'Server or configuration error'),
    502: json(ErrorSchema, 'Upstream Neon error'),
  },
})

