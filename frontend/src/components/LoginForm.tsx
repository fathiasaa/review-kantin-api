
import { useState } from 'react'
import type { CSSProperties, FormEvent } from 'react'
import { loginUser, getMe } from '../services/authService'
import type { AuthUser } from '../services/authService'

interface LoginFormProps {
  onSwitchToRegister?: () => void
  onLoginSuccess?: (user: AuthUser) => void
}

const colors = {
  primary: '#E96C35',
  primaryDark: '#C85221',
  text: '#49372F',
  muted: '#88766D',
  border: '#F0DED2',
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

function LoginForm({
  onSwitchToRegister,
  onLoginSuccess,
}: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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
      // 1. Login melalui backend
      await loginUser({
        email: email.trim().toLowerCase(),
        password,
      })

      // 2. Ambil identitas pengguna dari JWT
      const user = await getMe()

      setSuccess(
        `Login berhasil! Selamat datang, ${user.name}.`
      )

      setPassword('')

      // 3. Beri tahu komponen utama bahwa login berhasil
      onLoginSuccess?.(user)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Login gagal. Silakan coba lagi.'
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
      {/* Header Login */}
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
          Selamat Datang Kembali!
        </h1>

        <p
          style={{
            color: colors.muted,
            fontSize: '14px',
            margin: 0,
          }}
        >
          Login untuk mengakses akun Review Kantin.
        </p>
      </div>

      {/* Pesan Error */}
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

      {/* Pesan Berhasil */}
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

      {/* Form Login */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'grid',
          gap: '20px',
        }}
      >
        <div>
          <label
            htmlFor="login-email"
            style={labelStyle}
          >
            Email
          </label>

          <input
            id="login-email"
            type="email"
            placeholder="Masukkan email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            maxLength={150}
            required
            disabled={loading}
            style={inputStyle}
          />
        </div>

        <div>
          <label
            htmlFor="login-password"
            style={labelStyle}
          >
            Password
          </label>

          <input
            id="login-password"
            type="password"
            placeholder="Masukkan password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
            disabled={loading}
            style={inputStyle}
          />
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
          {loading ? 'Sedang Login...' : 'Login Sekarang'}
        </button>
      </form>

      {/* Navigasi Register */}
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
          Belum punya akun?{' '}
          <button
            type="button"
            onClick={onSwitchToRegister}
            disabled={!onSwitchToRegister || loading}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              color: colors.primaryDark,
              fontWeight: 700,
            }}
          >
            Daftar di sini
          </button>
        </p>
      </div>
    </section>
  )
}

export default LoginForm
