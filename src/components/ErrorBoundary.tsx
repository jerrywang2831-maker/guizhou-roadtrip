import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          height: '100vh', background: '#0f1923', color: '#e94560',
          fontSize: 16, flexDirection: 'column', gap: 12, padding: 40,
        }}>
          <p style={{ fontSize: 48 }}>⚠</p>
          <p>页面加载出错</p>
          <p style={{ fontSize: 13, color: '#8899aa' }}>{this.state.message}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: 16, padding: '8px 24px', borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.06)',
              color: '#fff', cursor: 'pointer', fontSize: 14,
            }}
          >
            重新加载
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
