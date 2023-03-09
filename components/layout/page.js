import Head from 'next/head'
import Navigation from 'components/navigation'
import styles from './page.module.scss'

export default function Page({ title, description, children }) {
  const titleText = title ? `Clinton Morrison - ${title}` : 'Clinton Morrison'
  return (
    <div className={styles.page}>
      <Head>
        <title>{titleText}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content={description} />
        <meta property="og:title" content={titleText} />
        <meta property="og:description" content={description} />
      </Head>

      <header>
        <Navigation />
      </header>

      <main>
        <div className={styles.contentContainer}>
          <h1>{title}</h1>
          {children}
        </div>
      </main>

      <footer>© 2014 - 2023 Clinton Morrison.</footer>
    </div>
  )
}
