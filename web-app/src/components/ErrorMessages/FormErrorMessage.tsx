import { ErrorMessage } from "@hookform/error-message";

const FormErrorMessage = ({ errors, name }: { errors: any; name: string }) => {
  return (
    <ErrorMessage
      errors={errors}
      name={name}
      render={({ messages }) =>
        messages &&
        Object.entries(messages).map(([type, message]) => (
          <div key={type} className="d-flex">
            <i className="bi bi-exclamation-circle me-2"></i>
            <div>{message}</div>
          </div>
        ))
      }
    />
  );
};
export default FormErrorMessage;
