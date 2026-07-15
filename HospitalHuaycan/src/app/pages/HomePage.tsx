import { useContext } from "react";
import { AuthContext } from "../../modules/auth/context/AuthContext";
import HomeMedicoView from "../../modules/home/components/HomeMedicoView";
import HomeGeneralView from "../../modules/home/components/HomeGeneralView";

export default function HomePage() {
  const { userRole } = useContext(AuthContext);

  if (userRole === "ROLE_MEDICO") {
    return <HomeMedicoView />;
  }

  return <HomeGeneralView userRole={userRole} />;
}
