import { Form, Button, Card, InputGroup } from "react-bootstrap";
import { useFormContext } from "react-hook-form";
import { Copy, FileEarmarkArrowUp, Trash } from "react-bootstrap-icons";
import { toast } from "react-toastify";

const Description = ({ label, idKey }) => {
  const {
    register,
    reset,
    getValues,
    formState: { errors },
  } = useFormContext({ mode: "all" });

  const copy = () => {
    const textareaContent = getValues(idKey);
    navigator.clipboard
      .writeText(textareaContent)
      .then(() => {
        toast.success("Text copied to clipboard!");
      })
      .catch((err) => {
        toast.error("Failed to copy text: ", err);
      });
  };

  const apply = () => {
    toast.success("已完成開單，單號: 2024-07-19 ITREQ-022");
  };

  const clear = () => {
    reset({ [idKey]: "" });
    toast.success("欄位已清除");
  };

  return (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        {label}
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
            onClick={copy}
          >
            <Copy />
          </Button>
          <Button variant="outline-secondary" size="sm" onClick={apply}>
            <FileEarmarkArrowUp />
          </Button>
        </div>
      </Card.Header>

      <Card.Body>
        <InputGroup>
          <Form.Control
            as="textarea"
            rows="10"
            className="custom-textarea"
            {...register(idKey)}
          />
        </InputGroup>
      </Card.Body>
    </Card>
  );
};

export default Description;
