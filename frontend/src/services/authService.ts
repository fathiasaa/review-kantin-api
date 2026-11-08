
const API_BASE_URL = '/api/v1'
const TOKEN_KEY = 'review_kantin_token'

// Tipe role pengguna
export type UserRole = 'admin' | 'owner' | 'customer'

// Data pengguna
export interface AuthUser {
  id: number
  name: string
  email: string
  role: UserRole
  createdAt?: string
}

// Data untuk registrasi
export interface RegisterInput {
  name: string
  email: string
  password: string
}

// Data untuk login
export interface LoginInput {
  email: string
  password: string
}

// Respons login dari backend
interface LoginData {
  token: string
  tokenType: string
}

// Struktur respons umum API
interface ApiResponse<T> {
  status: string
  message?: string
  data: T
}

// Fungsi untuk mengirim request ke backend
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    }
  )

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

// Registrasi pengguna baru
export async function registerUser(
  input: RegisterInput
): Promise<AuthUser> {
  return apiRequest<AuthUser>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

// Login pengguna
export async function loginUser(
  input: LoginInput
): Promise<LoginData> {
  const result = await apiRequest<LoginData>(
    '/auth/login',
    {
      method: 'POST',
      body: JSON.stringify(input),
    }
  )

  // Simpan JWT selama sesi browser
  sessionStorage.setItem(TOKEN_KEY, result.token)

  return result
}

// Mengambil JWT yang tersimpan
export function getToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY)
}

// Mengambil informasi pengguna yang login
export async function getMe(): Promise<AuthUser> {
  const token = getToken()

  if (!token) {
    throw new Error('Silakan login terlebih dahulu')
  }

  return apiRequest<AuthUser>('/auth/me', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

// Logout pengguna
export function logoutUser(): void {
  sessionStorage.removeItem(TOKEN_KEY)
}
