import { useState } from 'react'
import { Button, Card, Form, Input, Space, Typography, message } from 'antd'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth'
import { normalizeQcDigits } from '@/utils/qc'

interface LoginFormValues {
  username: string
  password: string
  qcid: string
}

const LoginPage = () => {
  const [messageApi, contextHolder] = message.useMessage()
  const [submitting, setSubmitting] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  if (isAuthenticated) {
    return <Navigate to="/terminal" replace />
  }

  const onFinish = async (values: LoginFormValues) => {
    setSubmitting(true)
    try {
      await login(values.username, values.password, values.qcid)
      const from = (location.state as { from?: string } | null)?.from
      navigate(from || '/terminal', { replace: true })
    } catch (error) {
      messageApi.error((error as Error).message || 'Login failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="login-page">
      {contextHolder}
      <div className="login-shell">
        <section className="login-hero">
          <Typography.Title level={2}>QCVMT Control Suite</Typography.Title>
          <Typography.Paragraph>
            Unified terminal operation console for vessel planning, dispatch visibility, and control-room
            governance.
          </Typography.Paragraph>
          <div className="login-crane" aria-hidden="true">
            <svg viewBox="0 0 260 200" xmlns="http://www.w3.org/2000/svg">
              <line x1="0" y1="168" x2="260" y2="168" className="crane-sea" strokeWidth="1.5" />
              <path d="M 18 158 L 192 158 L 200 168 L 10 168 Z" className="crane-light" />
              <rect x="28" y="145" width="28" height="13" rx="1" className="crane-light" />
              <rect x="60" y="145" width="28" height="13" rx="1" className="crane-chip" />
              <rect x="92" y="145" width="28" height="13" rx="1" className="crane-light" />
              <rect x="124" y="145" width="28" height="13" rx="1" className="crane-chip" />
              <rect x="28" y="132" width="28" height="12" rx="1" className="crane-chip" />
              <rect x="60" y="132" width="28" height="12" rx="1" className="crane-light" />
              <rect x="92" y="132" width="28" height="12" rx="1" className="crane-chip" />
              <rect x="168" y="68" width="9" height="100" rx="2" className="crane-main" />
              <rect x="202" y="68" width="9" height="100" rx="2" className="crane-main" />
              <rect x="168" y="140" width="43" height="7" rx="2" className="crane-main" />
              <rect x="172" y="48" width="33" height="22" rx="3" className="crane-dark" />
              <rect x="30" y="62" width="142" height="7" rx="2" className="crane-main" />
              <rect x="211" y="62" width="36" height="7" rx="2" className="crane-main" />
              <line x1="188" y1="54" x2="30" y2="69" className="crane-rope" strokeWidth="1.2" />
              <line x1="188" y1="54" x2="247" y2="69" className="crane-rope" strokeWidth="1.2" />
              <circle cx="188" cy="51" r="5" className="crane-dark" />
              <rect x="90" y="58" width="18" height="11" rx="2" className="crane-dark" />
              <line x1="95" y1="69" x2="84" y2="120" className="crane-rope" strokeWidth="1.5" />
              <line x1="107" y1="69" x2="116" y2="120" className="crane-rope" strokeWidth="1.5" />
              <rect x="78" y="120" width="42" height="7" rx="2" className="crane-main" />
              <rect x="78" y="127" width="42" height="19" rx="2" className="crane-lifted" />
            </svg>
          </div>
        </section>

        <section className="login-panel">
          <Card>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Typography.Title level={3} className="login-title">
                Sign In
              </Typography.Title>
              <Typography.Paragraph className="login-desc" type="secondary">
                Enter your operational account to continue.
              </Typography.Paragraph>

              <Form<LoginFormValues> layout="vertical" onFinish={(values) => void onFinish(values)}>
                <Form.Item
                  label="Username"
                  name="username"
                  rules={[{ required: true, message: 'Username is required' }]}
                >
                  <Input autoComplete="username" />
                </Form.Item>

                <Form.Item
                  label="Password"
                  name="password"
                  rules={[{ required: true, message: 'Password is required' }]}
                >
                  <Input.Password autoComplete="current-password" />
                </Form.Item>

                <Form.Item
                  label="QC Number"
                  name="qcid"
                  getValueFromEvent={(event: React.ChangeEvent<HTMLInputElement>) =>
                    normalizeQcDigits(event.target.value)
                  }
                  rules={[
                    { required: true, message: 'QC number is required' },
                    { pattern: /^\d+$/, message: 'Enter the QC number only' },
                  ]}
                >
                  <Input addonBefore="QC" placeholder="16" inputMode="numeric" autoComplete="off" />
                </Form.Item>

                <Button type="primary" htmlType="submit" loading={submitting} block>
                  Login
                </Button>
              </Form>
            </Space>
          </Card>
        </section>
      </div>
    </div>
  )
}

export default LoginPage
