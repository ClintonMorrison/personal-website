export default function DemoLink({ project }) {
  const props = { className: 'button button-primary', href: project.demoUrl }
  switch (project.demoType) {
    case 'link':
      return <a {...props}>Try It</a>
    case 'npm':
      return <a {...props}>View on NPM</a>
    case 'paper':
      return <a {...props}>View Paper</a>
    case 'none':
    default:
      return null
  }
}
