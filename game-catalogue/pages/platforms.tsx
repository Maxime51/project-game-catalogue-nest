import { GetServerSideProps } from "next";
import Link from "next/link";
import Layout from "../components/Layout";
import { getDatabase } from "../src/database"

type Platform = {
  name: string,

}
export const getServerSideProps: GetServerSideProps = async () =>{
  const mongodb = await getDatabase();

  const games = await mongodb.db().collection("games").find().toArray();
  const platforms = games.map((game) => {
    return game.platform;
  })
  const filteredArray = platforms.filter(function (ele, pos, previous) {
    if (pos !== 0) {
    if (ele.name !== previous[pos - 1].name) {
      return ele;
    }
  }

})

  return {
    props: {
      platforms: filteredArray
    }
  };
}
export default function Games({ platforms }) {
  return <Layout>
    <div className="container">
    <div className="row">
    {platforms.map((platform, index) => {
      return (
        <Link key={index} href={`/platforms/${platform.name}`}>
          <div  className="col-sm-6" style={{ width: "18rem" }}>
            <div className="card">
              {platform?.platform_logo_url ? <img src={platform.platform_logo_url} style={{ height: "18rem" }} className="card-img-top" />:<img src="..." style={{ height: "18rem" }} className="card-img-top" />}
              <div className="card-body">
                <h5 className="card-title" >{platform.name}</h5>
              </div>
            </div>
          </div>
          </Link>);

    })}

    </div>
    </div>
  </Layout>
}
