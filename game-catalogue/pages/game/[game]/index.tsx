import { GetServerSideProps } from "next";
import Link from "next/link";
import GameInfo from "../../../components/GameInfo";
import Layout from "../../../components/Layout";
import { getDatabase } from "../../../src/database";


export const getServerSideProps: GetServerSideProps = async (context) => {
  const mongodb = await getDatabase();
  const games = await mongodb.db().collection("games").findOne({"name" : `${context.params.game}`});
  const gamesString = JSON.stringify(games);

  return {
    props: {
      game: gamesString,
    }
  };
}

export default function Game({game}) {
  return <GameInfo game={game} />
}
