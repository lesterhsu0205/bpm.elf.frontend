import {
  Tab,
  Tabs,
  Form,
  Row,
  Col,
  Button,
  Stack,
  Card,
} from "react-bootstrap";
import { useForm } from "react-hook-form";
import { Copy, FileEarmarkArrowUp, Trash } from "react-bootstrap-icons";

const ApplyDevice = () => {
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm({ mode: "all" });

  const handleCopy = () => {
    const textareaContent = getValues("applyContent");
    navigator.clipboard
      .writeText(textareaContent)
      .then(() => {
        alert("Text copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  const handleApply = () => {
    alert("已完成開單，單號: 2024-07-19 ITREQ-022");
  };

  const clear = () => {
    reset({ applyContent: "" });
  };

  const submit = (data) => {
    setValue(
      "applyContent",
      `[需求說明]\n
${data.division} ${data.department} 新進同仁 ${data.staffId} ${data.engName} ${data.chiName} 新人到職申請 ${data.device}\n
[執行單位]\n
問管暨IDC作業管理部`
    );
  };

  return (
    <Form noValidate onSubmit={handleSubmit(submit)}>
      <Row className="mb-3">
        <Form.Group as={Col}>
          <Form.Label>申請項目</Form.Label>
          <Form.Select {...register("device")}>
            <option value="螢幕">螢幕</option>
            <option value="筆記型電腦">筆記型電腦</option>
          </Form.Select>
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Label>處別</Form.Label>
          <Form.Select {...register("division")}>
            <option value="核心系統處">核心系統處</option>
            <option value="業務系統處">業務系統處</option>
          </Form.Select>
        </Form.Group>

        <Form.Group as={Col}>
          <Form.Label>部門</Form.Label>
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
        </Form.Group>
      </Row>

      <Row className="mb-3">
        <Form.Group as={Col}>
          <Form.Label>員工編號</Form.Label>
          <Form.Control type="text" {...register("staffId")} />
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Label>英文名</Form.Label>
          <Form.Control type="text" {...register("engName")} />
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Label>中文名</Form.Label>
          <Form.Control type="text" {...register("chiName")} />
        </Form.Group>
      </Row>
      <Row className="mb-3">
        <Stack gap={2} className="col-md-5 mx-auto">
          <Button variant="primary" size="lg" type="submit">
            建立
          </Button>
        </Stack>
      </Row>

      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          需求說明
          <div>
            <Button
              variant="outline-secondary"
              size="sm"
              className="me-2"
              onClick={clear}
            >
              <Trash />
            </Button>

            <Button
              variant="outline-secondary"
              size="sm"
              className="me-2"
              onClick={handleCopy}
            >
              <Copy />
            </Button>
            <Button variant="outline-secondary" size="sm" onClick={handleApply}>
              <FileEarmarkArrowUp />
            </Button>
          </div>
        </Card.Header>

        <Card.Body>
          <Form.Group>
            <Form.Control
              as="textarea"
              rows="10"
              className="custom-textarea"
              {...register("applyContent")}
            />
          </Form.Group>
        </Card.Body>
      </Card>
    </Form>
  );
};

export default ApplyDevice;
