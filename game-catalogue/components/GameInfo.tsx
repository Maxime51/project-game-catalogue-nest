import { useUser } from "@auth0/nextjs-auth0";
import Link from "next/link";
import Layout from "./Layout";

export default function GameInfo(props) {
  const { user, error, isLoading } = useUser();
  const gamesJson = JSON.parse(props.game);
  console.log(user)
  if (user === undefined) {
    return <Layout>
    <section className="py-5">
  <div className="container px-4 px-lg-5 my-5">
        <div className="row gx-4 gx-lg-5 align-items-center">
          <div className="col-md-6">
            {gamesJson?.cover?.url ? <img className="card-img-top mb-5 mb-md-0" src={gamesJson.cover.url} alt="..." />:<img className="card-img-top mb-5 mb-md-0" src={gamesJson.cover.url} alt="..." />}
          </div>
      <div className="col-md-6">
          <h1 className="display-5 fw-bolder">{gamesJson.name}</h1>
          <div className="fs-5 mb-5">
          </div>
          <p className="lead">{gamesJson.summary}</p>
              <p>Price :{gamesJson.price} €</p><br></br>
              <div className="d-flex">
                <Link href="/api/auth/login">
                <a>
                  <button type="button" className="btn btn-lg btn-danger" data-bs-toggle="popover" title="Add to basket" data-bs-content="add to Basket with success!">
                    Login
                  </button>
                  </a>
                  </Link>
              </div>
      </div>
    </div>
  </div>
  </section>
  </Layout>
  } else {
    return <Layout>
      <section className="py-5">
        <div className="container px-4 px-lg-5 my-5">
          <div className="row gx-4 gx-lg-5 align-items-center">
            <div className="col-md-6">
              {gamesJson?.cover?.url ? <img className="card-img-top mb-5 mb-md-0" src={gamesJson.cover.url} alt="..." /> : <img className="card-img-top mb-5 mb-md-0" src={gamesJson.cover.url} alt="..." />}
            </div>
            <div className="col-md-6">
              <h1 className="display-5 fw-bolder">{gamesJson.name}</h1>
              <div className="fs-5 mb-5">
              </div>
              <p className="lead">{gamesJson.summary}</p>
              <p>Price :{gamesJson.price} €</p><br></br>
              <div className="d-flex">
                <Link href={`/api/panier/add/${gamesJson._id}?info=${user?.email}`}>
                <a >
                  <button type="button" className="btn btn-lg btn-danger" data-bs-toggle="popover" title="Add to basket" data-bs-content="add to Basket with success!">
                    Add to Basket
                  </button>
                </a>
</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  }
}
