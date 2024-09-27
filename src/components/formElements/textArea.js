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

const TextArea = ({ label, idKey }) => {
  const {
    register,
    reset,
    getValues,
    formState: { errors },
  } = useFormContext({ mode: "all" });

  return (
    <InputGroup as={Col}>
      <InputGroup.Text>{label}</InputGroup.Text>
      <Form.Control as="textarea" rows="5" {...register(idKey)} />
    </InputGroup>
  );
};

export default TextArea;
