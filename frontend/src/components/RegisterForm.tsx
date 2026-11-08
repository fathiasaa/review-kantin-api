
import { useState } from 'react'
import type { CSSProperties, FormEvent } from 'react'
import { registerUser } from '../services/authService'

interface RegisterFormProps {
  onSwitchToLogin?: () => void
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

function RegisterForm({
  onSwitchToLogin,
}: RegisterFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    setError('')
    setSuccess('')
    setLoading(true)

    try {
      await registerUser({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      })

      setSuccess(
        'Registrasi berhasil! Silakan login menggunakan akun yang telah dibuat.'
      )

      setName('')
      setEmail('')
      setPassword('')
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Registrasi gagal. Silakan coba lagi.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <section
      style={{
        maxWidth: '480px',
        margin: '40px auto',
        padding: '32px',
        backgroundColor: colors.white,
        border: `1px solid ${colors.border}`,
        borderRadius: '24px',
        boxShadow: '0 8px 30px rgba(145,83,50,0.08)',
      }}
    >
      {/* Header */}
      <div
        style={{
          textAlign: 'center',
          marginBottom: '28px',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            backgroundColor: '#FFF0E4',
            display: 'grid',
            placeItems: 'center',
            fontSize: '30px',
            margin: '0 auto 16px',
          }}
        >
          🍽️
        </div>

        <h1
          style={{
            fontSize: '28px',
            margin: '0 0 8px',
            color: colors.text,
          }}
        >
          Buat Akun Baru
        </h1>

        <p
          style={{
            color: colors.muted,
            fontSize: '14px',
            margin: 0,
          }}
        >
          Daftar untuk mulai menggunakan Review Kantin.
        </p>
      </div>

      {/* Pesan error */}
      {error && (
        <div
          role="alert"
          style={{
            backgroundColor: '#FFF0EE',
            color: '#B42318',
            padding: '14px',
            borderRadius: '12px',
            marginBottom: '20px',
            fontSize: '14px',
          }}
        >
          {error}
        </div>
      )}

      {/* Pesan berhasil */}
      {success && (
        <div
          role="status"
          style={{
            backgroundColor: '#EAF8EE',
            color: '#287A49',
            padding: '14px',
            borderRadius: '12px',
            marginBottom: '20px',
            fontSize: '14px',
          }}
        >
          {success}
        </div>
      )}

      {/* Form registrasi */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'grid',
          gap: '20px',
        }}
      >
        <div>
          <label htmlFor="register-name" style={labelStyle}>
            Nama Lengkap
          </label>

          <input
            id="register-name"
            type="text"
            placeholder="Masukkan nama lengkap"
            value={name}
            onChange={(e) => setName(e.target.value)}
            minLength={3}
            maxLength={100}
            autoComplete="name"
            required
            disabled={loading}
            style={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="register-email" style={labelStyle}>
            Email
          </label>

          <input
            id="register-email"
            type="email"
            placeholder="contoh@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={150}
            autoComplete="email"
            required
            disabled={loading}
            style={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="register-password" style={labelStyle}>
            Password
          </label>

          <input
            id="register-password"
            type="password"
            placeholder="Minimal 8 karakter"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            maxLength={72}
            autoComplete="new-password"
            required
            disabled={loading}
            style={inputStyle}
          />

          <p
            style={{
              fontSize: '12px',
              color: colors.muted,
              margin: '6px 0 0',
            }}
          >
            Gunakan password sepanjang 8–72 karakter.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px 20px',
            backgroundColor: colors.primary,
            color: colors.white,
            border: 'none',
            borderRadius: '12px',
            fontWeight: 700,
            fontSize: '15px',
          }}
        >
          {loading ? 'Memproses registrasi...' : 'Daftar Sekarang'}
        </button>
      </form>

      {/* Navigasi login */}
      <div
        style={{
          marginTop: '24px',
          paddingTop: '20px',
          borderTop: `1px solid ${colors.border}`,
          textAlign: 'center',
        }}
      >
        <p
          style={{
            color: colors.muted,
            fontSize: '14px',
            margin: 0,
          }}
        >
          Sudah punya akun?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            disabled={!onSwitchToLogin || loading}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              color: colors.primaryDark,
              fontWeight: 700,
            }}
          >
            Login di sini
          </button>
        </p>
      </div>
    </section>
  )
}

export default RegisterForm
