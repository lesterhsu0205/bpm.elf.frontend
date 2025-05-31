"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { useForm, FormProvider } from "react-hook-form";
import { Form, Row, Col, Button, Modal } from "react-bootstrap";
import {
  Select,
  Option,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";

import JsonEditor from "@/components/jsonEditor";
import Text from "@/components/formElements/text";
import { useSharedContext } from "@/sharedContext";

import { toast } from "react-toastify";
import _ from "lodash";
import Content from "@/components/content";
import downloadJson from "@/utils/downloadJson";

// export async function getStaticPaths() {
//   return {
//     paths: [],
//     fallback: "blocking",
//   };
// }

export async function getServerSideProps({ params }) {
  const { applyItem } = params;
  console.info("applyItem: " + applyItem);

  const data = await fetchData({ isClientCall: false });

  return {
    props: {
      applyItem,
      data,
    },
    // revalidate: 1, // 若需要ISR，過期後新的 request 進來會撈新的資料，避免同一時刻過多使用者操作
  };
}

const DynamicPage = ({ applyItem, data }) => {
  console.info(`load /settings/${applyItem}`);

  const router = useRouter();
  const [allJsonData, setAllJsonData] = useState(data);
  const initJsonData = useMemo(
    () => ({
      name: "",
      path: [],
      inputs: [],
    }),
    []
  ); // 只有在組件初次渲染時才初始化
  const [jsonData, setJsonData] = useState(
    applyItem === "new"
      ? initJsonData
      : allJsonData.find((setting) => setting.file === applyItem)?.content
  );

  const [newFileName, setNewFileName] = useState("");

  const { sharedValue, setSharedValue } = useSharedContext();
  const [selected, setSelected] = useState(null);

  const [opened, setOpened] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    getValues,
    control,
    formState,
  } = useForm({
    mode: "all",
  });

  // Watch all form fields for validate
  //   watch();

  useEffect(() => {
    const isValidOption = allJsonData.some((opt) => opt.file === applyItem);

    setSelected(isValidOption === true ? applyItem : null);

    setJsonData(
      applyItem === "new"
        ? initJsonData
        : allJsonData.find((setting) => setting.file === applyItem)?.content
    );
  }, [applyItem, allJsonData, initJsonData]);

  const submit = (data) => {
    try {
      // saveData({ newFileName: data.newFileName });
      completeAndOpenPlayground({ newFileName: data.newFileName });
    } catch (Error) {
      toast.warn(Error.message);
    }
  };

  const refreshSidebar = () => {
    setSharedValue((prev) => !prev);
  };

  const newData = () => {
    router.push("/settings/new");
  };

  // 當 JSON 編輯時，更新狀態
  const handleJsonUpdate = (updatedJson) => {
    setJsonData(updatedJson.newData); // 儲存最新 JSON
  };

  // FIXME: 處理 compose 單
  const deleteData = async () => {
    const response = await fetch(`/bpm-elf/api/setting/${applyItem}`, {
      method: "DELETE",
    });

    const result = await response.json();
    refreshSidebar();
    setAllJsonData(await fetchData({ isClientCall: true }));
    router.replace("/settings/none");
    toast.success(result.message);
  };

  // FIXME: 處理 compose 單
  // const saveData = async ({ newFileName }) => {
  //   if (applyItem === "new" && !newFileName) {
  //     toast.warn("檔名不得為空");
  //     return;
  //   }

  //   const fileName = applyItem === "new" ? `${newFileName}.json` : applyItem;

  //   const response = await fetch(`/bpm-elf/api/setting/${fileName}`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({ ...jsonData }),
  //   });

  //   const result = await response.json();

  //   if (applyItem === "new") {
  //     //   setNewDataMode(false);
  //     router.replace(`/settings/${newFileName}.json`);
  //   }

  //   refreshSidebar();
  //   setAllJsonData(await fetchData({ isClientCall: true }));
  //   toast.success(result.message);
  // };

  const completeAndOpenPlayground = async ({ newFileName }) => {
    if (applyItem === "new" && !newFileName) {
      toast.warn("檔名不得為空");
      return;
    }

    setNewFileName(`${newFileName}.json`);

    // 開 model
    setOpened(true);
  };

  return (
    <>
      <Row className="mb-3">
        <Col>
          <FormProvider
            watch={watch}
            register={register}
            getValues={getValues}
            setValue={setValue}
            reset={reset}
            control={control}
            formState={formState}
          >
            <Form noValidate onSubmit={handleSubmit(submit)}>
              <Row className="mb-3">
                <Col>
                  {applyItem === "new" ? (
                    <Text
                      label="設定檔名稱"
                      idKey="newFileName"
                      suffix=".json"
                    />
                  ) : (
                    <Select
                      variant="standard"
                      label="設定檔"
                      value={selected}
                      onChange={(val) => {
                        router.push(`/settings/${val}`);
                      }}
                    >
                      {allJsonData.map((file, index) => (
                        <Option key={index} value={file.file}>
                          {`${file.content.name} (${file.file})`}
                        </Option>
                      ))}
                    </Select>
                  )}
                </Col>
                <Col></Col>
                <Col className="d-flex justify-content-end">
                  <Button
                    variant="success"
                    className="bs-success me-2"
                    onClick={newData}
                    disabled={applyItem === "new"}
                  >
                    New
                  </Button>
                  {applyItem === "new" && (
                    <Button
                      variant="primary"
                      className="bs-primary me-2"
                      type="submit"
                    >
                      Complete
                    </Button>
                  )}
                  {/* <Button
                  variant="danger"
                  className={`bs-danger ${applyItem === "new" && "me-2"}`}
                  onClick={deleteData}
                  disabled={applyItem === "new"}
                >
                  Delete
                </Button> */}
                  {applyItem === "new" && (
                    <Button
                      variant="secondary"
                      className="bs-secondary"
                      onClick={() => router.back()}
                    >
                      Cancel
                    </Button>
                  )}
                </Col>
              </Row>
            </Form>
          </FormProvider>
          <Row className="mb-3">
            <JsonEditor data={jsonData} onUpdate={handleJsonUpdate} />
          </Row>
        </Col>
      </Row>

      <Modal
        show={opened === true}
        onHide={() => setOpened(false)}
        size="xl"
        centered
        scrollable
      >
        <Modal.Header closeButton>
          <Modal.Title>{newFileName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {jsonData ? (
            <Content
              config={
                !jsonData.tickets
                  ? {
                      name: jsonData.name,
                      tickets: [jsonData],
                    }
                  : jsonData
              }
            />
          ) : (
            <div>Loading...</div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            className="bs-secondary me-2"
            onClick={() => setOpened(false)}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            className="bs-success"
            onClick={() => downloadJson(jsonData, newFileName)}
          >
            Confirm & Download
          </Button>
        </Modal.Footer>
      </Modal>
      {/* <Dialog open={opened === true} size="xl" handler={setOpened}>
        <DialogHeader>{newFileName}</DialogHeader>
        <DialogBody className="max-h-[70vh] overflow-y-auto">
          {jsonData ? (
            <Content
              config={{
                name: jsonData.name,
                tickets: [jsonData],
              }}
            />
          ) : (
            <div>Loading...</div>
          )}
        </DialogBody>
        <DialogFooter>
          <Button
            variant="secondary"
            className="bs-secondary me-2"
            onClick={() => setOpened(false)}
          >
            Cancel
          </Button>
          <Button
            variant="success"
            className="bs-success"
            onClick={() => setOpened(false)}
          >
            Confirm
          </Button>
        </DialogFooter>
      </Dialog> */}
    </>
  );
};

const fetchData = async ({ isClientCall }) => {
  console.info("fetch data");

  try {
    const response = await fetch(
      isClientCall === true
        ? "/bpm-elf/api/settings-raw"
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/settings-raw`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const resp = await response.json();

    return resp;
  } catch (error) {
    console.error("🔥 Fetch Error:", error);
    toast.error("Fetch error:", error.message);
  }
};

export default DynamicPage;
