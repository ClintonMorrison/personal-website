import moment from 'moment'
import DemoLink from './demoLink'

import styles from './project.module.scss'
import SourceLink from './sourceLink'

export default function Project({ project }) {
  if (!project.visible) {
    return null
  }

  return (
    <div className={styles.project}>
      <h2>{project.title}</h2>
      <div className="date">{moment(project.datePublished).format('MMM YYYY')}</div>

      <div className={styles.content}>
        <div className={styles.picture}>
          <img src={`/projects/${project.name}/picture.png`} />
        </div>

        <div styles={styles.details}>
          <p>{project.longDescription}</p>

          <div className={styles.actions}>
            <SourceLink project={project} />
            <DemoLink project={project} />
          </div>
        </div>
      </div>
    </div>
  )
}
