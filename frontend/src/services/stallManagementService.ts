
import { getToken } from './authService'

const API_BASE_URL = '/api/v1'

// Data untuk menambah warung
export interface CreateStallInput {
  name: string
  category?: string
  location?: string
  description?: string
}

// Data untuk mengubah warung
export type UpdateStallInput = Partial<CreateStallInput>

// Mengambil pesan error dari respons backend
function getErrorMessage(data: unknown): string | null {
  if (!data || typeof data !== 'object') {
    return null
  }

  const result = data as Record<string, unknown>

  if (typeof result.message === 'string') {
    return result.message
  }

  if (typeof result.error === 'string') {
    return result.error
  }

  if (
    result.error &&
    typeof result.error === 'object'
  ) {
    const error = result.error as Record<string, unknown>

    if (typeof error.message === 'string') {
      return error.message
    }
  }

  return null
}

// Mengirim request CRUD dengan JWT
async function sendStallRequest(
  endpoint: string,
  method: 'POST' | 'PUT' | 'DELETE',
  body?: CreateStallInput | UpdateStallInput
): Promise<void> {
  const token = getToken()

  if (!token) {
    throw new Error('Silakan login terlebih dahulu.')
  }

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(body
          ? { 'Content-Type': 'application/json' }
          : {}),
      },
      ...(body
        ? { body: JSON.stringify(body) }
        : {}),
    }
  )

  if (!response.ok) {
    const data: unknown = await response
      .json()
      .catch(() => null)

    const backendMessage = getErrorMessage(data)

    if (response.status === 401) {
      throw new Error(
        'Sesi login tidak valid atau sudah kedaluwarsa. Silakan login kembali.'
      )
    }

    if (response.status === 403) {
      throw new Error(
        'Akses ditolak. Kamu tidak memiliki izin untuk melakukan tindakan ini.'
      )
    }

    if (response.status === 404) {
      throw new Error('Warung tidak ditemukan.')
    }

    throw new Error(
      backendMessage ||
      `Operasi gagal (HTTP ${response.status})`
    )
  }
}

// CREATE: Admin dan Owner
export async function createStall(
  data: CreateStallInput
): Promise<void> {
  await sendStallRequest('/stalls', 'POST', data)
}

// UPDATE: Admin atau Owner pemilik
export async function updateStall(
  id: number,
  data: UpdateStallInput
): Promise<void> {
  await sendStallRequest(`/stalls/${id}`, 'PUT', data)
}

// DELETE: Hanya Admin
export async function deleteStall(
  id: number
): Promise<void> {
  await sendStallRequest(`/stalls/${id}`, 'DELETE')
}
