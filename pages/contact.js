import Page from 'components/layout/page'
import EmailIcon from 'components/common/icons/email'
import GithubIcon from 'components/common/icons/github'
import LinkedinIcon from 'components/common/icons/linkedin'
import TwitterIcon from 'components/common/icons/twitter'
import ContactLink from 'components/contactLink'

export default function Contact() {
  return (
    <Page title="Contact" description="...">
      <p>I would love to hear from you!</p>

      <p>
        <ContactLink icon={<EmailIcon />} text="Email" href="mailto:clintonmorrison2@gmail.com" />
        <ContactLink
          icon={<GithubIcon />}
          text="GitHub"
          href="https://github.com/clintonmorrison"
        />
        <ContactLink
          icon={<LinkedinIcon />}
          text="LinkedIn"
          href="https://ca.linkedin.com/pub/clinton-morrison/70/492/876"
        />
        <ContactLink
          icon={<TwitterIcon />}
          text="Twitter"
          href="https://twitter.com/clint_morrison"
        />
      </p>
    </Page>
  )
}
