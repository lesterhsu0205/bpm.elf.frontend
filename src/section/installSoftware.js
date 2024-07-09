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
import { useForm } from "react-hook-form";
import { Copy, FileEarmarkArrowUp, Trash } from "react-bootstrap-icons";

const InstallSoftware = () => {
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
      `申請部門: ${data.division}/${data.department}\n
申請安裝人員: ${data.staffId} ${data.engName} ${data.chiName}\n
申請安裝設備: ${data.device}\n
申請原因:\n
${data.reason}\n
安裝軟體資訊如下:\n
*詳細資訊請參考附件\n
${data.softwareList}
`
    );
  };

  return (
    <Form noValidate onSubmit={handleSubmit(submit)}>
      <Row className="mb-3">
        <InputGroup as={Col}>
          <InputGroup.Text>申請安裝設備</InputGroup.Text>
          <Form.Select {...register("device")}>
            <option value="筆記型電腦">筆記型電腦</option>
            <option value="桌上型電腦">桌上型電腦</option>
            <option value="監控室電腦">監控室電腦</option>
          </Form.Select>
        </InputGroup>
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
        <InputGroup as={Col}>
          <InputGroup.Text>員工編號</InputGroup.Text>
          <Form.Control type="text" {...register("staffId")} />
        </InputGroup>
        <InputGroup as={Col}>
          <InputGroup.Text>英文名</InputGroup.Text>
          <Form.Control type="text" {...register("engName")} />
        </InputGroup>
        <InputGroup as={Col}>
          <InputGroup.Text>中文名</InputGroup.Text>
          <Form.Control type="text" {...register("chiName")} />
        </InputGroup>
      </Row>

      <Row className="mb-3">
        <InputGroup as={Col}>
          <InputGroup.Text>申請原因</InputGroup.Text>
          <Form.Control as="textarea" rows="5" {...register("reason")} />
        </InputGroup>
        <InputGroup as={Col}>
          <InputGroup.Text>安裝軟體清單</InputGroup.Text>
          <Form.Control as="textarea" rows="5" {...register("softwareList")} />
        </InputGroup>
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

export default InstallSoftware;
