import { Button, Input, Space } from 'antd'

interface PageSearchBarProps {
  value: string
  placeholder: string
  ariaLabel: string
  onChange: (value: string) => void
  onSearch: () => void
  buttonText?: string
}

export const PageSearchBar = ({
  value,
  placeholder,
  ariaLabel,
  onChange,
  onSearch,
  buttonText = 'Search',
}: PageSearchBarProps) => {
  return (
    <Space.Compact style={{ width: '100%' }} className="page-search-bar">
      <Input
        aria-label={ariaLabel}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onPressEnter={onSearch}
      />
      <Button type="primary" ghost onClick={onSearch} className="page-search-button">
        {buttonText}
      </Button>
    </Space.Compact>
  )
}
