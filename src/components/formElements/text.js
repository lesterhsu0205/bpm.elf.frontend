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

const Text = ({ label, idKey }) => {
  const {
    register,
    reset,
    getValues,
    formState: { errors },
  } = useFormContext({ mode: "all" });

  return (
    <InputGroup as={Col}>
      <InputGroup.Text>{label}</InputGroup.Text>
      <Form.Control type="text" {...register(idKey)} />
    </InputGroup>
  );
};

export default Text;
