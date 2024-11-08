"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useForm, FormProvider } from "react-hook-form";
import { Form, Row, Col, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import _ from "lodash";

import Layout from "@/components/layout";
import JsonEditor from "@/components/jsonEditor";
import Text from "@/components/formElements/text";

// 取得所有 ${applyItem}.json
// export async function getServerSideProps() {
//   const publicDir = path.join(process.cwd(), "public");
//   const fileNames = fs.readdirSync(publicDir);
//   const jsonFileNames = fileNames.filter((fileName) =>
//     fileName.endsWith(".json")
//   );

//   return {
//     props: {
//       jsonFileNames,
//     },
//   };
// }

const Settings = () => {
  const initJsonData = { name: null, tickets: [] };
  const router = useRouter();

  const [basePath, SetBasePath] = useState(null);
  const [clickEvt, SetClickEvt] = useState(0);

  const [jsonFiles, setJsonFiles] = useState([]);
  const [focusFileName, setFocusFileName] = useState(null);
  const jsonDataRef = useRef(initJsonData);
  const [jsonDataView, setJsonDataView] = useState(null);
  const [newDataMode, setNewDataMode] = useState(false);

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
  watch();

  const submit = (data) => {
    try {
      saveData({ newFileName: data.focusFileName });
    } catch (Error) {
      toast.warn(Error.message);
    }
  };

  const refreshJsonView = () => {
    const newJsonData = { ...jsonDataRef.current };
    setJsonDataView(newJsonData);
  };

  const setJsonRefData = (newData) => {
    jsonDataRef.current = newData;
    refreshJsonView();
  };

  const newData = () => {
    setNewDataMode(true);
    setFocusFileName(null);
    setJsonRefData(initJsonData);
    refreshJsonView();
  };

  const deleteData = async () => {
    const response = await fetch(
      `${basePath}/api/delete-setting/${focusFileName}`,
      {
        method: "DELETE",
      }
    );

    const result = await response.json();
    reset({
      focusFileName: null,
    });
    // just trigger useEffect
    setFocusFileName(null);
    toast.success(result.message);
  };

  const saveData = async ({ newFileName }) => {
    if (!(focusFileName || newFileName)) {
      toast.warn("檔名不得為空");
      return;
    }

    const fileName = focusFileName || `${newFileName}.json`;

    const response = await fetch(`${basePath}/api/write-setting/${fileName}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...jsonDataRef.current }),
    });

    const result = await response.json();

    if (newDataMode === true) {
      setNewDataMode(false);
      reset({
        focusFileName: null,
      });
      setFocusFileName(fileName);
    }
    // refreshJsonView();
    toast.success(result.message);
  };

  useEffect(() => {
    if (!router.isReady || newDataMode === true) {
      return;
    }

    const fetchData = async () => {
      try {
        // const response = await fetch(`${router.basePath}/${focusFileName}`);
        const response = await fetch(`${router.basePath}/api/read-settings`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const resp = await response.json();

        const focusFile = focusFileName
          ? resp.find((file) => file.file === focusFileName)
          : resp[0];

        jsonDataRef.current = focusFile.content;

        if (!focusFileName) {
          setFocusFileName(focusFile.file);
        }

        SetBasePath(router.basePath);
        setJsonFiles(resp);
        setJsonDataView({ ...focusFile.content });
      } catch (error) {
        toast.error(`Fetch error: ${error.message}`);
      }
    };

    fetchData();
  }, [router.isReady, router.basePath, focusFileName, newDataMode]);

  return (
    <Layout>
      <Row className="mb-3">
        <Col className="col-8">
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
                  <Text
                    label="檔案名稱"
                    idKey="focusFileName"
                    readOnly={!newDataMode}
                    disabled={!newDataMode}
                    placeholder={`${_.replace(focusFileName, ".json", "")}`}
                    suffix=".json"
                  />
                </Col>
                <Col className="d-flex justify-content-end">
                  <Button
                    variant="success"
                    className="bs-success me-2"
                    onClick={newData}
                    disabled={newDataMode}
                  >
                    New
                  </Button>
                  <Button
                    variant="primary"
                    className="bs-primary me-2"
                    type="submit"
                  >
                    Update
                  </Button>
                  <Button
                    variant="danger"
                    className={`bs-danger ${newDataMode === true && "me-2"}`}
                    onClick={deleteData}
                    disabled={newDataMode}
                  >
                    Delete
                  </Button>
                  {newDataMode === true && (
                    <Button
                      variant="secondary"
                      className="bs-secondary"
                      onClick={() => setNewDataMode(false)}
                    >
                      Cancel
                    </Button>
                  )}
                </Col>
              </Row>
            </Form>
          </FormProvider>
          <Row className="mb-3">
            <JsonEditor data={jsonDataRef.current} setData={setJsonRefData} />
          </Row>
        </Col>
        <Col className="col-4">
          <strong>設定檔</strong>
          {jsonFiles.map((file, index) => (
            <li key={index}>
              <a
                href="#"
                className="workaround"
                onClick={(e) => {
                  e.preventDefault();
                  setFocusFileName(file.file);
                  SetClickEvt(clickEvt + 1);
                }}
              >
                {file.file}
              </a>
            </li>
          ))}
        </Col>
        {/* <Col>
          <pre>{JSON.stringify(jsonDataView, null, 2)}</pre>
        </Col> */}
      </Row>
    </Layout>
  );
};

export default Settings;
