"use client"

import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Form, Row, Button, Stack, Card } from "react-bootstrap";
import _ from "lodash";

import Layout from "@/components/layout";
import Text from "@/components/formElements/text";
import TextArea from "@/components/formElements/textArea";
import Select from "@/components/formElements/select";
import Checkbox from "@/components/formElements/checkbox";
import Description from "@/components/formElements/description";
import { toast } from "react-toastify";

function Content({ config }) {
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

  const [submitKey, setSubmitKey] = useState(null)

  // Watch all form fields for validate
  watch();

  const submit = (data) => {
    console.info(data.engName);
    console.info(data.department);
    console.info(data.device);
    console.info(data.apply_device_description);

    try {
      for (let i = 0; i < config.tickets.length; i++) {
        for (let j = 0; j < config.tickets[i].inputs.length; j++) {
          if (
            config.tickets[i].inputs[j].key === submitKey &&
            config.tickets[i].inputs[j].type === "description"
          ) {
            const compiled = _.template(config.tickets[i].inputs[j].template);

            setValue(config.tickets[i].inputs[j].key, compiled(data));
          }
        }
      }
    } catch (Error) {
      toast.warn(Error.message);
    }
  };

  const getGroupColumns = (inputs) => {
    let result = [];

    for (let i = 0; i < inputs.length; i++) {
      if (i % 3 === 0) {
        result.push([inputs[i]]);
      } else {
        // if (inputs[i].type === "textarea") {
        //   if (result[result.length - 1].length < 2) {
        //     result[result.length - 1].push(inputs[i]);
        //   } else {
        //     result.push([]);
        //     result[result.length - 1].push(inputs[i]);
        //   }
        // } else {
        result[result.length - 1].push(inputs[i]);
        // }
      }
    }

    return result;
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
          {config &&
            config.tickets.map((ticket) => {
              const groupColumns = getGroupColumns(ticket.inputs);

              return (
                <Card
                  key={ticket.title}
                  bg="light"
                  border="light"
                  className="mb-5"
                >
                  <Card.Header>
                    <strong>{ticket.title}</strong>
                  </Card.Header>
                  <Card.Body>
                    {groupColumns.map((rawData, rawIndex) => (
                      <Row key={`row_${rawIndex}`} className="mb-3">
                        {rawData.map((input, indexInRaw) => {
                          if ("text" === input.type) {
                            return (
                              <Text
                                key={`${input.key}_${indexInRaw}`}
                                label={input.label}
                                idKey={input.key}
                              />
                            );
                          } else if ("textarea" === input.type) {
                            return (
                              <TextArea
                                key={`${input.key}_${indexInRaw}`}
                                label={input.label}
                                idKey={input.key}
                              />
                            );
                          } else if ("select" === input.type) {
                            return (
                              <Select
                                key={`${input.key}_${indexInRaw}`}
                                label={input.label}
                                idKey={input.key}
                                options={input.options}
                              />
                            );
                          } else if ("checkbox" === input.type) {
                            return (
                              <Checkbox
                                key={`${input.key}_${indexInRaw}`}
                                label={input.label}
                                idKey={input.key}
                                options={input.options}
                              />
                            );
                          }
                        })}
                      </Row>
                    ))}

                    {ticket.inputs.map((input, index) => {
                      if (input.type === "description") {
                        return (
                          <React.Fragment key={`${input.key}_${index}`}>
                            <Row className="mb-3">
                              <Stack className="mx-auto">
                                <Button
                                  className="bs-primary"
                                  size="lg"
                                  type="submit"
                                  onClick={() => setSubmitKey(input.key)}
                                >
                                  建立
                                </Button>
                              </Stack>
                            </Row>
                            <Description
                              label={input.label}
                              idKey={input.key}
                              template={input.template}
                            />
                          </React.Fragment>
                        );
                      }
                    })}
                  </Card.Body>
                </Card>
              );
            })}
        </Form>
      </FormProvider>
    </Layout>
  );
}

export default Content;
