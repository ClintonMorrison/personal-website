import Page from 'components/layout/page'
import Resume from 'components/resume'

import data from 'data/resume.json'

export default function ResumePage() {
  return (
    <Page title="Resume" description="...">
      <Resume />
    </Page>
  )
}
