'use client'

import React, { useState, useMemo, forwardRef, useImperativeHandle } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { Form, Row, Button, Stack, Card } from 'react-bootstrap'
import _ from 'lodash'

import Text from '@/components/formElements/text'
import TextArea from '@/components/formElements/textArea'
import Select from '@/components/formElements/select'
import Checkbox from '@/components/formElements/checkbox'
import Radio from '@/components/formElements/radio'
import Description from '@/components/formElements/description'
import { toast } from 'react-toastify'

const Content = forwardRef(({ config }, ref) => {
  // 計算並儲存預設值
  const defaultValues = useMemo(() => {
    if (!config) return {}
    
    const defaults = {}
    
    // 處理 config，如果沒有 tickets 則轉換為包含 tickets 的格式
    const processedConfig = config.tickets ? config : {
      name: config.name,
      tickets: [config]
    }
    
    processedConfig.tickets?.forEach(ticket => {
      ticket.inputs?.forEach(input => {
        if (input.type === 'select' && input.options && input.options.length > 0) {
          // 尋找有 default: true 的選項，否則使用第一個選項
          const defaultOption = input.options.find(option => option.default === true)
          defaults[input.key] = defaultOption ? defaultOption.text : input.options[0].text
        } else if (input.type === 'radio' && input.options && input.options.length > 0) {
          // 尋找有 default: true 的選項，否則不設預設值
          const defaultOption = input.options.find(option => option.default === true)
          if (defaultOption) {
            defaults[input.key] = defaultOption.text
          }
        } else if (input.type === 'checkbox' && input.options && input.options.length > 0) {
          // checkbox 預設為空陣列，除非有 default: true 的選項
          const defaultOptions = input.options.filter(option => option.default === true)
          if (defaultOptions.length > 0) {
            defaults[input.key] = defaultOptions.map(opt => opt.text)
          }
        }
        // text 和 textarea 預設為空字串，不需要特別處理
      })
    })
    
    return defaults
  }, [config])

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
    mode: 'all',
    defaultValues,
  })

  // 暴露 reset 方法給父組件
  useImperativeHandle(ref, () => ({
    reset: () => {
      reset(defaultValues)
    }
  }))

  // 當配置或預設值改變時，設定表單的初始值
  React.useEffect(() => {
    if (Object.keys(defaultValues).length > 0) {
      reset(defaultValues)
    }
  }, [defaultValues, reset])

  const [submitKey, setSubmitKey] = useState(null)

  // 如果 config 內容很重，就用 useMemo 只在 config 改變時才重新計算
  const processedData = useMemo(() => {
    if (!config) return null

    // component 只吃有 tickets 欄位的 compose 單, single 單需先轉換為 component 單格式
    if (!config.tickets) {
      return {
        name: config.name,
        tickets: [config],
      }
    }

    return config
  }, [config])

  if (!processedData) {
    return <div>載入中...</div>
  }

  // Watch all form fields for validate
  watch()

  // 預處理 data，補上缺失的變數
  function processData(templateStr, data) {
    const templateVars = templateStr.match(/\$\{([a-zA-Z0-9_]+)\}/g) || []

    // 過濾變數名稱，去掉 `${}` 符號
    const missingVars = templateVars
      .map(v => v.replace(/\$\{|\}/g, ''))
      .filter(key => !(key in data))

    // 自動補上 `${變數名}`
    missingVars.forEach((key) => {
      data[key] = `\$\{${key}\}` // 保留原格式
    })

    return data
  }

  const submit = (data) => {
    try {
      for (let i = 0; i < processedData.tickets.length; i++) {
        for (let j = 0; j < processedData.tickets[i].inputs.length; j++) {
          if (
            processedData.tickets[i].inputs[j].key === submitKey
            && processedData.tickets[i].inputs[j].type === 'description'
          ) {
            const compiled = _.template(processedData.tickets[i].inputs[j].template)

            setValue(
              processedData.tickets[i].inputs[j].key,
              compiled(processData(processedData.tickets[i].inputs[j].template, data))
            )
          }
        }
      }
    }
    catch (Error) {
      toast.warn(Error.message)
    }
  }

  const getGroupColumns = (inputs) => {
    let result = []

    for (let i = 0; i < inputs.length; i++) {
      if (i % 3 === 0) {
        result.push([inputs[i]])
      }
      else {
        // if (inputs[i].type === "textarea") {
        //   if (result[result.length - 1].length < 2) {
        //     result[result.length - 1].push(inputs[i]);
        //   } else {
        //     result.push([]);
        //     result[result.length - 1].push(inputs[i]);
        //   }
        // } else {
        result[result.length - 1].push(inputs[i])
        // }
      }
    }

    return result
  }

  return (
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
        {processedData
          && processedData.tickets
          && processedData.tickets.length > 0
          && processedData.tickets
            .filter(ticket => ticket.inputs)
            .map((ticket) => {
              const groupColumns = getGroupColumns(ticket.inputs)

              return (
                <Card
                  key={ticket.name}
                  bg="light"
                  border="light"
                  className="mb-5"
                >
                  <Card.Header>
                    <strong>
                      {ticket.name}
                      {' '}
                      {ticket.path ? `(${ticket.path})` : ''}
                    </strong>
                  </Card.Header>
                  <Card.Body>
                    {groupColumns.map((rawData, rawIndex) => (
                      <Row key={`row_${rawIndex}`} className="mb-3">
                        {rawData.map((input, indexInRaw) => {
                          if ('text' === input.type) {
                            return (
                              <Text
                                key={`${input.key}_${indexInRaw}`}
                                label={input.label}
                                idKey={input.key}
                              />
                            )
                          }
                          else if ('textarea' === input.type) {
                            return (
                              <TextArea
                                key={`${input.key}_${indexInRaw}`}
                                label={input.label}
                                idKey={input.key}
                              />
                            )
                          }
                          else if ('select' === input.type) {
                            return (
                              <Select
                                key={`${input.key}_${indexInRaw}`}
                                label={input.label}
                                idKey={input.key}
                                options={input.options}
                              />
                            )
                          }
                          else if ('checkbox' === input.type) {
                            return (
                              <Checkbox
                                key={`${input.key}_${indexInRaw}`}
                                label={input.label}
                                idKey={input.key}
                                options={input.options}
                                ticketName={ticket.name}
                              />
                            )
                          }
                          else if ('radio' === input.type) {
                            return (
                              <Radio
                                key={`${input.key}_${indexInRaw}`}
                                label={input.label}
                                idKey={input.key}
                                options={input.options}
                                ticketName={ticket.name}
                              />
                            )
                          }
                        })}
                      </Row>
                    ))}

                    {ticket.inputs.map((input, index) => {
                      if (input.type === 'description') {
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
                        )
                      }
                    })}
                  </Card.Body>
                </Card>
              )
            })}
      </Form>
    </FormProvider>
  )
})

export default Content
