import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { ThemeProvider } from './logic/theme'
import App from './App.tsx'
import './index.css'
import './i18n'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChakraProvider value={defaultSystem}>
      <ThemeProvider>
        <BrowserRouter basename="/olympia-2026-webapp/">
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </ChakraProvider>
  </StrictMode>,
)
