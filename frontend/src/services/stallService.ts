
const API_BASE_URL = '/api/v1'

export interface Stall {
  id: number
  name: string
  category: string | null
  location: string | null
  description: string | null
  avgRating: number
  reviewCount: number
  isPopular: boolean
}

export interface StallsResponse {
  status: string
  data: Stall[]
  meta: {
    page: number
    limit: number
    total: number
  }
}

export interface StallDetailResponse {
  status: string
  data: Stall
}

// Mengambil daftar warung
export async function getStalls(
  signal?: AbortSignal,
  search: string = '',
  category: string = '',
  page: number = 1,
  limit: number = 6
): Promise<StallsResponse> {
  const params = new URLSearchParams()

  params.set('page', String(page))
  params.set('limit', String(limit))

  if (search.trim()) {
    params.set('search', search.trim())
  }

  if (category.trim()) {
    params.set('category', category.trim())
  }

  const response = await fetch(
    `${API_BASE_URL}/stalls?${params.toString()}`,
    {
      method: 'GET',
      signal,
    }
  )

  if (!response.ok) {
    throw new Error(
      `Gagal mengambil daftar warung (HTTP ${response.status})`
    )
  }

  return response.json()
}

// Mengambil detail satu warung berdasarkan ID
export async function getStallById(
  id: number,
  signal?: AbortSignal
): Promise<StallDetailResponse> {
  const response = await fetch(
    `${API_BASE_URL}/stalls/${id}`,
    {
      method: 'GET',
      signal,
    }
  )

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Warung tidak ditemukan')
    }

    throw new Error(
      `Gagal mengambil detail warung (HTTP ${response.status})`
    )
  }

  return response.json()
}
