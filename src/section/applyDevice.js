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
import Description from "@/components/formElements/description";

const ApplyDevice = () => {
  const {
    register,
    reset,
    formState: { errors },
  } = useFormContext({ mode: "all" });

  return (
    <Card bg="light" border="light" className="mb-5">
      <Card.Header>
        <strong>設備</strong>
      </Card.Header>
      <Card.Body>
        <Row className="mb-3">
          <InputGroup as={Col}>
            <InputGroup.Text>申請項目</InputGroup.Text>
            <Form.Select {...register("device")}>
              <option value="螢幕">螢幕</option>
              <option value="筆記型電腦">筆記型電腦</option>
            </Form.Select>
          </InputGroup>
        </Row>

        <Description idKey="apply_device_description" />
      </Card.Body>
    </Card>
  );
};

export default ApplyDevice;
