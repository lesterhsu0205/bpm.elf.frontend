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

import Layout from "@/components/layout";

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
  const JsonEditor = dynamic(
    () => import("json-edit-react").then((mod) => mod.JsonEditor),
    {
      ssr: false,
    }
  );

  const router = useRouter();

  const [clickEvt, SetClickEvt] = useState(0);
  const [focusFileName, setFocusFileName] = useState("onBoard.json");

  const jsonDataRef = useRef([{}]);

  const [jsonData, setJsonData] = useState(null);

  const setJsonRefData = (newData) => {
    jsonDataRef.current = newData;
  };

  const saveData = () => {
    const newJsonData = { ...jsonDataRef.current };
    setJsonData(newJsonData);

    // fs.writeFileSync(path.join(publicDir, focusFileName), newJsonData, "utf-8");
  };

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    const fetchData = async () => {
      console.info(focusFileName);
      try {
        const basePath = router.basePath;
        const response = await fetch(`${basePath}/${focusFileName}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const resp = await response.json();
        jsonDataRef.current = resp;
        setJsonData({ ...resp });
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchData();
  }, [router.isReady, router.basePath, focusFileName, clickEvt]);
  // In your React component:
  return (
    <>
      <Layout>
        <Row className="mb-3">
          <Col>
            <Row className="mb-3">
              <Col>
                <strong>{focusFileName}</strong>
              </Col>
              <Col className="d-flex justify-content-end">
                <ButtonGroup>
                  <Button variant="secondary" onClick={saveData}>
                    New
                  </Button>
                  <Button variant="secondary" onClick={saveData}>
                    Update
                  </Button>
                  <Button variant="secondary" onClick={saveData}>
                    Delete
                  </Button>
                </ButtonGroup>
              </Col>
            </Row>
            <Row className="mb-3">
              <JsonEditor
                data={jsonDataRef.current}
                setData={setJsonRefData} // optional
                rootName=""
                collapse={3}
                showCollectionCount="when-closed"
                maxWidth="100%"
              />
            </Row>
          </Col>
          <Col>
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
          <Col>
            <pre>{JSON.stringify(jsonData, null, 2)}</pre>
          </Col>
        </Row>
      </Layout>
    </>
  );
};

export default Settings;
