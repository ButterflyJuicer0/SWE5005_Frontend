import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

function RegisterSuccessAlert({ children }: Props) {
  return (
    <>
      <div className=" alert alignright d-flex alert-success alert-dismissible  fade show">
        <i
          className="bi flex-shrink-0 me-2 bi-exclamation-circle"
          role="img"
        ></i>
        {children}
      </div>
    </>
  );
}
export default RegisterSuccessAlert;
