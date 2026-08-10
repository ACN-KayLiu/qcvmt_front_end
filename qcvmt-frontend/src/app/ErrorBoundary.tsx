import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Button, Result } from 'antd'

interface ErrorBoundaryState {
  hasError: boolean
  message: string
}

export class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  override state: ErrorBoundaryState = {
    hasError: false,
    message: '',
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, message: error.message }
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Unhandled UI error', error, info)
  }

  private readonly handleReload = () => {
    window.location.reload()
  }

  override render(): ReactNode {
    if (this.state.hasError) {
      return (
        <Result
          status="error"
          title="Unexpected error"
          subTitle={this.state.message}
          extra={<Button onClick={this.handleReload}>Reload</Button>}
        />
      )
    }

    return this.props.children
  }
}
