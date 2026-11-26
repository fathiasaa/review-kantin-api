import { getToken } from './authService'

const API_BASE_URL = '/api/v1'

export interface AuditLog {
  id: number
  userId: number
  action: string
  targetTable: string
  targetId: number
  metadata: string | null
  createdAt: string
}

export interface AuditFilters {
  userId?: number
  targetId?: number
  page?: number
  pageSize?: number
}

export interface AuditPagination {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export interface AuditLogResponse {
  items: AuditLog[]
  pagination: AuditPagination
}

interface ApiResponse<T> {
  status: string
  message?: string
  data: T
}

async function auditRequest<T>(
  endpoint: string
): Promise<T> {
  const token = getToken()

  if (!token) {
    throw new Error('Silakan login terlebih dahulu')
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  const result: ApiResponse<T> | null =
    await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(
      result?.message ||
      `Request gagal (HTTP ${response.status})`
    )
  }

  if (!result || !('data' in result)) {
    throw new Error('Respons backend tidak valid')
  }

  return result.data
}

// Mengambil Audit Log dengan filter dan pagination
export async function getAuditLogs(
  filters: AuditFilters = {}
): Promise<AuditLogResponse> {
  const params = new URLSearchParams()

  if (filters.userId !== undefined) {
    params.set('userId', String(filters.userId))
  }

  if (filters.targetId !== undefined) {
    params.set('targetId', String(filters.targetId))
  }

  if (filters.page !== undefined) {
    params.set('page', String(filters.page))
  }

  if (filters.pageSize !== undefined) {
    params.set('pageSize', String(filters.pageSize))
  }

  const query = params.toString()

  return auditRequest<AuditLogResponse>(
    `/audit/${query ? `?${query}` : ''}`
  )
}

// Mengambil detail Audit Log berdasarkan ID
export async function getAuditLogById(
  id: number
): Promise<AuditLog> {
  return auditRequest<AuditLog>(`/audit/${id}`)
}