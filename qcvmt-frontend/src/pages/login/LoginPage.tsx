import { useState } from 'react'
import { Button, Card, Form, Input, Space, Typography, message } from 'antd'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth'

interface LoginFormValues {
  username: string
  password: string
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
      await login(values.username, values.password)
      const from = (location.state as { from?: string } | null)?.from
      navigate(from || '/terminal', { replace: true })
    } catch (error) {
      messageApi.error((error as Error).message || 'Login failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page-shell" style={{ display: 'grid', placeItems: 'center', minHeight: '100vh' }}>
      {contextHolder}
      <Card style={{ width: 'min(100%, 420px)' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Typography.Title level={3}>QCVMT Login</Typography.Title>
          <Typography.Paragraph>Please sign in with your account.</Typography.Paragraph>

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

            <Button type="primary" htmlType="submit" loading={submitting} block>
              Login
            </Button>
          </Form>
        </Space>
      </Card>
    </div>
  )
}

export default LoginPage
