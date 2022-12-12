import { setupAPIClient } from "../services/api";
import { withSSRAuth } from "../utils/withSSRAuth";

export default function Metrics() {
  return (
    <>
      <div>Métricas</div>
    </>
  );
}

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    const apiClient = setupAPIClient(ctx);

    return {
      props: {},
    };
  },
  { permissions: ["metrics.list"], roles: ["administrator"] }
);
