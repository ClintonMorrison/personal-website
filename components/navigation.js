const links = [
  { title: 'Home', path: '/' },
  { title: 'Projects', path: '/projects' },
  { title: 'Resume', path: '/resume' },
  { title: 'Contact', path: '/contact' },
  { title: 'Blog', path: '/blog' },
]

export default function Navigation() {
  return (
    <nav>
      <ul>
        {links.map(({ title, path }) => (
          <li key={title}>
            <a href={path} className="active">
              {title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
