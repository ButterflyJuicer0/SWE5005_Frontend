import { useEffectOnce } from "react-use";
import axios from "axios";
import { useState } from "react";

import { Button, Modal, ModalBody, Spinner } from "react-bootstrap";

const UserAddressAPI = import.meta.env.VITE_API_UserAddress;

function AddressManagementPage() {
  const [addresses, setAddresses] = useState([]);
  const [editAddressModalState, setEditAddressModalState] = useState(false);
  const [spinnerState, setSpinnerState] = useState(false);
  const [deleteConfirmModalState, setDeleteConfirmModalState] = useState(false);
  const [changeIdNumber, setChangeIdNumber] = useState("");
  const [submitType, setSubmitType] = useState(-1);
  const [informationState, setInformationState] = useState(false);
  const [form, setForm] = useState({
    consignee: "",
    detailLocation: "",
    phone: "",
    postalCode: "",
    sex: "",
  });
  // @ts-ignore
  const handleUpdate = (e) => {
    //在表格改变时调用
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  function getAddress() {
    //获取当前地址列表
    setSpinnerState(true);
    axios
      .get(`${UserAddressAPI}/user/address/show`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        setSpinnerState(false);
        setAddresses(res.data.data);
      });
  }

  useEffectOnce(() => {
    //页面载入默认获取一次地址列表
    getAddress();
  });
  function handleDeleteAddress(id: string) {
    //删除地址请求
    setDeleteConfirmModalState(true);
    setChangeIdNumber(id);
  }
  function handleModify(id: string) {
    //修改地址列表
    setChangeIdNumber(id);
    setEditAddressModalState(true);
  }
  function handleSubmit() {
    //提交表单请求，可以为修改或删除
    if (submitType == 0) {
      //Add new address
      axios
        .post(
          `${UserAddressAPI}/user/address/add`,
          {
            consignee: form.consignee,
            detailLocation: form.detailLocation,
            phone: form.phone,
            postalCode: form.postalCode,
            sex: form.sex,
          },
          {
            headers: {
              token: localStorage.getItem("token"),
            },
          },
        )
        .then(() => {
          getAddress();
          setEditAddressModalState(false);
        })
        .catch(() => {
          setInformationState(true);
        });
    } else if (submitType == 1) {
      //Modify current Address
      axios
        .put(
          `${UserAddressAPI}/user/address/modify`,
          {
            id: changeIdNumber,
            consignee: form.consignee,
            detailLocation: form.detailLocation,
            phone: form.phone,
            postalCode: form.postalCode,
            sex: form.sex,
          },
          {
            headers: {
              token: localStorage.getItem("token"),
            },
          },
        )
        .then((res) => {
          if (res.status == 200) {
            setEditAddressModalState(false);
            getAddress();
          } else {
            setInformationState(true);
          }
        })
        .catch(() => {
          setInformationState(true);
        });
    }
  }

  function setDefault(id: string) {
    //修改当前地址为默认地址
    axios
      .put(
        `${UserAddressAPI}/user/address/default`,
        {
          id: id,
          consignee: form.consignee,
          detailLocation: form.detailLocation,
          phone: form.phone,
          postalCode: form.postalCode,
          sex: form.sex,
        },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        },
      )
      .then(() => {
        getAddress();
      });
  }
  return (
    <>
      {/*错误提示框*/}
      <Modal show={informationState}>
        <Modal.Header>Error</Modal.Header>
        <Modal.Body>Input error</Modal.Body>
        <Modal.Footer>
          <Button
            variant={"secondary"}
            onClick={() => {
              setInformationState(false);
            }}
          >
            {" "}
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

      {/*信息编辑框*/}
      <Modal show={editAddressModalState}>
        <Modal.Header>New Address</Modal.Header>
        <ModalBody>
          <div className="form-group ">
            <label className="form-label">Recipient's name </label>
            <input
              onChange={handleUpdate}
              className="form-control mb-2"
              name="consignee"
            />
            <label className="form-label mb-2">Location</label>
            <input
              onChange={handleUpdate}
              className="form-control mb-2"
              name="detailLocation"
            />
            <label className="form-label mb-2">Mobile Phone</label>
            <input
              onChange={handleUpdate}
              className="form-control mb-2"
              name="phone"
            />
            <label className="form-label mb-2">Postcode</label>
            <input
              onChange={handleUpdate}
              className="form-control mb-2"
              name="postalCode"
            />
            <label className="form-label">Sex</label>
            <select className="form-select" name="sex" onChange={handleUpdate}>
              <option> Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="N.A">I prefer not to say</option>
            </select>
          </div>
        </ModalBody>
        <Modal.Footer>
          <Button
            onClick={() => {
              handleSubmit();
            }}
          >
            Submit
          </Button>
          <Button
            variant={"secondary"}
            onClick={() => {
              setForm({
                consignee: "",
                detailLocation: "",
                phone: "",
                postalCode: "",
                sex: "",
              });
              setEditAddressModalState(false);
            }}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {/*加载中*/}
      <Modal
        show={spinnerState}
        size={"sm"}
        className="justify-content-center  text-center flex"
      >
        <div className="flex">
          <Spinner />
        </div>
      </Modal>

      {/*删除确认框*/}
      <Modal centered={true} show={deleteConfirmModalState}>
        <Modal.Header>Confirmation</Modal.Header>
        <Modal.Body>Confirm delete</Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            onClick={() => {
              axios({
                method: "delete",
                url: `${UserAddressAPI}/user/address/remove`,
                params: {
                  id: changeIdNumber,
                },
                headers: {
                  token: localStorage.getItem("token"),
                },
              }).then(() => {
                setDeleteConfirmModalState(false);
                getAddress();
              });
            }}
          >
            Confirm
          </Button>
          <Button
            variant="secondary"
            onClick={() => setDeleteConfirmModalState(false)}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="flex container-fluid col-9 shadow p-3 fadein active show rounded justify-content-center text-center">
        <table className="table fade show ">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Sex</th>
              <th scope="col">phone</th>
              <th scope="col">Detail Position</th>
              <th scope="col">PostalCode</th>
              <th scope="col">Operation</th>
              <th scope="col">Default</th>
            </tr>
          </thead>
          <tbody>
            {addresses.map((address, index) => (
              <tr key={index}>
                <th scope="col"> {address["consignee"]}</th>
                <td> {address["sex"]}</td>
                <td> {address["phone"]}</td>
                <td>{address["detailLocation"]} </td>
                <td> {address["postalCode"]}</td>
                <td>
                  <Button
                    variant={"warning"}
                    size="sm"
                    onClick={() => {
                      setSubmitType(1);
                      handleModify(address["id"]);
                    }}
                  >
                    Modify
                  </Button>
                  <> | </>
                  <Button
                    variant={"danger"}
                    size="sm"
                    onClick={() => {
                      handleDeleteAddress(address["id"]);
                    }}
                  >
                    Delete
                  </Button>
                </td>

                <td>
                  {address["isDefault"] === 1 ? (
                    <>
                      <div className="rounded bg-success">Default</div>
                    </>
                  ) : (
                    <>
                      <div
                        className="rounded border border-2  border-success"
                        onClick={() => {
                          setDefault(address["id"]);
                        }}
                      >
                        setDefault
                      </div>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Button
          variant={"warning"}
          onClick={() => {
            setSubmitType(0);
            setEditAddressModalState(true);
          }}
        >
          Add new address
        </Button>
      </div>
    </>
  );
}
export default AddressManagementPage;
