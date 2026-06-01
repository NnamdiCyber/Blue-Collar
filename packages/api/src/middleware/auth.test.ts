import { describe, it, expect, vi, beforeEach } from 'vitest'
import jwt from 'jsonwebtoken'
import { authenticate, authorize } from './auth.js'
import type { Request, Response, NextFunction } from 'express'

process.env.JWT_SECRET = 'test-secret'

vi.mock('../config/env.js', () => ({ env: { JWT_SECRET: 'test-secret' } }))

function makeRes() {
  const res: any = {}
  res.status = vi.fn().mockReturnValue(res)
  res.json = vi.fn().mockReturnValue(res)
  return res as Response
}

const next = vi.fn() as unknown as NextFunction

beforeEach(() => vi.clearAllMocks())

// ── authenticate ──────────────────────────────────────────────────────────────

describe('authenticate', () => {
  it('returns 401 when no Authorization header is present', () => {
    const req = { headers: {} } as Request
    const res = makeRes()
    authenticate(req, res, next)
    expect(res.status).toHaveBeenCalledWith(401)
    expect(next).not.toHaveBeenCalled()
  })

  it('returns 401 when token is invalid', () => {
    const req = { headers: { authorization: 'Bearer bad.token.here' } } as Request
    const res = makeRes()
    authenticate(req, res, next)
    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Invalid token' }))
  })

  it('returns 401 when token is expired', () => {
    const expired = jwt.sign({ id: 'u1', role: 'user' }, 'test-secret', { expiresIn: -1 })
    const req = { headers: { authorization: `Bearer ${expired}` } } as Request
    const res = makeRes()
    authenticate(req, res, next)
    expect(res.status).toHaveBeenCalledWith(401)
  })

  it('calls next and sets req.user for a valid token', () => {
    const token = jwt.sign({ id: 'u1', role: 'curator' }, 'test-secret')
    const req = { headers: { authorization: `Bearer ${token}` } } as any
    const res = makeRes()
    authenticate(req, res, next)
    expect(next).toHaveBeenCalled()
    expect(req.user).toMatchObject({ id: 'u1', role: 'curator' })
  })
})

// ── authorize ─────────────────────────────────────────────────────────────────

describe('authorize', () => {
  it('returns 403 when req.user is not set', () => {
    const req = {} as Request
    const res = makeRes()
    authorize('admin')(req, res, next)
    expect(res.status).toHaveBeenCalledWith(403)
  })

  it('returns 403 when user role is not in allowed list', () => {
    const req = { user: { id: 'u1', role: 'user' } } as any
    const res = makeRes()
    authorize('admin', 'curator')(req, res, next)
    expect(res.status).toHaveBeenCalledWith(403)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Forbidden' }))
  })

  it('calls next when user role is allowed', () => {
    const req = { user: { id: 'u1', role: 'curator' } } as any
    const res = makeRes()
    authorize('admin', 'curator')(req, res, next)
    expect(next).toHaveBeenCalled()
  })

  it('allows admin role', () => {
    const req = { user: { id: 'u1', role: 'admin' } } as any
    const res = makeRes()
    authorize('admin')(req, res, next)
    expect(next).toHaveBeenCalled()
  })
})
