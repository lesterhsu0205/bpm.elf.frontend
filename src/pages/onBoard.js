// pages/onBoard.js
import Layout from "@/components/layout";
import { Tab, Tabs } from "react-bootstrap";
import ApplyDevice from "@/section/applyDevice";
import InstallSoftware from "@/section/installSoftware";

function OnBoard() {
  return (
    <Layout>
      <Tabs
        defaultActiveKey="profile"
        id="justify-tab-example"
        className="mb-3"
        justify
      >
        <Tab eventKey="device_apply" title="設備申請">
          <ApplyDevice />
        </Tab>
        <Tab eventKey="software_install" title="軟體安裝">
          <InstallSoftware />
        </Tab>
        <Tab eventKey="access_apply" title="權限申請">
          權限申請
        </Tab>
      </Tabs>
    </Layout>
  );
}

export default OnBoard;
