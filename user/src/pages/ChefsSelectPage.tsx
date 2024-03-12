import ChefSelect from "../component/chefComponents/ChefSelect.tsx";
import "../CSS/ChefSelect.css";
import { useEffectOnce } from "react-use";
import { useNavigate } from "react-router-dom";
function ChefsSelectPage() {
  const navigate = useNavigate();
  useEffectOnce(() => {
    if (localStorage.getItem("token") == null) {
      navigate("/LoginPage");
    }
  });
  return (
    <>
      <div className="chefSelectPage">
        <ChefSelect />
      </div>
    </>
  );
}
export default ChefsSelectPage;
