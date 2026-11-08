
import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'

import { getStalls } from './services/stallService'
import type { Stall } from './services/stallService'

import {
  getMe,
  getToken,
  logoutUser,
} from './services/authService'
import type {
  AuthUser,
  UserRole,
} from './services/authService'

import StallDetail from './components/StallDetail'
import RegisterForm from './components/RegisterForm'
import LoginForm from './components/LoginForm'
import CreateStallForm from './components/CreateStallForm'
import EditStallForm from './components/EditStallForm'
import DeleteStallButton from './components/DeleteStallButton'



const LIMIT = 6


type PageView =
  | 'home'
  | 'login'
  | 'register'
  | 'account'
  | 'create'
  | 'edit'


const colors = {
  primary: '#E96C35',
  primaryDark: '#C85221',
  peach: '#FFE3D0',
  cream: '#FFF8F2',
  white: '#FFFFFF',
  text: '#49372F',
  muted: '#88766D',
  border: '#F0DED2',
}

const roleLabels: Record<UserRole, string> = {
  admin: 'Admin',
  owner: 'Owner',
  customer: 'Customer',
}

const primaryButton: CSSProperties = {
  padding: '12px 20px',
  border: 'none',
  borderRadius: '12px',
  backgroundColor: colors.primary,
  color: colors.white,
  fontWeight: 700,
  cursor: 'pointer',
}

