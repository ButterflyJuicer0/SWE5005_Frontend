import RedirectButton from "../component/RedirectButton.tsx";
import "../CSS/HomePage.css";

function Home() {
  return (
    <>
      <div className="homePage d-flex justify-content-center align-items-center  rounded shadow border border-2 col-9">
        <div className="d-flex">
          <h1>Golden lotus</h1>
        </div>
        <RedirectButton>View Chefs</RedirectButton>
      </div>
    </>
  );
}
export default Home;
