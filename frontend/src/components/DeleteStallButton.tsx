
import { useState } from 'react'
import { deleteStall } from '../services/stallManagementService'

interface DeleteStallButtonProps {
  stallId: number
  stallName: string
  onDeleted: () => void
}

function DeleteStallButton({
  stallId,
  stallName,
  onDeleted,
}: DeleteStallButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleDelete() {
    // Konfirmasi sebelum menghapus
    const confirmed = window.confirm(
      `Apakah kamu yakin ingin menghapus "${stallName}"?\n\n` +
      'Data yang dihapus tidak dapat dikembalikan.'
    )

    if (!confirmed) {
      return
    }

    setLoading(true)
    setError('')

    try {
      // Memanggil DELETE /api/v1/stalls/:id
      await deleteStall(stallId)

      // Memberi tahu App.tsx bahwa data berhasil dihapus
      onDeleted()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Gagal menghapus warung.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ width: '100%' }}>
      <button
        type="button"
        onClick={handleDelete}
        disabled={loading}
        style={{
          width: '100%',
          padding: '12px 20px',
          border: '1px solid #F5C4C0',
          borderRadius: '12px',
          backgroundColor: '#FFF0EE',
          color: '#B42318',
          fontWeight: 700,
          fontSize: '14px',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? 'Menghapus Warung...' : '🗑️ Hapus Warung'}
      </button>

      {error && (
        <div
          role="alert"
          style={{
            marginTop: '10px',
            padding: '12px',
            borderRadius: '10px',
            backgroundColor: '#FFF0EE',
            color: '#B42318',
            fontSize: '13px',
          }}
        >
          {error}
        </div>
      )}
    </div>
  )
}

export default DeleteStallButton
