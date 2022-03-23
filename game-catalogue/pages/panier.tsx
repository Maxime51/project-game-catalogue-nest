import { useUser } from "@auth0/nextjs-auth0";
import { useEffect, useState } from "react"
import Layout from "../components/Layout";

export default function Panier() {
  const [panier, setPanier] = useState([]);
  const { user, error, isLoading } = useUser();

  useEffect(() => {
    const data = fetch("/api/panier", {
      method:"POST",
      body:user.email
    }).then((response) => response.json());
    data.then((result) => setPanier(result.panier))

  }, []);

  return <Layout>
    <div className="container">
    <div className="row">
        {panier.map((element, index) => {
      return (
          <div key={index} className="col-sm-6" style={{ maxWidth: "18rem" }}>
            <div className="card">
              {element.game?.cover?.url ? <img src={element.game.cover.url} style={{ height: "18rem" }} className="card-img-top" />:<img src="..." style={{ maxHeight: "18rem" }} className="card-img-top" />}
              <div className="card-body">
                <h5 className="card-title" >{element.game.name}</h5>
              </div>
            </div>
          </div>);

    })}

    </div>
    </div>
  </Layout>
}
