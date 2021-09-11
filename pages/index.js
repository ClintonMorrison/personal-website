import Page from 'components/layout/page'

export default function Home() {
  return (
    <Page title="Clinton Morrison" description="My personal website">
      <p>Hello there! I am a full-stack software engineer in Toronto, Canada.</p>

      <p>
        I&apos;m passionate about building great things. You can see some of my work
        <a>on this site</a>
        or on{' '}
        <a rel="noopener noreferrer" target="_blank" href="https://github.com/ClintonMorrison">
          GitHub
        </a>
        .
      </p>

      <p>I write about technology and my current projects on my blog.</p>
    </Page>
  )
}
