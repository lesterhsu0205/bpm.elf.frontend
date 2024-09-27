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
import Text from "@/components/formElements/text";

const General = () => {
  const {
    register,
    reset,
    formState: { errors },
  } = useFormContext({ mode: "all" });

  return (
    <Card bg="light" border="light" className="mb-5">
      <Card.Header>
        <strong>基本資料</strong>
      </Card.Header>
      <Card.Body>
        <Row className="mb-3">
          <InputGroup as={Col}>
            <InputGroup.Text>處別</InputGroup.Text>
            <Form.Select {...register("division")}>
              <option value="核心系統處">核心系統處</option>
              <option value="業務系統處">業務系統處</option>
            </Form.Select>
          </InputGroup>

          <InputGroup as={Col}>
            <InputGroup.Text>部門</InputGroup.Text>
            <Form.Select {...register("department")}>
              <option value="系統整合應用部">系統整合應用部</option>
              <option value="營運支援系統部">營運支援系統部</option>
              <option value="台幣存匯系統部">台幣存匯系統部</option>
              <option value="台幣共用系統部">台幣共用系統部</option>
              <option value="支付系統部">支付系統部</option>
              <option value="風險系統部">風險系統部</option>
              <option value="台幣放款系統部">台幣放款系統部</option>
              <option value="保險系統部">保險系統部</option>
              <option value="外匯暨信託系統部">外匯暨信託系統部</option>
              <option value="QA暨資訊營管部">QA暨資訊營管部</option>
            </Form.Select>
          </InputGroup>
        </Row>

        <Row className="mb-3">
          <Text label="員工編號" idKey="staffId" />
          <Text label="英文名" idKey="engName" />
          <Text label="中文名" idKey="chiName" />
        </Row>
      </Card.Body>
    </Card>
  );
};

export default General;
