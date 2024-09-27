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
import { Copy, FileEarmarkArrowUp, Trash } from "react-bootstrap-icons";

const Attachment = () => {
  const {
    register,
    reset,
    formState: { errors },
  } = useFormContext({ mode: "all" });

  return (
    <>
      <Card bg="light" border="light" className="mb-5">
        <Card.Header>
          <strong>附件</strong>
        </Card.Header>
        <Card.Body>
         
        </Card.Body>
      </Card>
    </>
  );
};

export default Attachment;
