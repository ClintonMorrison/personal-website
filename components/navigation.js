import styles from './navigation.module.scss'

const links = [
  { title: 'Home', path: '/' },
  { title: 'Projects', path: '/projects' },
  { title: 'Resume', path: '/resume' },
  { title: 'Contact', path: '/contact' },
  { title: 'Blog', path: '/blog' },
]

export default function Navigation() {
  const lastIndex = links.length - 1
  return (
    <nav className={styles.nav}>
      <dl>
        {links.map(({ title, path }, i) => (
          <>
            <dt key={title}>
              <a href={path} className="active">
                {title}
              </a>
            </dt>
            {i !== lastIndex && (
              <dt key={`${title}-divider`} className={styles.divider}>
                /
              </dt>
            )}
          </>
        ))}
      </dl>
    </nav>
  )
}
