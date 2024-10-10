import { Callout } from 'nextra/components'
import { Image } from '~/components/image'
import scriptsTab from '~/assets/images/scriptstab.png'

export const UnderConstruction = () => (
  <Callout type='info'>
    This docs page is under construction. Expect more information coming to this page soon!<br></br>
    If you have questions, please ask them in our{' '}
    <u>
      <a href='https://discord.gg/nwXFvtJ92g'>Discord server</a>
    </u>{' '}
    and we'll answer them promptly! 😊
  </Callout>
)

export const AIDocs = () => (
  <Callout type='info'>
    These docs are written to be queried by the Dreamlab Assistant, our chatbot that helps you code your game.
    <Image src={scriptsTab} style={{ width: 'auto', maxHeight: '15rem' }} alt='scripts tab location'></Image>
    <br></br>
    Navigate to your "Scripts" tab as shown and the Dreamlab Assistant will be available on the right side.
  </Callout>
)
