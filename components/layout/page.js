import Head from 'next/head'
import Navigation from 'components/navigation'

export default function Page({ title, description, children }) {
  return (
    <div>
      <Head>
        <title>Clinton Morrison - {title}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navigation />

      <main>
        <h1>{title}</h1>
        {children}
      </main>

      <footer>© 2013 - 2021 Clinton Morrison.</footer>
    </div>
  )
}
