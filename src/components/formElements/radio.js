import { Form, Col } from 'react-bootstrap'
import { useFormContext } from 'react-hook-form'
import { useMemo } from 'react'

const Radio = ({ label, idKey, options, ticketName = '' }) => {
  const {
    register,
  } = useFormContext({ mode: 'all' })

  const optionIds = useMemo(() => 
    options?.map((_, index) => `${idKey}_${crypto.randomUUID()}_${index}`) || [],
    [idKey, options]
  )

  return (
    <Col className="d-flex">
      <Form.Label className="me-5">{label}</Form.Label>
      {options
        && options.length > 0
        && options.map((option, index) => {
          return (
            <Form.Check
              key={optionIds[index]}
              inline
              type="radio"
              id={optionIds[index]}
              name={idKey}
              label={option.text}
              value={option.text}
              {...register(idKey)}
            />
          )
        })}
    </Col>
  )
}

export default Radio
