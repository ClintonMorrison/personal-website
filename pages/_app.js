import PropTypes from 'prop-types'
import Head from 'next/head'

import '../styles/normalize.css'
import '../styles/globals.scss'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta charset="utf-8" />
        <meta name="author" content="Clinton Morrison" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta property="og:locale" content="en-US" />

        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,300italic,700,700italic"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.css"
        />
        <link href="https://fonts.googleapis.com/css?family=Unica+One" rel="stylesheet" />
        <link
          href="https://fonts.googleapis.com/css?family=Roboto+Condensed:300,300i"
          rel="stylesheet"
        />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

MyApp.propTypes = {
  Component: PropTypes.func.isRequired,
  pageProps: PropTypes.shape({}).isRequired,
}

export default MyApp
