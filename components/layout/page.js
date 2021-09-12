import Head from 'next/head'
import Navigation from 'components/navigation'
import styles from './page.module.scss'

// https://terrill.ca/
// https://beberlei.de/
// https://voidstarzero.ca/
// https://hikari.noyu.me/

export default function Page({ title, description, children }) {
  return (
    <div className={styles.page}>
      <Head>
        <title>{title ? `Clinton Morrison - ${title}` : 'Clinton Morrison'}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header>
        <Navigation />
      </header>

      <main>
        <h1>{title}</h1>
        {children}
      </main>

      <footer>© 2014 - 2021 Clinton Morrison.</footer>
    </div>
  )
}
