import React, { useState, useCallback, FormEvent, ChangeEvent } from 'react'
import {
  SectionHeader,
  SectionInput,
  SectionPrimaryButton,
} from '../PreferencesModal/styled'
import ky from 'ky'
import { FormBlockquote } from '../atoms/form'

type Status = 'idle' | 'sending' | 'done'

const SubscribeNewsLettersForm = () => {
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [email, setEmail] = useState('')

  const subscribe = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      setStatus('sending')
      setErrorMessage(null)

      try {
        await ky.post(
          'https://boostmails.boostio.co/api/public/lists/5f434dccd05f3160b41c0d49/subscriptions',
          {
            json: {
              email,
            },
          }
        )
        setStatus('done')
      } catch (error) {
        setErrorMessage(error.message)
        setStatus('idle')
      }
    },
    [email]
  )

  const updateEmail = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)
  }, [])

  return (
    <div>
      <SectionHeader>Subscribe Update Notes</SectionHeader>
      {status === 'done' ? (
        <FormBlockquote>Thanks for the subscription!</FormBlockquote>
      ) : (
        <>
          {errorMessage != null && (
            <FormBlockquote variant='danger'>{errorMessage}</FormBlockquote>
          )}
          <form onSubmit={subscribe}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <SectionInput
                onChange={updateEmail}
                placeholder='E-mail'
                style={{ marginRight: '0.5em' }}
              />
              <SectionPrimaryButton
                type='submit'
                disabled={status === 'sending'}
              >
                Subscribe
              </SectionPrimaryButton>
            </div>
          </form>
        </>
      )}
    </div>
  )
}

export default SubscribeNewsLettersForm
