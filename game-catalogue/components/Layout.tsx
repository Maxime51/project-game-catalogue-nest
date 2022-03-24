import Link from "next/link";
import { useCookies } from "react-cookie";
import { getCookie } from 'cookies-next';
import { useEffect, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0";


export default function Layout({ children }) {
  const [cookie, setCookie] = useState("");
  const [count, setCount] = useState(0);
  const { user, error, isLoading } = useUser();
  const [afficheConnexion, setAfficheConnexion] = useState(<></>);

  const option = {
    email: user?.email,
    name: user?.name
}
  useEffect(() => {
    const data = fetch("/api/cookies/update", {
      method:"POST",
      body:JSON.stringify(option)
    }).then((response) => response.json());
    data.then((result) => setCookie(result.cookie))
  }, []);

  useEffect(() => {
    if (cookie === undefined) {
      setAfficheConnexion(<li className="d-flex">
          <Link href="/api/auth/login"><a className="nav-link">Login</a></Link>
        </li>)
    } else {
      setAfficheConnexion(<>
        <li className="d-flex">
          <Link href="/myprofile"><a className="nav-link">Mon Compte</a></Link>
        </li>
        <li className="d-flex">
          <Link href="/panier"><a className="nav-link">Panier</a></Link>
          </li>
        <li className="d-flex">
          <Link href="/api/auth/logout"><a className="nav-link">Logout</a></Link>
          </li></>)
    }
  }, [cookie]);

  return <>
    <nav onClick={()=>{setCount(count + 1)}}className="navbar navbar-expand-lg navbar-light bg-light">
  <div className="container-fluid">
    <a className="navbar-brand" href="#">Navbar</a>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
        <li className="nav-item">
          <Link href="/games"><a className="nav-link active" aria-current="page" >All Games</a></Link>
        </li>
        <li className="nav-item">
          <Link href="/platforms"><a className="nav-link">All Platforms</a></Link>
            </li>
            {afficheConnexion}
        </ul>
    </div>
  </div>
    </nav>
    {children}
  </>
}
