"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import {
  Form,
  Row,
  Col,
  Button,
  ButtonGroup,
  Stack,
  Card,
} from "react-bootstrap";
import fs from "fs";
import path from "path";
import { toast } from "react-toastify";
import _ from "lodash";

import Layout from "@/components/layout";
import JsonEditor from "@/components/jsonEditor";

export async function getServerSideProps() {
  const publicDir = path.join(process.cwd(), "public");
  const fileNames = fs.readdirSync(publicDir);
  const jsonFileNames = fileNames.filter((fileName) =>
    fileName.endsWith(".json")
  );

  return {
    props: {
      jsonFileNames,
    },
  };
}

const Settings = ({ jsonFileNames }) => {
  // const JsonEditor = dynamic(
  //   () => import("json-edit-react").then((mod) => mod.JsonEditor),
  //   {
  //     ssr: false,
  //   }
  // );

  const router = useRouter();

  const [basePath, SetBasePath] = useState(null);
  const [clickEvt, SetClickEvt] = useState(0);
  const [focusFileName, setFocusFileName] = useState("onBoard.json");

  const jsonDataRef = useRef([{}]);

  const [jsonDataView, setJsonDataView] = useState(null);

  const setJsonRefData = (newData) => {
    jsonDataRef.current = newData;
  };

  const saveData = async () => {
    const newJsonData = { ...jsonDataRef.current };
    setJsonDataView(newJsonData);

    const response = await fetch(
      `${basePath}/api/write-setting/${focusFileName}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newJsonData),
      }
    );

    const result = await response.json();
    toast.info(result.message);
  };

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    const fetchData = async () => {
      console.info(focusFileName);
      try {
        const response = await fetch(`${router.basePath}/${focusFileName}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const resp = await response.json();
        jsonDataRef.current = resp;

        SetBasePath(router.basePath);
        setJsonDataView({ ...resp });
      } catch (error) {
        toast.error("Fetch error:", error);
      }
    };

    fetchData();
  }, [router.isReady, router.basePath, focusFileName, clickEvt]);
  // In your React component:
  return (
    <Layout>
      <Row className="mb-3">
        <Col className="col-8">
          <Row className="mb-3">
            <Col>
              <strong>{focusFileName}</strong>
            </Col>
            <Col className="d-flex justify-content-end">
              <ButtonGroup>
                <Button
                  variant="secondary"
                  className="bs-secondary"
                  onClick={saveData}
                >
                  New
                </Button>
                <Button
                  variant="secondary"
                  className="bs-secondary"
                  onClick={saveData}
                >
                  Update
                </Button>
                <Button
                  variant="secondary"
                  className="bs-secondary"
                  onClick={saveData}
                >
                  Delete
                </Button>
              </ButtonGroup>
            </Col>
          </Row>
          <Row className="mb-3">
            <JsonEditor data={jsonDataRef.current} setData={setJsonRefData}/>
            {/* <JsonEditor
              data={jsonDataRef.current}
              setData={setJsonRefData} // optional
              rootName=""
              collapse={3}
              showCollectionCount="when-closed"
              maxWidth="100%"
            /> */}
          </Row>
        </Col>
        <Col className="col-4">
          <strong>設定檔</strong>
          {jsonFileNames.map((fileName, index) => (
            <li key={index}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setFocusFileName(fileName);
                  SetClickEvt(clickEvt + 1);
                }}
              >
                {fileName}
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
