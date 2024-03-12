import { useState } from "react";
import axios from "axios";

import RegisterSuccessAlert from "../component/registerPageComponent/RegisterSuccessAlert.tsx";
import { useNavigate } from "react-router-dom";
const UserRegisterAPI = import.meta.env.VITE_API_UserRegister;
function RegisterPage() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    passwordConfirm: "",
    sex: "",
    idNumber: "",
    phone: "",
    name: "",
  });
  const navigate = useNavigate();
  const [registerSuccessAlert, setRegisterSuccessAlert] = useState(false);
  // @ts-ignore
  const handleFromChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  function handleRegisterSubmit() {
    axios
      .post(`${UserRegisterAPI}/user/register`, {
        idNumber: form.idNumber,
        name: form.name,
        password: form.password,
        phone: form.phone,
        sex: form.sex,
        username: form.username,
      })
      .then((res) => {
        if (res.status == 200) {
          setRegisterSuccessAlert(true);
        }
      });
  }

  return (
    <>
      {registerSuccessAlert && (
        <>
          <RegisterSuccessAlert>
            Register successful.
            <div>
              <button
                onClick={() => {
                  navigate("/LoginPage");
                }}
                className="btn btn-close"
                data-bs-dismiss="alert"
                aria-label="Close"
              ></button>
            </div>
          </RegisterSuccessAlert>
        </>
      )}

      <div className="loginPage col-9 rounded container-fluid  border-danger d-flex align-items-center justify-content-center aligncenter">
        <div className="loginContainer bg-opacity-50 bg-warning rounded p-5  shadow-lg col-3 justify-content-center border d-flex">
          <form>
            <div className="mb-2">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                className="form-control"
                name="username"
                onChange={handleFromChange}
              />
            </div>
            <div>
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                className="form-control"
                name="name"
                onChange={handleFromChange}
              />
            </div>
            <div>
              <label htmlFor="idNumber" className="form-label">
                idNumber
              </label>
              <input
                className="form-control"
                name="idNumber"
                onChange={handleFromChange}
              />
            </div>

            <div className="mb-2">
              <label htmlFor="InputPassword" className="form-label">
                Password
              </label>
              <input
                type="password"
                name="password"
                className="form-control"
                onChange={handleFromChange}
              />
            </div>
            <div className="mb-2">
              <label htmlFor="InputPasswordConfirm" className="form-label">
                PasswordConfirm
              </label>
              <input
                type="password"
                name="passwordConfirm"
                className="form-control"
                onChange={handleFromChange}
              />
            </div>

            <div className="p-1 mb-4">
              <label className="form-label">Gender</label>
              <select
                className="form-select"
                name="sex"
                onChange={handleFromChange}
              >
                <option className="selected"> Select Gender</option>
                <option value="1">Male</option>
                <option value="2">Female</option>
                <option value="3">I prefer not to say</option>
              </select>

              <div className="mb-2 mt-2">
                <label htmlFor="InputPhone" className="form-label">
                  Phone
                </label>
                <input
                  className="form-control"
                  name="phone"
                  onChange={handleFromChange}
                />
              </div>
            </div>

            <div className=" container-fluid d-inline-flex ">
              <div
                onClick={handleRegisterSubmit}
                className="btn m-2 btn-primary"
              >
                Submit
              </div>
              <button type="reset" className="btn m-2 btn-secondary">
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
export default RegisterPage;
