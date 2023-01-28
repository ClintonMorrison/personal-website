export default function SourceLink({ project }) {
  switch (project.sourceType) {
    case 'github':
      return (
        <a
          className="button button-primary"
          href={project.sourceUrl}
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
      )
    case 'none':
    default:
      return null
  }
}
