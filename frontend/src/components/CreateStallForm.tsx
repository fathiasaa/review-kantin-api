
import { useState } from 'react'
import type { CSSProperties, FormEvent } from 'react'
import { createStall } from '../services/stallManagementService'

interface CreateStallFormProps {
  onCancel: () => void
  onCreated?: () => void
}

const colors = {
  primary: '#E96C35',
  primaryDark: '#C85221',
  text: '#49372F',
  muted: '#88766D',
  border: '#F0DED2',
  cream: '#FFF8F2',
  white: '#FFFFFF',
}

const inputStyle: CSSProperties = {
  width: '100%',
  padding: '13px 16px',
  border: `1px solid ${colors.border}`,
  borderRadius: '12px',
  backgroundColor: colors.white,
  color: colors.text,
  fontSize: '14px',
}

const labelStyle: CSSProperties = {
  display: 'block',
  marginBottom: '8px',
  fontSize: '14px',
  fontWeight: 600,
  color: colors.text,
}

function CreateStallForm({
  onCancel,
  onCreated,
}: CreateStallFormProps) {
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      await createStall({
        name: name.trim(),
        ...(category.trim()
          ? { category: category.trim() }
          : {}),
        ...(location.trim()
          ? { location: location.trim() }
          : {}),
        ...(description.trim()
          ? { description: description.trim() }
          : {}),
      })

      setSuccess(
        'Warung berhasil ditambahkan ke database!'
      )

      // Kosongkan formulir setelah berhasil
      setName('')
      setCategory('')
      setLocation('')
      setDescription('')

      // Memberi tahu halaman utama bahwa data berubah
      onCreated?.()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Gagal menambahkan warung. Silakan coba lagi.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <section
      style={{
        maxWidth: '700px',
        margin: '30px auto',
        padding: 'clamp(20px, 4vw, 36px)',
        backgroundColor: colors.white,
        border: `1px solid ${colors.border}`,
        borderRadius: '24px',
        boxShadow: '0 8px 30px rgba(145,83,50,0.08)',
      }}
    >
      {/* Header Form */}
      <header style={{ marginBottom: '28px' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            backgroundColor: '#FFF0E4',
            display: 'grid',
            placeItems: 'center',
            fontSize: '30px',
            marginBottom: '16px',
          }}
        >
          🍽️
        </div>

        <h1
          style={{
            fontSize: '30px',
            margin: '0 0 10px',
            color: colors.text,
          }}
        >
          Tambah Warung Baru
        </h1>

        <p
          style={{
            margin: 0,
            color: colors.muted,
            fontSize: '14px',
          }}
        >
          Lengkapi informasi warung yang ingin
          ditambahkan ke Review Kantin.
        </p>
      </header>

      {/* Pesan Error */}
      {error && (
        <div
          role="alert"
          style={{
            padding: '16px',
            marginBottom: '22px',
            borderRadius: '12px',
            backgroundColor: '#FFF0EE',
            color: '#B42318',
            fontSize: '14px',
          }}
        >
          {error}
        </div>
      )}

      {/* Pesan Berhasil */}
      {success && (
        <div
          role="status"
          style={{
            padding: '16px',
            marginBottom: '22px',
            borderRadius: '12px',
            backgroundColor: '#EAF8EE',
            color: '#287A49',
            fontSize: '14px',
          }}
        >
          {success}
        </div>
      )}

      {/* Form Tambah Warung */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'grid',
          gap: '22px',
        }}
      >
        {/* Nama Warung */}
        <div>
          <label htmlFor="stall-name" style={labelStyle}>
            Nama Warung *
          </label>

          <input
            id="stall-name"
            type="text"
            placeholder="Contoh: Warung Makan Bahagia"
            value={name}
            onChange={(e) => setName(e.target.value)}
            minLength={3}
            maxLength={100}
            required
            disabled={loading}
            style={inputStyle}
          />
        </div>

        {/* Kategori */}
        <div>
          <label htmlFor="stall-category" style={labelStyle}>
            Kategori
          </label>

          <input
            id="stall-category"
            type="text"
            placeholder="Contoh: Mie, Minuman, Nasi"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            maxLength={50}
            disabled={loading}
            style={inputStyle}
          />
        </div>

        {/* Lokasi */}
        <div>
          <label htmlFor="stall-location" style={labelStyle}>
            Lokasi
          </label>

          <input
            id="stall-location"
            type="text"
            placeholder="Contoh: Kantin Gedung A"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            maxLength={100}
            disabled={loading}
            style={inputStyle}
          />
        </div>

        {/* Deskripsi */}
        <div>
          <label htmlFor="stall-description" style={labelStyle}>
            Deskripsi Warung
          </label>

          <textarea
            id="stall-description"
            placeholder="Tuliskan informasi singkat tentang warung..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={1000}
            rows={5}
            disabled={loading}
            style={{
              ...inputStyle,
              resize: 'vertical',
              lineHeight: 1.6,
            }}
          />
        </div>

        <p
          style={{
            margin: 0,
            padding: '14px',
            borderRadius: '12px',
            backgroundColor: colors.cream,
            color: colors.muted,
            fontSize: '13px',
          }}
        >
          ℹ️ Nama warung wajib diisi minimal 3 karakter.
          Informasi lainnya bersifat opsional.
          Pemilik warung akan ditentukan oleh backend
          berdasarkan akun yang sedang login.
        </p>

        {/* Tombol Aksi */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            paddingTop: '12px',
          }}
        >
          <button
            type="submit"
            disabled={loading}
            style={{
              flex: '1 1 200px',
              padding: '14px 20px',
              border: 'none',
              borderRadius: '12px',
              backgroundColor: colors.primary,
              color: colors.white,
              fontWeight: 700,
              fontSize: '14px',
            }}
          >
            {loading
              ? 'Menyimpan Warung...'
              : '+ Tambah Warung'}
          </button>

          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            style={{
              flex: '1 1 140px',
              padding: '14px 20px',
              border: `1px solid ${colors.border}`,
              borderRadius: '12px',
              backgroundColor: '#FFF0E4',
              color: colors.primaryDark,
              fontWeight: 700,
              fontSize: '14px',
            }}
          >
            Kembali
          </button>
        </div>
      </form>
    </section>
  )
}

export default CreateStallForm
