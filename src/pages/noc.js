import Layout from "@/components/layout";
import { Tab, Tabs, Form, Row, Col, Button } from "react-bootstrap";

const Noc = () => (
  <Layout>
    <Tabs
      defaultActiveKey="profile"
      id="justify-tab-example"
      className="mb-3"
      justify
    >
      <Tab eventKey="vm_apply" title="VM申請">
        noc
      </Tab>
      <Tab eventKey="db_apply" title="DB申請">
        DB申請
      </Tab>
      <Tab eventKey="firewall" title="防火牆開通">
        防火牆開通
      </Tab>
    </Tabs>
  </Layout>
);

export default Noc;
