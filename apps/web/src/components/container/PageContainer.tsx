import { Helmet } from '@dr.pogodin/react-helmet'
import type { JSX } from 'react'

interface Props {
  description?: string
  children: JSX.Element | JSX.Element[]
  title?: string
}
const PageContainer = ({ title, description, children }: Props) => {
  console.log('renderizou PageContainer')
  return (
    <div>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Helmet>
      {children}
    </div>
  )
}

export default PageContainer
