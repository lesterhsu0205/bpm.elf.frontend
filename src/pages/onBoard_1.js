// pages/onBoard.js

import { useForm, FormProvider } from "react-hook-form";
import { Button, Form, Col, Row, Stack } from "react-bootstrap";

import Layout from "@/components/layout";
import General from "@/section/general";
import ApplyDevice from "@/section/applyDevice";
import InstallSoftware from "@/section/installSoftware";
import Bitbucket from "@/section/authority/bitbucket";

function OnBoard() {
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
    console.info(data.division);
    console.info(data.department);
    console.info(data.require_type);
    console.info(data.bitbucket_description)

    setValue(
      "apply_device_description",
      `[需求說明]\n
  ${data.division} ${data.department} 新進同仁 ${data.staffId} ${data.engName} ${data.chiName} 新人到職申請 ${data.device}\n
  [執行單位]\n
  問管暨IDC作業管理部`
    );

    setValue(
      "install_software_description",
      `申請部門: ${data.division}/${data.department}\n
  申請安裝人員: ${data.staffId} ${data.engName} ${data.chiName}\n
  申請安裝設備: ${data.target_device}\n
  申請原因:\n
  ${data.reason}\n
  安裝軟體資訊如下:\n
  *詳細資訊請參考附件\n
  ${data.softwareList}\n
  [執行單位]\n
  問管暨IDC作業管理部
  `
    );
  };

  return (
    <Layout>
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
          <General />
          <ApplyDevice />
          <InstallSoftware />
          <Bitbucket />

          <Stack className="col-md-5 mx-auto">
            <Button variant="primary" size="lg" type="submit">
              建立
            </Button>
          </Stack>

        </Form>
      </FormProvider>
    </Layout>
  );
}

export default OnBoard;
