
import { useEffect, useState } from 'react'
import type { CSSProperties, FormEvent } from 'react'

import { getStallById } from '../services/stallService'
import { updateStall } from '../services/stallManagementService'

interface EditStallFormProps {
  stallId: number
  onCancel: () => void
  onUpdated?: () => void
}

const inputStyle: CSSProperties = {
  width: '100%',
  padding: '13px 16px',
  border: '1px solid #F0DED2',
  borderRadius: '12px',
  backgroundColor: '#FFFFFF',
  color: '#49372F',
  fontSize: '14px',
  boxSizing: 'border-box',
}

const labelStyle: CSSProperties = {
  display: 'block',
  marginBottom: '8px',
  fontSize: '14px',
  fontWeight: 600,
  color: '#49372F',
}

function EditStallForm({
  stallId,
  onCancel,
  onUpdated,
}: EditStallFormProps) {
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Mengambil data warung berdasarkan ID
  useEffect(() => {
    const controller = new AbortController()

    async function loadStall() {
      setLoading(true)
      setError('')
      setSuccess('')

      try {
        const result = await getStallById(
          stallId,
          controller.signal
        )

        if (controller.signal.aborted) return

        setName(result.data.name)
        setCategory(result.data.category ?? '')
        setLocation(result.data.location ?? '')
        setDescription(result.data.description ?? '')
      } catch (err) {
        if (controller.signal.aborted) return

        setError(
          err instanceof Error
            ? err.message
            : 'Gagal mengambil data warung.'
        )
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadStall()

    return () => controller.abort()
  }, [stallId])

  // Mengirim perubahan ke backend
  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    setSaving(true)
    setError('')
    setSuccess('')

    try {
      await updateStall(stallId, {
        name: name.trim(),
        category: category.trim(),
        location: location.trim(),
        description: description.trim(),
      })

      setSuccess('Data warung berhasil diperbarui!')
      onUpdated?.()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Gagal memperbarui warung.'
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <section
      style={{
        maxWidth: '700px',
        margin: '30px auto',
        padding: 'clamp(20px, 4vw, 36px)',
        backgroundColor: '#FFFFFF',
        border: '1px solid #F0DED2',
        borderRadius: '24px',
        boxShadow: '0 8px 30px rgba(145,83,50,0.08)',
      }}
    >
      <div style={{ marginBottom: '28px' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            display: 'grid',
            placeItems: 'center',
            backgroundColor: '#FFF0E4',
            borderRadius: '20px',
            fontSize: '30px',
            marginBottom: '16px',
          }}
        >
          ✏️
        </div>

        <h1
          style={{
            margin: '0 0 10px',
            color: '#49372F',
            fontSize: '30px',
          }}
        >
          Edit Warung
        </h1>

        <p
          style={{
            margin: 0,
            color: '#88766D',
            fontSize: '14px',
          }}
        >
          Perbarui informasi warung yang sudah terdaftar.
          ID Warung: #{stallId}
        </p>
      </div>

      {loading && (
        <p role="status" style={{ color: '#88766D' }}>
          Memuat informasi warung...
        </p>
      )}

      {error && (
        <div
          role="alert"
          style={{
            padding: '15px',
            marginBottom: '20px',
            backgroundColor: '#FFF0EE',
            color: '#B42318',
            borderRadius: '12px',
          }}
        >
          {error}
        </div>
      )}

      {success && (
        <div
          role="status"
          style={{
            padding: '15px',
            marginBottom: '20px',
            backgroundColor: '#EAF8EE',
            color: '#287A49',
            borderRadius: '12px',
          }}
        >
          {success}
        </div>
      )}

      {!loading && (
        <form
          onSubmit={handleSubmit}
          style={{
            display: 'grid',
            gap: '22px',
          }}
        >
          <div>
            <label htmlFor="edit-name" style={labelStyle}>
              Nama Warung *
            </label>

            <input
              id="edit-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              minLength={3}
              maxLength={100}
              required
              disabled={saving}
              style={inputStyle}
            />
          </div>

          <div>
            <label htmlFor="edit-category" style={labelStyle}>
              Kategori
            </label>

            <input
              id="edit-category"
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              maxLength={50}
              disabled={saving}
              style={inputStyle}
            />
          </div>

          <div>
            <label htmlFor="edit-location" style={labelStyle}>
              Lokasi
            </label>

            <input
              id="edit-location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              maxLength={100}
              disabled={saving}
              style={inputStyle}
            />
          </div>

          <div>
            <label htmlFor="edit-description" style={labelStyle}>
              Deskripsi Warung
            </label>

            <textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={1000}
              rows={5}
              disabled={saving}
              style={{
                ...inputStyle,
                resize: 'vertical',
                lineHeight: 1.6,
              }}
            />
          </div>

          <p
            style={{
              padding: '14px',
              margin: 0,
              backgroundColor: '#FFF8F2',
              borderRadius: '12px',
              color: '#88766D',
              fontSize: '13px',
            }}
          >
            ℹ️ Admin dapat mengedit seluruh warung.
            Owner hanya dapat mengedit warung miliknya
            sendiri. Izin akan diperiksa oleh backend.
          </p>

          <div
            style={{
              display: 'flex',
              gap: '12px',
              flexWrap: 'wrap',
            }}
          >
            <button
              type="submit"
              disabled={saving || Boolean(error)}
              style={{
                flex: '1 1 200px',
                padding: '14px 20px',
                border: 'none',
                borderRadius: '12px',
                backgroundColor: '#E96C35',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {saving
                ? 'Menyimpan Perubahan...'
                : 'Simpan Perubahan'}
            </button>

            <button
              type="button"
              onClick={onCancel}
              disabled={saving}
              style={{
                flex: '1 1 140px',
                padding: '14px 20px',
                border: '1px solid #F0DED2',
                borderRadius: '12px',
                backgroundColor: '#FFF0E4',
                color: '#C85221',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Kembali
            </button>
          </div>
        </form>
      )}
    </section>
  )
}

export default EditStallForm
