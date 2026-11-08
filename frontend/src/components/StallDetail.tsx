
import { useEffect, useState } from 'react'
import { getStallById } from '../services/stallService'
import type { Stall } from '../services/stallService'

interface StallDetailProps {
  stallId: number
  onBack: () => void
}

function StallDetail({ stallId, onBack }: StallDetailProps) {
  const [stall, setStall] = useState<Stall | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function loadDetail() {
      setLoading(true)
      setError('')
      setStall(null)

      try {
        const result = await getStallById(
          stallId,
          controller.signal
        )

        setStall(result.data)
      } catch (err) {
        if (controller.signal.aborted) return

        setError(
          err instanceof Error
            ? err.message
            : 'Terjadi kesalahan saat memuat detail warung'
        )
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadDetail()

    return () => controller.abort()
  }, [stallId])

  const colors = {
    primary: '#E96C35',
    primaryDark: '#C85221',
    peach: '#FFE3D0',
    cream: '#FFF8F2',
    text: '#49372F',
    muted: '#88766D',
    border: '#F0DED2',
    white: '#FFFFFF',
  }

  return (
    <div style={{ color: colors.text }}>
      {/* Tombol kembali */}
      <button
        type="button"
        onClick={onBack}
        style={{
          padding: '12px 20px',
          marginBottom: '24px',
          border: `1px solid ${colors.border}`,
          borderRadius: '12px',
          backgroundColor: colors.cream,
          color: colors.primaryDark,
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        ← Kembali ke Daftar Warung
      </button>

      {/* Loading */}
      {loading && (
        <div
          role="status"
          style={{
            padding: '48px 20px',
            textAlign: 'center',
            backgroundColor: colors.cream,
            borderRadius: '18px',
          }}
        >
          <div style={{ fontSize: '36px', marginBottom: '12px' }}>
            🍽️
          </div>
          <p style={{ color: colors.muted }}>
            Memuat detail warung...
          </p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div
          role="alert"
          style={{
            padding: '28px',
            borderRadius: '16px',
            backgroundColor: '#FFF0EE',
            color: '#B42318',
          }}
        >
          <h3>Gagal Memuat Detail Warung</h3>
          <p>{error}</p>
        </div>
      )}

      {/* Detail Warung */}
      {!loading && !error && stall && (
        <article>
          {/* Hero Detail */}
          <div
            style={{
              background:
                'linear-gradient(120deg, #FFF0E4, #FFE0C9)',
              padding: 'clamp(24px, 5vw, 40px)',
              borderRadius: '22px',
              marginBottom: '28px',
              border: '1px solid #F8D5BD',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '20px',
              }}
            >
              <div
                style={{
                  width: '84px',
                  height: '84px',
                  borderRadius: '22px',
                  backgroundColor: colors.white,
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: '44px',
                }}
              >
                🍜
              </div>

              <div style={{ flex: '1 1 220px' }}>
                <span
                  style={{
                    color: colors.primaryDark,
                    fontSize: '12px',
                    fontWeight: 700,
                    letterSpacing: '1px',
                  }}
                >
                  DETAIL WARUNG
                </span>

                <h1
                  style={{
                    fontSize: 'clamp(26px, 4vw, 36px)',
                    margin: '8px 0',
                    fontWeight: 800,
                  }}
                >
                  {stall.name}
                </h1>

                <p
                  style={{
                    margin: 0,
                    color: '#775B4A',
                  }}
                >
                  🏷️ {stall.category || 'Tanpa kategori'}
                </p>
              </div>

              {stall.isPopular && (
                <span
                  style={{
                    backgroundColor: '#EAF8EE',
                    color: '#328451',
                    padding: '10px 16px',
                    borderRadius: '24px',
                    fontSize: '13px',
                    fontWeight: 700,
                  }}
                >
                  ★ Warung Populer
                </span>
              )}
            </div>
          </div>

          {/* Ringkasan */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '16px',
              marginBottom: '28px',
            }}
          >
            <div
              style={{
                padding: '22px',
                backgroundColor: colors.cream,
                borderRadius: '16px',
                border: `1px solid ${colors.border}`,
              }}
            >
              <div style={{ fontSize: '28px' }}>⭐</div>
              <h2 style={{ margin: '8px 0 4px' }}>
                {stall.avgRating ?? 0}
              </h2>
              <p style={{ margin: 0, color: colors.muted }}>
                Rata-rata Rating
              </p>
            </div>

            <div
              style={{
                padding: '22px',
                backgroundColor: colors.cream,
                borderRadius: '16px',
                border: `1px solid ${colors.border}`,
              }}
            >
              <div style={{ fontSize: '28px' }}>💬</div>
              <h2 style={{ margin: '8px 0 4px' }}>
                {stall.reviewCount ?? 0}
              </h2>
              <p style={{ margin: 0, color: colors.muted }}>
                Jumlah Ulasan
              </p>
            </div>
          </div>

          {/* Informasi lengkap */}
          <section
            style={{
              padding: 'clamp(20px, 4vw, 30px)',
              backgroundColor: colors.white,
              border: `1px solid ${colors.border}`,
              borderRadius: '20px',
            }}
          >
            <h2
              style={{
                fontSize: '24px',
                margin: '0 0 24px',
              }}
            >
              Informasi Warung
            </h2>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '24px',
              }}
            >
              <div>
                <p
                  style={{
                    color: colors.muted,
                    fontSize: '13px',
                    margin: '0 0 6px',
                  }}
                >
                  ID Warung
                </p>
                <strong>#{stall.id}</strong>
              </div>

              <div>
                <p
                  style={{
                    color: colors.muted,
                    fontSize: '13px',
                    margin: '0 0 6px',
                  }}
                >
                  Kategori
                </p>
                <strong>
                  {stall.category || 'Tidak tersedia'}
                </strong>
              </div>

              <div>
                <p
                  style={{
                    color: colors.muted,
                    fontSize: '13px',
                    margin: '0 0 6px',
                  }}
                >
                  Lokasi
                </p>
                <strong>
                  {stall.location || 'Tidak tersedia'}
                </strong>
              </div>
            </div>

            <div
              style={{
                marginTop: '28px',
                paddingTop: '24px',
                borderTop: `1px solid ${colors.border}`,
              }}
            >
              <h3
                style={{
                  fontSize: '18px',
                  margin: '0 0 12px',
                }}
              >
                📝 Deskripsi Warung
              </h3>

              <p
                style={{
                  color: colors.muted,
                  lineHeight: 1.8,
                  margin: 0,
                  overflowWrap: 'anywhere',
                }}
              >
                {stall.description || 'Belum ada deskripsi warung.'}
              </p>
            </div>
          </section>
        </article>
      )}
    </div>
  )
}

export default StallDetail
