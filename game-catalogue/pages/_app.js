import Head from 'next/head';
import { UserProvider } from '@auth0/nextjs-auth0';
import { CookiesProvider } from "react-cookie"


function MyApp({ Component, pageProps }) {
  return <>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossOrigin="anonymous"></link>
    </Head>

    <UserProvider>
      <CookiesProvider>
        <Component {...pageProps}/>
      </CookiesProvider>
        </UserProvider>
    </>
}

export default MyApp
