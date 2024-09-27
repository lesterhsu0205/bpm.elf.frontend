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

const Authority = () => {
  const {
    register,
    reset,
    formState: { errors },
  } = useFormContext({ mode: "all" });

  return (
    <Card bg="light" border="light" className="mb-5">
      <Card.Header>
        <strong>Bitbucket</strong>
      </Card.Header>
      <Card.Body>
        <Row className="mb-3">
          <Col className="d-flex">
            <Form.Label className="me-5">上版日期</Form.Label>
            <Form.Check
              inline
              type="checkbox"
              id="env_dev"
              name="env"
              label="dev"
              value="dev"
              {...register("env")}
            />
            <Form.Check
              inline
              type="checkbox"
              id="env_stg"
              name="env"
              label="stg"
              value="stg"
              {...register("env")}
            />
            <Form.Check
              inline
              type="checkbox"
              id="env_uat"
              name="env"
              label="uat"
              value="uat"
              {...register("env")}
            />
            <Form.Check
              inline
              type="checkbox"
              id="env_prd"
              name="env"
              label="prd"
              value="prd"
              {...register("env")}
            />
          </Col>

          <Col className="d-flex">
            <Form.Label className="me-5">需求類型</Form.Label>
            <Form.Check
              inline
              type="checkbox"
              id="require_type_add"
              name="require_type"
              label="新增"
              value="add"
              {...register("require_type")}
            />
            <Form.Check
              inline
              type="checkbox"
              id="require_type_update"
              name="require_type"
              label="修改"
              value="update"
              {...register("require_type")}
            />
            <Form.Check
              inline
              type="checkbox"
              id="require_type_delete"
              name="require_type"
              label="刪除"
              value="delete"
              {...register("require_type")}
            />
          </Col>
        </Row>

        <Row className="mb-3">
          <InputGroup as={Col}>
            <InputGroup.Text>申請原因</InputGroup.Text>
            <Form.Control
              as="textarea"
              rows="5"
              {...register("bitbucket_apply_reason")}
            />
          </InputGroup>
          <InputGroup as={Col}>
            <InputGroup.Text>申請的系統權限或角色</InputGroup.Text>
            <Form.Control
              as="textarea"
              rows="5"
              {...register("bitbucket_authority_role")}
            />
          </InputGroup>
        </Row>

        <Description idKey="bitbucket_description" />
      </Card.Body>
    </Card>
  );
};

export default Authority;
