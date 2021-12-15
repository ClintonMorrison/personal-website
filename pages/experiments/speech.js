import Page from 'components/layout/page'
import { useEffect, useState } from 'react'

export default function Speech() {
  const [voice, setVoice] = useState()

  useEffect(() => {
    const englishVoices = window.speechSynthesis.getVoices().filter((v) => v.lang.startsWith('en'))
    setVoice(englishVoices[englishVoices.length - 1])
  }, [])

  const speak = () => {
    const utterance = new SpeechSynthesisUtterance('I love you bird!')
    utterance.voice = voice
    utterance.pitch = 1.7
    speechSynthesis.speak(utterance)
  }

  return (
    <Page title="Speech" description="Speech synthesis test">
      <button type="button" onClick={speak}>
        Test
      </button>
    </Page>
  )
}
