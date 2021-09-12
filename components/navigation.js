import styles from './navigation.module.scss'

const links = [
  { title: 'Home', path: '/' },
  { title: 'Projects', path: '/projects' },
  { title: 'Resume', path: '/resume' },
  { title: 'Contact', path: '/contact' },
  { title: 'Blog', path: '/blog' },
]

export default function Navigation() {
  return (
    <nav className={styles.nav}>
      <dl>
        {links.map(({ title, path }) => (
          <dt key={title}>
            <a href={path} className="active">
              {title}
            </a>
          </dt>
        ))}
      </dl>
    </nav>
  )
}
