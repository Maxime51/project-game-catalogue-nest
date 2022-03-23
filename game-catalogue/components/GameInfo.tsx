import { useUser } from "@auth0/nextjs-auth0";
import Link from "next/link";
import Layout from "./Layout";

export default function GameInfo(props) {
  const { user, error, isLoading } = useUser();
  const gamesJson = JSON.parse(props.game);

  return <Layout>
    <div className="container">
    <div className="row">
          <div className="col-sm-6" style={{ maxWidth: "18rem" }}>
            <div className="card">
              {gamesJson?.cover?.url ? <img src={gamesJson.cover.url} style={{ height: "18rem" }} className="card-img-top" />:<img src="..." style={{ maxHeight: "18rem" }} className="card-img-top" />}
              <div className="card-body">
                <h5 className="card-title" >{gamesJson.name}</h5>
              </div>
            </div>
        </div>
        <Link href={`/api/panier/add/${gamesJson._id}?info=${user.email}`}><a>Add To Basket</a></Link>
    </div>
    </div>
  </Layout>
}
