// app/providers.tsx
'use client'

import { ChakraProvider } from '@chakra-ui/react'
import { SessionProvider } from 'next-auth/react'
import { Provider } from 'react-redux'
import { store } from './lib/redux/store/store'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
    <ChakraProvider>
      <SessionProvider session={null}>{children}</SessionProvider>
    </ChakraProvider>
    </Provider>
  )
}