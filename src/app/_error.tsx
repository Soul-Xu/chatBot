import { NextPage } from 'next'

interface Props {
  statusCode: number
}

// @ts-ignore
const Error: NextPage<Props> = ({ statusCode }) => {
  return (
    <p>
      {statusCode
        ? `An error ${statusCode} occurred on server`
        : 'An error occurred on client'}
    </p>
  )
}

// @ts-ignore
Error.getInitialProps = ({ res, err }) => {
  // Set default status code to 404 if both res and err are undefined
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Error