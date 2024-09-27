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

const InstallSoftware = () => {
  const {
    register,
    reset,
    formState: { errors },
  } = useFormContext({ mode: "all" });

  return (
    <Card bg="light" border="light" className="mb-5">
      <Card.Header>
        <strong>安裝軟體</strong>
      </Card.Header>
      <Card.Body>
        <Row className="mb-3">
          <InputGroup as={Col}>
            <InputGroup.Text>申請安裝設備</InputGroup.Text>
            <Form.Select {...register("target_device")}>
              <option value="筆記型電腦">筆記型電腦</option>
              <option value="桌上型電腦">桌上型電腦</option>
              <option value="監控室電腦">監控室電腦</option>
            </Form.Select>
          </InputGroup>
        </Row>
        <Row className="mb-3">
          <InputGroup as={Col}>
            <InputGroup.Text>申請原因</InputGroup.Text>
            <Form.Control as="textarea" rows="5" {...register("reason")} />
          </InputGroup>
          <InputGroup as={Col}>
            <InputGroup.Text>安裝軟體清單</InputGroup.Text>
            <Form.Control
              as="textarea"
              rows="5"
              {...register("softwareList")}
            />
          </InputGroup>
        </Row>

        <Description idKey="install_software_description" />
      </Card.Body>
    </Card>
  );
};

export default InstallSoftware;
