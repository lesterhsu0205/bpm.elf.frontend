import { Form, Col } from 'react-bootstrap'
import { useFormContext } from 'react-hook-form'

const Checkbox = ({ label, idKey, options, ticketName = '' }) => {
  const {
    register,
  } = useFormContext({ mode: 'all' })

  return (
    <Col className="d-flex">
      <Form.Label className="me-5">{label}</Form.Label>
      {options
        && options.length > 0
        && options.map((option, index) => {
          const optionId = `${idKey}_${crypto.randomUUID()}_${index}`
          return (
            <Form.Check
              key={optionId}
              inline
              type="checkbox"
              id={optionId}
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

export default Checkbox
