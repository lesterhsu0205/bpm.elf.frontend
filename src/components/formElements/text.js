import {
  Tab,
  Tabs,
  Form,
  Row,
  Col,
  Button,
  Stack,
  Card,
  InputGroup,
} from "react-bootstrap";
import { useFormContext } from "react-hook-form";

const Text = ({ label, idKey, readOnly, placeholder, disabled, suffix }) => {
  const {
    register,
    reset,
    getValues,
    formState: { errors },
  } = useFormContext({ mode: "all" });

  return (
    <InputGroup as={Col}>
      <InputGroup.Text>{label}</InputGroup.Text>
      <Form.Control
        type="text"
        placeholder={placeholder}
        {...register(idKey)}
        readOnly={readOnly}
        disabled={disabled}
      />
      {suffix && <InputGroup.Text>{suffix}</InputGroup.Text>}
    </InputGroup>
  );
};

export default Text;
