import styled from 'styled-components'

const Link = styled.a`
  display: inline-block;
  line-height: 1.4;
  text-align: center;
  margin-right: 1em;
  width: 4em;

  svg {
  }
`

export default function ContactLink({ icon, text, href }) {
  return (
    <Link href={href} rel="noreferrer">
      {icon}
      {text}
    </Link>
  )
}
