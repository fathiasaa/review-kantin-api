
import { useEffect, useState } from 'react'
import {
  getAuditLogs,
  getAuditLogById,
  type AuditLog as AuditLogType,
  type AuditPagination,
} from '../services/auditService'

export default function AuditLog() {
  const [logs, setLogs] = useState<AuditLogType[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const [pagination, setPagination] = useState<AuditPagination>({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [selectedLog, setSelectedLog] = useState<AuditLogType | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState('')

  const [userIdInput, setUserIdInput] = useState('')
  const [targetIdInput, setTargetIdInput] = useState('')

  const [userIdFilter, setUserIdFilter] = useState<number | undefined>()
  const [targetIdFilter, setTargetIdFilter] = useState<number | undefined>()

  const totalPages = pagination.totalPages
  const paginatedLogs = logs

  // FETCH AUDIT LOG
  useEffect(() => {
    async function loadAuditLogs() {
      try {
        setLoading(true)
        setError('')

        const data = await getAuditLogs({
          userId: userIdFilter,
          targetId: targetIdFilter,
          page: currentPage,
          pageSize: itemsPerPage,
        })

        setLogs(data.items)
        setPagination(data.pagination)
      } catch (err) {
        setLogs([])
        setPagination({
          page: currentPage,
          pageSize: itemsPerPage,
          total: 0,
          totalPages: 0,
        })

        setError(
          err instanceof Error
            ? err.message
            : 'Gagal mengambil Audit Log'
        )
      } finally {
        setLoading(false)
      }
    }

    loadAuditLogs()
  }, [userIdFilter, targetIdFilter, currentPage])

  // APPLY FILTER
  function handleApplyFilter() {
    setCurrentPage(1)

    setUserIdFilter(
      userIdInput.trim() !== ''
        ? Number(userIdInput)
        : undefined
    )

    setTargetIdFilter(
      targetIdInput.trim() !== ''
        ? Number(targetIdInput)
        : undefined
    )
  }

  // RESET FILTER
  function handleResetFilter() {
    setCurrentPage(1)
    setUserIdInput('')
    setTargetIdInput('')
    setUserIdFilter(undefined)
    setTargetIdFilter(undefined)
  }

  // FETCH DETAIL BY ID
  async function handleViewDetail(log: AuditLogType) {
    setSelectedLog(null)
    setDetailError('')
    setDetailLoading(true)

    try {
      const detail = await getAuditLogById(log.id)
      setSelectedLog(detail)
    } catch (err) {
      setDetailError(
        err instanceof Error
          ? err.message
          : 'Gagal mengambil detail Audit Log'
      )
    } finally {
      setDetailLoading(false)
    }
  }

  // PREVIOUS PAGE
  function handlePreviousPage() {
    setCurrentPage((prev) => Math.max(1, prev - 1))
  }

  // NEXT PAGE
  function handleNextPage() {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
  }

  // CLOSE DETAIL
  function handleCloseDetail() {
    setSelectedLog(null)
    setDetailError('')
  }

  return (
    <div>
      <h2>Audit Log</h2>
      <p>Riwayat aktivitas pengguna dalam sistem.</p>

      {/* FILTER */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          alignItems: 'flex-end',
          padding: '20px',
          marginBottom: '24px',
          backgroundColor: '#FFFFFF',
          border: '1px solid #F0DED2',
          borderRadius: '16px',
        }}
      >
        <div style={{ flex: '1 1 180px' }}>
          <label
            htmlFor="auditUserId"
            style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: 600,
            }}
          >
            User ID
          </label>

          <input
            id="auditUserId"
            type="number"
            min="1"
            placeholder="Masukkan User ID"
            value={userIdInput}
            onChange={(e) => setUserIdInput(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #F0DED2',
              borderRadius: '10px',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ flex: '1 1 180px' }}>
          <label
            htmlFor="auditTargetId"
            style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: 600,
            }}
          >
            Target ID
          </label>

          <input
            id="auditTargetId"
            type="number"
            min="1"
            placeholder="Masukkan Target ID"
            value={targetIdInput}
            onChange={(e) => setTargetIdInput(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #F0DED2',
              borderRadius: '10px',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <button
          type="button"
          onClick={handleApplyFilter}
          style={{
            padding: '12px 20px',
            border: 'none',
            borderRadius: '10px',
            backgroundColor: '#E96C35',
            color: '#FFFFFF',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Terapkan Filter
        </button>

        <button
          type="button"
          onClick={handleResetFilter}
          style={{
            padding: '12px 20px',
            border: '1px solid #F0DED2',
            borderRadius: '10px',
            backgroundColor: '#FFF0E4',
            color: '#C85221',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Reset
        </button>
      </div>

      {/* LOADING */}
      {loading && <p>Memuat Audit Log...</p>}

      {/* ERROR */}
      {!loading && error && (
        <p style={{ color: 'red' }}>{error}</p>
      )}

      {/* TABLE */}
      {!loading && !error && (
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              textAlign: 'left',
              backgroundColor: '#FFFFFF',
            }}
          >
            <thead>
              <tr>
                {[
                  'ID',
                  'User ID',
                  'Action',
                  'Target Table',
                  'Target ID',
                  'Waktu',
                ].map((header) => (
                  <th
                    key={header}
                    style={{
                      padding: '12px',
                      borderBottom: '2px solid #F0DED2',
                      background: '#FFE3D0',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {paginatedLogs.map((log) => (
                <tr
                  key={log.id}
                  onClick={() => handleViewDetail(log)}
                  style={{
                    cursor: 'pointer',
                    backgroundColor: '#FFFFFF',
                  }}
                >
                  <td style={{ padding: '12px', borderBottom: '1px solid #F0DED2' }}>
                    {log.id}
                  </td>

                  <td style={{ padding: '12px', borderBottom: '1px solid #F0DED2' }}>
                    {log.userId}
                  </td>

                  <td style={{ padding: '12px', borderBottom: '1px solid #F0DED2' }}>
                    {log.action}
                  </td>

                  <td style={{ padding: '12px', borderBottom: '1px solid #F0DED2' }}>
                    {log.targetTable}
                  </td>

                  <td style={{ padding: '12px', borderBottom: '1px solid #F0DED2' }}>
                    {log.targetId}
                  </td>

                  <td style={{ padding: '12px', borderBottom: '1px solid #F0DED2', whiteSpace: 'nowrap' }}>
                    {new Date(log.createdAt).toLocaleString('id-ID')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* EMPTY STATE */}
          {logs.length === 0 && (
            <div
              style={{
                padding: '30px',
                textAlign: 'center',
                color: '#88766D',
                backgroundColor: '#FFF8F2',
                borderRadius: '12px',
                marginTop: '16px',
              }}
            >
              Tidak ada data Audit Log yang ditemukan.
            </div>
          )}

          {/* PAGINATION */}
          {pagination.total > 0 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
                marginTop: '20px',
                padding: '16px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #F0DED2',
                borderRadius: '12px',
              }}
            >
              <p style={{ margin: 0, color: '#88766D' }}>
                Halaman {currentPage} dari {totalPages}
                {' '}({pagination.total} data)
              </p>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={handlePreviousPage}
                  disabled={loading || currentPage <= 1}
                  style={{
                    padding: '10px 16px',
                    border: '1px solid #F0DED2',
                    borderRadius: '8px',
                    backgroundColor:
                      loading || currentPage <= 1
                        ? '#F5F5F5'
                        : '#FFF0E4',
                    color: '#C85221',
                    cursor:
                      loading || currentPage <= 1
                        ? 'not-allowed'
                        : 'pointer',
                  }}
                >
                  Previous
                </button>

                <button
                  type="button"
                  onClick={handleNextPage}
                  disabled={loading || currentPage >= totalPages}
                  style={{
                    padding: '10px 16px',
                    border: '1px solid #F0DED2',
                    borderRadius: '8px',
                    backgroundColor:
                      loading || currentPage >= totalPages
                        ? '#F5F5F5'
                        : '#FFF0E4',
                    color: '#C85221',
                    cursor:
                      loading || currentPage >= totalPages
                        ? 'not-allowed'
                        : 'pointer',
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* DETAIL LOADING */}
      {detailLoading && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              padding: '24px',
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
            }}
          >
            Memuat detail Audit Log...
          </div>
        </div>
      )}

      {/* DETAIL ERROR */}
      {detailError && (
        <div
          onClick={handleCloseDetail}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#FFFFFF',
              width: '100%',
              maxWidth: '400px',
              padding: '24px',
              borderRadius: '16px',
            }}
          >
            <h3>Gagal Memuat Detail</h3>
            <p style={{ color: 'red' }}>{detailError}</p>

            <button
              type="button"
              onClick={handleCloseDetail}
              style={{
                padding: '10px 16px',
                border: 'none',
                borderRadius: '8px',
                backgroundColor: '#E96C35',
                color: '#FFFFFF',
                cursor: 'pointer',
              }}
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {selectedLog && (
        <div
          onClick={handleCloseDetail}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#FFFFFF',
              width: '100%',
              maxWidth: '600px',
              maxHeight: '85vh',
              overflowY: 'auto',
              padding: '24px',
              borderRadius: '16px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
              }}
            >
              <h3 style={{ margin: 0 }}>Detail Audit Log</h3>

              <button
                type="button"
                onClick={handleCloseDetail}
                style={{
                  border: 'none',
                  background: 'transparent',
                  fontSize: '24px',
                  cursor: 'pointer',
                }}
              >
                &times;
              </button>
            </div>

            <div style={{ display: 'grid', gap: '12px' }}>
              {[
                ['ID', selectedLog.id],
                ['User ID', selectedLog.userId],
                ['Action', selectedLog.action],
                ['Target Table', selectedLog.targetTable],
                ['Target ID', selectedLog.targetId],
                [
                  'Waktu',
                  new Date(selectedLog.createdAt).toLocaleString('id-ID'),
                ],
              ].map(([label, value]) => (
                <div
                  key={label}
                  style={{
                    padding: '12px',
                    backgroundColor: '#FFF8F2',
                    borderRadius: '8px',
                  }}
                >
                  <strong>{label}</strong>
                  <div style={{ marginTop: '4px' }}>{value}</div>
                </div>
              ))}

              <div
                style={{
                  padding: '12px',
                  backgroundColor: '#FFF8F2',
                  borderRadius: '8px',
                }}
              >
                <strong>Metadata</strong>

                <pre
                  style={{
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    marginTop: '8px',
                    fontSize: '12px',
                  }}
                >
                  {selectedLog.metadata
                    ? (() => {
                        try {
                          return JSON.stringify(
                            JSON.parse(selectedLog.metadata),
                            null,
                            2
                          )
                        } catch {
                          return selectedLog.metadata
                        }
                      })()
                    : 'Tidak ada metadata'}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
