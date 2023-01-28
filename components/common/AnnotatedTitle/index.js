import styles from './index.module.scss'

export default function AnnotatedTitle({ title, note }) {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      <span className={styles.note}>{note}</span>
    </div>
  )
}
