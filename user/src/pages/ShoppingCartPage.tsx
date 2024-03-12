import { useEffectOnce } from "react-use";
import { useState } from "react";
import axios from "axios";
import {
  Button,
  FormLabel,
  ListGroup,
  ListGroupItem,
  Modal,
  Spinner,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
const UserCartAPI = import.meta.env.VITE_API_UserCart;
const UserOrderAPI = import.meta.env.VITE_API_UserOrder;
function ShoppingCartPage() {
  const [shoppingCart, setShoppingCart] = useState([]);
  const [modalState, setModalState] = useState(false);
  const [checkoutModalState, setCheckoutModalState] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [informationState, setInformationState] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    currentAddress: "",
    remark: "",
  });
  const navigate = useNavigate();
  function getAddress() {
    axios
      .get(`${UserCartAPI}/user/address/show`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        setAddresses(res.data.data);
      });
  }
  function getTotalPrice() {
    axios
      .get(`${UserCartAPI}/user/shoppingcart/total`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        setTotalPrice(res.data.data);
      });
  }
  function getShoppingCart() {
    axios
      .get(`${UserCartAPI}/user/shoppingcart/show/dishes`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        getTotalPrice();
        setShoppingCart(res.data.data);
      });
  }

  function handleReset() {
    axios
      .delete(`${UserCartAPI}/user/shoppingcart`, {
        headers: { token: localStorage.getItem("token") },
      })
      .then(() => getShoppingCart());
  }

  function handlePlus(chefId: string, dishId: string) {
    setModalState(true);
    axios
      .put(
        `${UserCartAPI}/user/shoppingcart/add`,
        {
          chefId: chefId,
          dishId: dishId,
        },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        },
      )
      .then(() => {
        getShoppingCart();
        getTotalPrice();
        setModalState(false);
      });
  }
  function handleRemove(chefId: string, dishId: string) {
    setModalState(true);
    axios
      .put(
        `${UserCartAPI}/user/shoppingcart/remove`,
        {
          chefId: chefId,
          dishId: dishId,
        },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        },
      )
      .then(() => {
        getShoppingCart();
        getTotalPrice();
        setModalState(false);
      });
  }
  function handlePay() {
    setModalState(true);
    console.log(localStorage.getItem("token"));
    axios
      .post(
        `${UserOrderAPI}/user/order/submit`,
        {
          addressId: form.currentAddress,
          remark: form.remark,
          deliveryiTime: Date(),
          amount: totalPrice,
        },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        },
      )
      .then((res) => {
        if (res.status == 200) {
          if (res.data.code == 0) {
            setModalState(false);
            setInformationState(true);
            setMessage(res.data.msg);
            setCheckoutModalState(false);
          } else {
            setMessage("Order submitted");
            setModalState(false);
            setCheckoutModalState(false);
            setInformationState(true);
            axios
              .delete(`${UserCartAPI}/user/shoppingcart`, {
                headers: {
                  token: localStorage.getItem("token"),
                },
              })
              .then((res) => {
                console.log(res);
              });
          }
        } else {
          setModalState(false);
          setMessage("InternetError");
          setInformationState(true);
        }
      });
  }

  function getDefaultAddress() {
    addresses.forEach((item) => {
      if (item["isDefault"] === 1) {
        setForm({
          ...form,
          currentAddress: item["id"],
        });

        return;
      }
    });
  }

  useEffectOnce(() => {
    getAddress();
    getShoppingCart();
    getTotalPrice();
  });

  return (
    <>
      <Modal centered={true} show={modalState}>
        <Modal.Body className="justify-items-center text-center flex">
          <Spinner></Spinner>
        </Modal.Body>
      </Modal>

      <Modal centered={true} show={informationState}>
        <Modal.Header>Order result</Modal.Header>
        <Modal.Body>{message}</Modal.Body>
        <Modal.Footer>
          <Button
            variant={"secondary"}
            onClick={() => {
              if (message == "Order submitted") {
                navigate("/Home");
              } else {
                setInformationState(false);
              }
            }}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal centered={true} show={checkoutModalState}>
        <Modal.Header>Complete the order</Modal.Header>

        <Modal.Body>
          <FormLabel>Address</FormLabel>
          <select
            className="form-select"
            name="currentAddress"
            value={form.currentAddress}
            onChange={(e) => {
              setForm({
                ...form,
                [e.target.name]: e.target.value,
              });
            }}
          >
            {addresses.map((address) => (
              <option
                key={address["id"]}
                value={address["id"]}
                className={address["isDefault"] && "bg-opacity-75 bg-success"}
              >
                {address["detailLocation"]}
              </option>
            ))}
          </select>

          <div className="input-group mt-3 ">
            <span className="input-group-text"> Remark</span>
            <textarea
              onChange={(e) => {
                setForm({
                  ...form,
                  [e.target.name]: e.target.value,
                });
              }}
              name="remark"
              className="form-control"
              placeholder="Leave your remark here"
              aria-label="With textarea"
            ></textarea>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="btn-outline-success ">
            <i className="bi-bag"> </i>
            {totalPrice} $
          </div>
          <Button variant={"danger"} onClick={handlePay}>
            <i className="bi bi-coin"> </i>
            Pay
          </Button>

          <Button onClick={() => setCheckoutModalState(false)}>Cancel</Button>
        </Modal.Footer>
      </Modal>

      <div className="container-fluid align-items-center  col-9">
        <ListGroup className=" align-self-center shadow ">
          <ListGroupItem className="d-inline-flex align-items-center text-center ">
            <div className="col-2">{"Chef Name"}</div>
            <div className="col-2">{"Dish Name"}</div>
            <div className="col-5">{"Quantitys"}</div>
            <div className="col-4 ">{"Operation"}</div>
          </ListGroupItem>

          {shoppingCart.map((item, index) => (
            <ListGroupItem
              className="d-inline-flex align-items-center text-center "
              key={index}
            >
              <div className="col-2">{item["chefName"]}</div>
              <div className="col-2">{item["dishName"]}</div>
              <div className="col-5">{item["number"]}</div>
              <div className="col-4 ">
                <Button
                  variant={"success"}
                  onClick={() => handlePlus(item["chefId"], item["dishId"])}
                >
                  +
                </Button>
                <Button
                  className={"m-2"}
                  variant={"secondary"}
                  onClick={() => handleRemove(item["chefId"], item["dishId"])}
                >
                  -
                </Button>
              </div>
            </ListGroupItem>
          ))}

          <ListGroupItem className="flex text-center">
            Total : {totalPrice} $
          </ListGroupItem>
          <ListGroupItem className="flex text-center">
            <Button
              variant={"danger"}
              onClick={() => {
                getDefaultAddress();
                setCheckoutModalState(true);
              }}
            >
              <i className="bi bi-coin"></i> Order
            </Button>
            <Button onClick={handleReset} variant={"secondary"} className="m-1">
              Reset
            </Button>
          </ListGroupItem>
        </ListGroup>
      </div>
    </>
  );
}

export default ShoppingCartPage;
