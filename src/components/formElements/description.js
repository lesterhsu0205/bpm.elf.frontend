import { Form, Button, Card, InputGroup } from "react-bootstrap";
import { useFormContext } from "react-hook-form";
import { Copy, FileEarmarkArrowUp, Trash } from "react-bootstrap-icons";
import {
  ArrowUpOnSquareIcon,
  TrashIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";
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
          <Button variant="outline-secondary" className="me-2" onClick={clear}>
            <TrashIcon className="h-5 w-5" />
          </Button>

          <Button variant="outline-secondary" className="me-2" onClick={copy}>
            <DocumentDuplicateIcon className="h-5 w-5" />
          </Button>
          <Button variant="outline-secondary" onClick={apply}>
            <ArrowUpOnSquareIcon className="h-5 w-5" />
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
