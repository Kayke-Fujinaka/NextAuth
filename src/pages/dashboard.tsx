import { useContext } from "react";
import { Can } from "../components/Can";
import { AuthContext } from "../contexts/AuthContext";
import { setupAPIClient } from "../services/api";
import { withSSRAuth } from "../utils/withSSRAuth";

export default function Dashboard({ data }) {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <h1>Dashboard: {data?.email}</h1>

      <Can permissions={["metrics.list"]}>
        <div>Métricas</div>
      </Can>
    </div>
  );
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);
  const { data } = await apiClient.get("/me");

  return {
    props: {
      data,
    },
  };
});
