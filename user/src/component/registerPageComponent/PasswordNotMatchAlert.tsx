import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}
function Alert({ children }: Props) {
  return (
    <>
      <div
        className="alert alert-danger d-flex align-items-center"
        role="alert"
      >
        <svg
          className="bi flex-shrink-0 me-2 bi-exclamation-triangle-fill"
          role="img"
          aria-label="Danger:"
        ></svg>
        <div>{children}</div>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="alert"
          aria-label="Close"
        ></button>
      </div>
    </>
  );
}
export default Alert;
