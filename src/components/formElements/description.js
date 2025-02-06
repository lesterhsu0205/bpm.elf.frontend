"use client";

import { useEffect, useRef } from "react";
import { Form, Button, Card, InputGroup } from "react-bootstrap";
import { useFormContext } from "react-hook-form";
import ClipboardJS from "clipboard";
import {
  ArrowUpOnSquareIcon,
  TrashIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-toastify";

const Description = ({ label, idKey }) => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext({ mode: "all" });

  const copyBtnRef = useRef(null);
  const watchedCopyText = watch(idKey);

  useEffect(() => {
    console.info("useEffect!!!!");

    if (watchedCopyText) {
      const clipboard = new ClipboardJS(copyBtnRef.current, {
        text: () => watchedCopyText,
      });

      clipboard.on("success", () => {
        toast.success("Text copied to clipboard!");
      });

      clipboard.on("error", (e) => {
        console.error("Failed to copy text: ", e);
      });

      return () => {
        console.info("clipboard.destroy()");
        clipboard.destroy();
      };
    }
  }, [watchedCopyText]);

  const apply = () => {
    toast.success("已完成開單，單號: 2024-07-19 ITREQ-022");
  };

  const clear = () => {
    setValue(idKey, "" );
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

          <Button variant="outline-secondary" className="me-2" ref={copyBtnRef}>
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