const secondaryButton: CSSProperties = {
  padding: '12px 20px',
  border: `1px solid ${colors.border}`,
  borderRadius: '12px',
  backgroundColor: '#FFF0E4',
  color: colors.primaryDark,
  fontWeight: 700,
  cursor: 'pointer',
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

function App() {
  // =====================================
  // STATE DATA WARUNG
  // =====================================
  const [stalls, setStalls] = useState<Stall[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [refreshKey, setRefreshKey] = useState(0)
  const [deleteSuccess, setDeleteSuccess] = useState('')


  // =====================================
  // STATE NAVIGASI
  // =====================================
  const [view, setView] = useState<PageView>('home')

  const [selectedStallId, setSelectedStallId] =
    useState<number | null>(null)


  const [editingStallId, setEditingStallId] =
    useState<number | null>(null)


  // =====================================
  // STATE AUTENTIKASI
  // =====================================
  const [currentUser, setCurrentUser] =
    useState<AuthUser | null>(null)

  const [checkingSession, setCheckingSession] =
    useState(Boolean(getToken()))

  const totalPages = Math.max(
    1,
    Math.ceil(total / LIMIT)
  )

  const canManageStalls =
    currentUser?.role === 'admin' ||
    currentUser?.role === 'owner'

  // =====================================
  // MENGAMBIL DATA WARUNG
  // =====================================
  useEffect(() => {
    const controller = new AbortController()

    async function loadStalls() {
      setLoading(true)
      setError('')

      try {
        const result = await getStalls(
          controller.signal,
          search,
          category,
          page,
          LIMIT
        )

        setStalls(result.data)
        setTotal(result.meta.total)
      } catch (err) {
        if (controller.signal.aborted) return

        setStalls([])
        setTotal(0)

        setError(
          err instanceof Error
            ? err.message
            : 'Terjadi kesalahan saat memuat data'
        )
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadStalls()

    return () => controller.abort()
  }, [search, category, page, refreshKey])

  // =====================================
  // MEMERIKSA SESI LOGIN
  // =====================================
  useEffect(() => {
    let active = true

    if (!getToken()) {
      setCheckingSession(false)
      return
    }

    getMe()
      .then((user) => {
        if (active) {
          setCurrentUser(user)
        }
      })
      .catch(() => {
        if (active) {
          logoutUser()
          setCurrentUser(null)
        }
      })
      .finally(() => {
        if (active) {
          setCheckingSession(false)
        }
      })

    return () => {
      active = false
    }
  }, [])

  // =====================================
  // FUNGSI NAVIGASI
  // =====================================
  function navigateTo(nextView: PageView) {
    setSelectedStallId(null)
    setView(nextView)

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  function handleLoginSuccess(user: AuthUser) {
    setCurrentUser(user)
    navigateTo('account')
  }

  function handleLogout() {
    logoutUser()
    setCurrentUser(null)
    navigateTo('home')
  }

  function openStallDetail(id: number) {
    setSelectedStallId(id)
    setView('home')

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }


  function handleEditStall(id: number) {
    setEditingStallId(id)
    navigateTo('edit')
  }

  function handleStallUpdated() {
    setRefreshKey((prev) => prev + 1)
  }



  function handleStallDeleted() {
    setDeleteSuccess('Warung berhasil dihapus!')
    setPage(1)
    setRefreshKey((prev) => prev + 1)
  }



  // Setelah warung berhasil dibuat
  function handleStallCreated() {
    setSearch('')
    setCategory('')
    setPage(1)

    // Mengambil ulang data dari backend
    setRefreshKey((prev) => prev + 1)

    // Tetap di form agar pesan sukses terlihat
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* =====================================
          NAVBAR
          ===================================== */}
      <header
        style={{
          backgroundColor: colors.white,
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        <nav
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '18px 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          {/* LOGO */}
          <button
            type="button"
            onClick={() => navigateTo('home')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: 'none',
              border: 'none',
              padding: 0,
              color: colors.text,
              fontSize: '21px',
              fontWeight: 800,
            }}
          >
            <span
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '14px',
                display: 'grid',
                placeItems: 'center',
                backgroundColor: colors.peach,
                fontSize: '24px',
              }}
            >
              🍽️
            </span>

            Review Kantin
          </button>

          {/* MENU */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              flexWrap: 'wrap',
            }}
          >
            <button
              type="button"
              onClick={() => navigateTo('home')}
              style={{
                background: 'none',
                border: 'none',
                padding: '10px',
                color: colors.primaryDark,
                fontWeight: 700,
              }}
            >
              Daftar Warung
            </button>

            {/* MENU TAMBAH WARUNG */}
            {!checkingSession && canManageStalls && (
              <button
                type="button"
                onClick={() => navigateTo('create')}
                style={primaryButton}
              >
                + Tambah Warung
              </button>
            )}

            {/* MENU AUTENTIKASI */}
            {checkingSession ? (
              <span
                style={{
                  color: colors.muted,
                  fontSize: '13px',
                }}
              >
                Memeriksa sesi...
              </span>
            ) : currentUser ? (
              <>
                <button
                  type="button"
                  onClick={() => navigateTo('account')}
                  style={secondaryButton}
                >
                  👤 {currentUser.name}
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  style={secondaryButton}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => navigateTo('login')}
                  style={secondaryButton}
                >
                  Login
                </button>

                <button
                  type="button"
                  onClick={() => navigateTo('register')}
                  style={primaryButton}
                >
                  Daftar
                </button>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* =====================================
          KONTEN HALAMAN
          ===================================== */}

        {/* NOTIFIKASI DELETE BERHASIL */}
        {deleteSuccess && (
          <div
            role="status"
            style={{
              position: 'fixed',
              top: '90px',
              right: '24px',
              zIndex: 9999,
              maxWidth: '360px',
              padding: '16px 20px',
              backgroundColor: '#EAF8EE',
              color: '#287A49',
              border: '1px solid #A9DDB8',
              borderRadius: '14px',
              boxShadow: '0 8px 25px rgba(0,0,0,0.12)',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              fontWeight: 600,
            }}
          >
            <span>✅ {deleteSuccess}</span>

            <button
              type="button"
              onClick={() => setDeleteSuccess('')}
              aria-label="Tutup notifikasi"
              style={{
                border: 'none',
                background: 'transparent',
                color: '#287A49',
                fontSize: '20px',
                cursor: 'pointer',
              }}
            >
              ×
            </button>
          </div>
        )}

      <main
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '32px clamp(18px, 4vw, 36px) 70px',
          minHeight: '70vh',
        }}
      >
        {/* REGISTER */}
        {view === 'register' && (
          <RegisterForm
            onSwitchToLogin={() => navigateTo('login')}
          />
        )}

        {/* LOGIN */}
        {view === 'login' && (
          <LoginForm
            onSwitchToRegister={() => navigateTo('register')}
            onLoginSuccess={handleLoginSuccess}
          />
        )}

        {/* =====================================
            TAMBAH WARUNG
            ===================================== */}
        {view === 'create' && (
          canManageStalls ? (
            <CreateStallForm
              onCancel={() => navigateTo('home')}
              onCreated={handleStallCreated}
            />
          ) : (
            <section
              style={{
                maxWidth: '600px',
                margin: '40px auto',
                padding: '32px',
                backgroundColor: colors.white,
                border: `1px solid ${colors.border}`,
                borderRadius: '20px',
              }}
            >
              <h2>Akses Ditolak</h2>

              <p style={{ color: colors.muted }}>
                Hanya Admin dan Owner yang dapat
                menambahkan warung.
              </p>

              <button
                type="button"
                onClick={() => navigateTo('home')}
                style={primaryButton}
              >
                Kembali ke Daftar Warung
              </button>
            </section>
          )
        )}


        {/* HALAMAN EDIT WARUNG */}
        {view === 'edit' && editingStallId !== null && (
          canManageStalls ? (
            <EditStallForm
              stallId={editingStallId}
              onCancel={() => navigateTo('home')}
              onUpdated={handleStallUpdated}
            />
          ) : (
            <section style={{ textAlign: 'center', padding: '40px' }}>
              <h2>Akses Ditolak</h2>
              <p>Hanya Admin dan Owner yang dapat mengakses fitur edit.</p>
              <button
                type="button"
                onClick={() => navigateTo('home')}
                style={primaryButton}
              >
                Kembali
              </button>
            </section>
          )
        )}


        {/* =====================================
            INFORMASI AKUN
            ===================================== */}
        {view === 'account' && (
          <section
            style={{
              maxWidth: '620px',
              margin: '40px auto',
              padding: '32px',
              backgroundColor: colors.white,
              border: `1px solid ${colors.border}`,
              borderRadius: '24px',
              boxShadow:
                '0 8px 30px rgba(145,83,50,0.08)',
            }}
          >
            {currentUser ? (
              <>
                <div
                  style={{
                    textAlign: 'center',
                    marginBottom: '30px',
                  }}
                >
                  <div
                    style={{
                      width: '72px',
                      height: '72px',
                      margin: '0 auto 16px',
                      borderRadius: '22px',
                      backgroundColor: colors.peach,
                      display: 'grid',
                      placeItems: 'center',
                      fontSize: '34px',
                    }}
                  >
                    👤
                  </div>

                  <h1
                    style={{
                      fontSize: '28px',
                      margin: '0 0 8px',
                    }}
                  >
                    Informasi Akun
                  </h1>

                  <p
                    style={{
                      color: colors.muted,
                      margin: 0,
                    }}
                  >
                    Data pengguna yang sedang login
                  </p>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gap: '18px',
                    padding: '24px',
                    borderRadius: '16px',
                    backgroundColor: colors.cream,
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  <div>
                    <small style={{ color: colors.muted }}>
                      ID Pengguna
                    </small>

                    <p
                      style={{
                        margin: '4px 0 0',
                        fontWeight: 700,
                      }}
                    >
                      #{currentUser.id}
                    </p>
                  </div>

                  <div>
                    <small style={{ color: colors.muted }}>
                      Nama Pengguna
                    </small>

                    <p
                      style={{
                        margin: '4px 0 0',
                        fontWeight: 700,
                      }}
                    >
                      {currentUser.name}
                    </p>
                  </div>

                  <div>
                    <small style={{ color: colors.muted }}>
                      Email
                    </small>

                    <p
                      style={{
                        margin: '4px 0 0',
                        fontWeight: 700,
                        overflowWrap: 'anywhere',
                      }}
                    >
                      {currentUser.email}
                    </p>
                  </div>

                  <div>
                    <small style={{ color: colors.muted }}>
                      Role
                    </small>

                    <p style={{ margin: '6px 0 0' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '8px 14px',
                          borderRadius: '20px',
                          backgroundColor: colors.peach,
                          color: colors.primaryDark,
                          fontWeight: 700,
                        }}
                      >
                        {roleLabels[currentUser.role]}
                      </span>
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '12px',
                    marginTop: '24px',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => navigateTo('home')}
                    style={secondaryButton}
                  >
                    Lihat Daftar Warung
                  </button>

                  {canManageStalls && (
                    <button
                      type="button"
                      onClick={() => navigateTo('create')}
                      style={primaryButton}
                    >
                      + Tambah Warung
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleLogout}
                    style={secondaryButton}
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2>Belum Login</h2>

                <p style={{ color: colors.muted }}>
                  Silakan login untuk melihat informasi akun.
                </p>

                <button
                  type="button"
                  onClick={() => navigateTo('login')}
                  style={primaryButton}
                >
                  Login Sekarang
                </button>
              </>
            )}
          </section>
        )}

        {/* =====================================
            HALAMAN UTAMA
            ===================================== */}
        {view === 'home' && (
          <>
            {selectedStallId !== null ? (
              /* DETAIL WARUNG */
              <section
                style={{
                  backgroundColor: colors.white,
                  padding: '28px',
                  border: `1px solid ${colors.border}`,
                  borderRadius: '24px',
                  boxShadow:
                    '0 8px 28px rgba(145,83,50,0.07)',
                }}
              >
                <StallDetail
                  stallId={selectedStallId}
                  onBack={() => {
                    setSelectedStallId(null)

                    window.scrollTo({
                      top: 0,
                      behavior: 'smooth',
                    })
                  }}
                />
              </section>
            ) : (
              <>
                {/* HERO SECTION */}
                <section
                  style={{
                    position: 'relative',
                    overflow: 'hidden',
                    background:
                      'linear-gradient(120deg, #FFF0E4, #FFE0C9)',
                    border: '1px solid #F8D5BD',
                    borderRadius: '28px',
                    padding: 'clamp(28px, 5vw, 56px)',
                    marginBottom: '42px',
                  }}
                >
                  <div
                    style={{
                      position: 'relative',
                      zIndex: 1,
                      maxWidth: '680px',
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '8px 14px',
                        backgroundColor: colors.white,
                        color: colors.primaryDark,
                        borderRadius: '30px',
                        fontSize: '12px',
                        fontWeight: 700,
                        letterSpacing: '1px',
                        marginBottom: '20px',
                      }}
                    >
                      ✨ JELAJAHI KANTIN KAMPUS
                    </span>

                    <h1
                      style={{
                        fontSize: 'clamp(32px, 5vw, 52px)',
                        lineHeight: 1.2,
                        margin: '0 0 16px',
                        fontWeight: 800,
                      }}
                    >
                      Cari makanan enak,
                      <br />

                      <span style={{ color: colors.primary }}>
                        mulai dari sini!
                      </span>
                    </h1>

                    <p
                      style={{
                        color: '#775B4A',
                        fontSize: '16px',
                        maxWidth: '520px',
                        margin: '0 0 26px',
                      }}
                    >
                      Temukan informasi warung kantin,
                      lihat rating dan ulasan, lalu pilih
                      tempat makan favoritmu.
                    </p>

                    <a
                      href="#daftar-warung"
                      style={{
                        ...primaryButton,
                        display: 'inline-block',
                        textDecoration: 'none',
                      }}
                    >
                      Jelajahi Warung →
                    </a>
                  </div>

                  <div
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      right: '-40px',
                      top: '-70px',
                      width: '280px',
                      height: '280px',
                      background:
                        'rgba(255,255,255,0.28)',
                      borderRadius: '50%',
                    }}
                  />

                  <div
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      right: '90px',
                      bottom: '-120px',
                      width: '220px',
                      height: '220px',
                      background:
                        'rgba(255,160,100,0.18)',
                      borderRadius: '50%',
                    }}
                  />
                </section>

                {/* DAFTAR WARUNG */}
                <section id="daftar-warung">
                  <div style={{ marginBottom: '24px' }}>
                    <span
                      style={{
                        color: colors.primary,
                        fontWeight: 700,
                        fontSize: '13px',
                        letterSpacing: '1px',
                      }}
                    >
                      PILIHAN KANTIN
                    </span>

                    <h2
                      style={{
                        fontSize: '30px',
                        margin: '8px 0',
                      }}
                    >
                      Jelajahi Daftar Warung
                    </h2>

                    <p
                      style={{
                        color: colors.muted,
                        margin: 0,
                      }}
                    >
                      Temukan warung yang sesuai dengan seleramu.
                    </p>
                  </div>

                  {/* PENCARIAN DAN FILTER */}
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '16px',
                      alignItems: 'flex-end',
                      backgroundColor: colors.white,
                      padding: '24px',
                      border: `1px solid ${colors.border}`,
                      borderRadius: '20px',
                      marginBottom: '26px',
                      boxShadow:
                        '0 4px 18px rgba(145,83,50,0.05)',
                    }}
                  >
                    <div style={{ flex: '2 1 250px' }}>
                      <label
                        htmlFor="search"
                        style={{
                          display: 'block',
                          marginBottom: '8px',
                          fontSize: '14px',
                          fontWeight: 600,
                        }}
                      >
                        Cari Warung
                      </label>

                      <input
                        id="search"
                        type="search"
                        placeholder="Cari nama warung..."
                        value={search}
                        onChange={(e) => {
                          setSearch(e.target.value)
                          setPage(1)
                        }}
                        maxLength={100}
                        style={inputStyle}
                      />
                    </div>

                    <div style={{ flex: '1 1 180px' }}>
                      <label
                        htmlFor="category"
                        style={{
                          display: 'block',
                          marginBottom: '8px',
                          fontSize: '14px',
                          fontWeight: 600,
                        }}
                      >
                        Filter Kategori
                      </label>

                      <select
                        id="category"
                        value={category}
                        onChange={(e) => {
                          setCategory(e.target.value)
                          setPage(1)
                        }}
                        style={inputStyle}
                      >
                        <option value="">
                          Semua Kategori
                        </option>

                        <option value="Mie">Mie</option>
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSearch('')
                        setCategory('')
                        setPage(1)
                      }}
                      style={secondaryButton}
                    >
                      Reset Filter
                    </button>
                  </div>

                  {/* LOADING */}
                  {loading && (
                    <div
                      role="status"
                      style={{
                        backgroundColor: colors.white,
                        borderRadius: '16px',
                        padding: '36px',
                        textAlign: 'center',
                        color: colors.muted,
                      }}
                    >
                      ⏳ Memuat data warung...
                    </div>
                  )}

                  {/* ERROR */}
                  {!loading && error && (
                    <div
                      role="alert"
                      style={{
                        padding: '24px',
                        borderRadius: '14px',
                        color: '#B42318',
                        backgroundColor: '#FFF0EE',
                      }}
                    >
                      Gagal memuat data: {error}
                    </div>
                  )}

                  {/* EMPTY STATE */}
                  {!loading && !error && stalls.length === 0 && (
                    <div
                      style={{
                        textAlign: 'center',
                        backgroundColor: colors.white,
                        padding: '48px 20px',
                        border: `1px solid ${colors.border}`,
                        borderRadius: '20px',
                      }}
                    >
                      <div style={{ fontSize: '44px' }}>
                        🍽️
                      </div>

                      <h3>Warung tidak ditemukan</h3>

                      <p style={{ color: colors.muted }}>
                        {search || category
                          ? 'Coba gunakan kata kunci atau kategori lain.'
                          : 'Belum ada data warung yang tersedia.'}
                      </p>
                    </div>
                  )}

                  {/* KARTU WARUNG */}
                  {!loading && !error && stalls.length > 0 && (
                    <>
                      <p
                        style={{
                          color: colors.muted,
                          fontSize: '14px',
                          marginBottom: '20px',
                        }}
                      >
                        Menampilkan {stalls.length} dari {total} warung
                      </p>

                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns:
                            'repeat(auto-fit, minmax(260px, 1fr))',
                          gap: '22px',
                        }}
                      >
                        {stalls.map((stall) => (
                          <article
                            key={stall.id}
                            style={{
                              backgroundColor: colors.white,
                              border: `1px solid ${colors.border}`,
                              borderRadius: '20px',
                              padding: '24px',
                              boxShadow:
                                '0 5px 20px rgba(145,83,50,0.06)',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '12px',
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                gap: '12px',
                              }}
                            >
                              <div
                                style={{
                                  backgroundColor: '#FFF0E4',
                                  borderRadius: '14px',
                                  width: '52px',
                                  height: '52px',
                                  display: 'grid',
                                  placeItems: 'center',
                                  fontSize: '26px',
                                }}
                              >
                                🍜
                              </div>

                              {stall.isPopular && (
                                <span
                                  style={{
                                    backgroundColor: '#EAF8EE',
                                    color: '#328451',
                                    padding: '7px 10px',
                                    borderRadius: '20px',
                                    fontSize: '11px',
                                    fontWeight: 700,
                                  }}
                                >
                                  ★ Populer
                                </span>
                              )}
                            </div>

                            <h3
                              style={{
                                fontSize: '20px',
                                margin: '4px 0 0',
                              }}
                            >
                              {stall.name}
                            </h3>

                            <div
                              style={{
                                display: 'grid',
                                gap: '8px',
                                color: colors.muted,
                                fontSize: '14px',
                              }}
                            >
                              <div>
                                🏷️ {stall.category || 'Tanpa kategori'}
                              </div>

                              <div>
                                📍 {stall.location || 'Lokasi belum tersedia'}
                              </div>

                              <div>
                                ⭐ {stall.avgRating} ({stall.reviewCount} ulasan)
                              </div>
                            </div>


                            <div
                              style={{
                                marginTop: 'auto',
                                paddingTop: '12px',
                              }}
                            >
                              {/* Tombol Lihat Detail */}
                              <button
                                type="button"
                                onClick={() => openStallDetail(stall.id)}
                                style={{
                                  ...secondaryButton,
                                  width: '100%',
                                }}
                              >
                                Lihat Detail →
                              </button>

                              {/* Tombol Edit hanya untuk Admin dan Owner */}
                              {canManageStalls && (
                                <button
                                  type="button"
                                  onClick={() => handleEditStall(stall.id)}
                                  style={{
                                    ...primaryButton,
                                    width: '100%',
                                    marginTop: '10px',
                                  }}
                                >
                                  ✏️ Edit Warung
                                </button>
                              )}

                              {/* Tombol Hapus: Khusus Admin */}
                              {currentUser?.role === 'admin' && (
                                <div style={{ marginTop: '10px' }}>
                                  <DeleteStallButton
                                    stallId={stall.id}
                                    stallName={stall.name}
                                    onDeleted={handleStallDeleted}
                                  />
                                </div>
                              )}
                            </div>
                          </article>
                        ))}
                      </div>

                      {/* PAGINATION */}
                      {totalPages > 1 && (
                        <nav
                          aria-label="Navigasi halaman warung"
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '14px',
                            marginTop: '36px',
                          }}
                        >
                          <button
                            type="button"
                            disabled={page === 1}
                            onClick={() =>
                              setPage((prev) =>
                                Math.max(1, prev - 1)
                              )
                            }
                            style={{
                              ...secondaryButton,
                              backgroundColor: colors.white,
                            }}
                          >
                            ← Sebelumnya
                          </button>

                          <span
                            style={{
                              padding: '12px 16px',
                              borderRadius: '12px',
                              backgroundColor: colors.peach,
                              color: colors.primaryDark,
                              fontWeight: 700,
                              fontSize: '14px',
                            }}
                          >
                            Halaman {page} dari {totalPages}
                          </span>

                          <button
                            type="button"
                            disabled={page >= totalPages}
                            onClick={() =>
                              setPage((prev) =>
                                Math.min(
                                  totalPages,
                                  prev + 1
                                )
                              )
                            }
                            style={{
                              ...secondaryButton,
                              backgroundColor: colors.white,
                            }}
                          >
                            Berikutnya →
                          </button>
                        </nav>
                      )}
                    </>
                  )}
                </section>
              </>
            )}
          </>
        )}
      </main>

      {/* =====================================
          FOOTER
          ===================================== */}
      <footer
        style={{
          borderTop: `1px solid ${colors.border}`,
          backgroundColor: colors.white,
          padding: '24px',
          textAlign: 'center',
          color: colors.muted,
          fontSize: '13px',
        }}
      >
        Review Kantin — Sistem Informasi Review Kantin
      </footer>
    </div>
  )
}

export default App
