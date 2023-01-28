import moment from 'moment'
import { formatDate } from '../../utils/format'
import AnnotatedTitle from '../common/AnnotatedTitle'
import DemoLink from './demoLink'

import styles from './project.module.scss'
import SourceLink from './sourceLink'

export default function Project({ project }) {
  if (!project.visible) {
    return null
  }

  return (
    <div className={styles.project}>
      <AnnotatedTitle title={project.title} note={formatDate(project.datePublished)} />

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
