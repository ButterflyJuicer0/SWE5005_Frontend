import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  children: ReactNode;
}
function RedirectButton({ children }: Props) {
  const navigate = useNavigate();
  function handleClick() {
    if (localStorage.getItem("token") == null) {
      navigate("/LoginPage");
    } else {
      navigate("/ChefsSelectPage");
    }
  }

  return (
    <div className="bg-opacity-25">
      <button onClick={handleClick} className="btn btn-success shadow-lg m-5  ">
        {children}
      </button>
    </div>
  );
}
export default RedirectButton;
