import { useEffectOnce } from "react-use";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button, Image, ListGroup, Modal, Spinner } from "react-bootstrap";
import "../CSS/DishDisplayPage.css";
const UserCartAPI = import.meta.env.VITE_API_UserCart;
const UserSearchAPI = import.meta.env.VITE_API_UserSearch;
function DishDisplayPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [dishes, setDishes] = useState([]);
  const [loadingState, setLoadingState] = useState(false);

  function handleAdd(dishId: string) {
    setLoadingState(true);
    axios
      .put(
        `${UserCartAPI}/user/shoppingcart/add`,
        {
          chefId: location.state.chef.id,
          dishId: dishId,
        },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        },
      )
      .then(() => {
        setLoadingState(false);
      });
  }

  useEffectOnce(() => {
    axios({
      method: "get",
      url: `${UserSearchAPI}/user/chef/dish/show`,
      params: {
        chefId: location.state.chef.id,
      },
      headers: {
        token: localStorage.getItem("token"),
      },
    })
      .then((res) => {
        if (res.data.code == 1) {
          setDishes(res.data.data);
        } else if (res.status == 401) {
          localStorage.clear();

          navigate("/LoginPage");
        }
      })
      .catch((err) => console.log(err));
  });

  return (
    <>
      <Modal show={loadingState} className="text-center">
        <Modal.Body>
          <h5>Adding</h5>
          <Spinner size={"sm"} variant={"secondary"} />
        </Modal.Body>
      </Modal>
      <ListGroup className="container-fluid d-flex rounded  justify-content-center">
        <ListGroup.Item className="col-9  shadow-lg d-flex align-self-center align-items-center justify-content-center">
          <div className="col-4">DishName</div>
          <div className="col-4">Price</div>
        </ListGroup.Item>

        {dishes.map((dish) => {
          return (
            <ListGroup.Item
              key={dish["id"]}
              className="col-9  shadow-lg d-flex align-self-center align-items-center justify-content-center"
            >
              <div className="col-2 dishContainer">
                <Image
                  rounded={true}
                  src={dish["image"]}
                  fluid={true}
                  className="dishImage"
                />
              </div>
              <div className="col-4">{dish["name"]}</div>
              <div className="col-4">{dish["price"]}</div>
              <div className="col-2 text-center">
                <Button
                  className={
                    loadingState
                      ? "disabled m-1 col-4 justify-content-center "
                      : "m-1 col-4 justify-content-center "
                  }
                  variant={"warning"}
                  onClick={() => {
                    handleAdd(dish["id"]);
                  }}
                >
                  +
                </Button>
              </div>
            </ListGroup.Item>
          );
        })}

        <Button
          variant={"warning"}
          className="align-self-center shadow mt-2"
          onClick={() => navigate("/ShoppingCartPage")}
        >
          View shoppingCart
        </Button>
      </ListGroup>
    </>
  );
}
export default DishDisplayPage;
