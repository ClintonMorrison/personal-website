import styles from './contactLink.module.scss'

export default function ContactLink({ icon, text, href }) {
  return (
    <a href={href} rel="noreferrer" className={styles.contactLink}>
      {icon}
      {text}
    </a>
  )
}
