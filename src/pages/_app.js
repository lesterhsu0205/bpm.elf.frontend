import 'bootstrap/dist/css/bootstrap.min.css'
import '@/styles/globals.css'
import 'react-toastify/dist/ReactToastify.css'
import { ThemeProvider } from '@material-tailwind/react'
import { SharedProvider } from '@/sharedContext'
import Layout from '@/components/layout'

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <SharedProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SharedProvider>
    </ThemeProvider>
  )
}
