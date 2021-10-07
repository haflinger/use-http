import { dequal } from 'dequal'
import React, { ReactElement, useRef, useState, useEffect } from 'react'
import useSSR from 'use-ssr'
import FetchContext from './FetchContext'
import { FetchContextTypes, FetchProviderProps } from './types'

export const Provider = ({
  url,
  options,
  graphql = false,
  children
}: FetchProviderProps): ReactElement => {
  const { isBrowser } = useSSR()

  const optionsRef = useRef<FetchContextTypes['options']>()

  const [defaults, setDefaults] = useState<FetchContextTypes>(
    {
      url: url || (isBrowser ? window.location.origin : ''),
      options: options || {},
      graphql // TODO: this will make it so useFetch(QUERY || MUTATION) will work
    }
  )

  useEffect(() => {
    if (!dequal(optionsRef.current, options)) {
      optionsRef.current = options
      setDefaults((current) => ({
        ...current,
        options: options || {}
      }))
    }
  }, [options])

  useEffect(() => {
    setDefaults(current => ({ ...current, url: url || (isBrowser ? window.location.origin : '') }))
  }, [url, isBrowser])

  useEffect(() => {
    setDefaults(current => ({ ...current, graphql }))
  }, [graphql])

  return (
    <FetchContext.Provider value={defaults}>{children}</FetchContext.Provider>
  )
}
