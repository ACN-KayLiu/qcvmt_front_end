import { Card, Typography } from 'antd'

interface CrudPlaceholderProps {
  title: string
  description: string
}

export const CrudPlaceholder = ({ title, description }: CrudPlaceholderProps) => {
  return (
    <Card>
      <Typography.Title level={5}>{title}</Typography.Title>
      <Typography.Paragraph>{description}</Typography.Paragraph>
    </Card>
  )
}
