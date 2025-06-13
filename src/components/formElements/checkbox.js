import { Form, Col, InputGroup } from 'react-bootstrap'
import { useFormContext } from 'react-hook-form'

const Checkbox = ({ label, idKey, options }) => {
  const {
    register,
    reset,
    getValues,
    formState: { errors },
  } = useFormContext({ mode: 'all' })

  return (
    <Col className="d-flex">
      <Form.Label className="me-5">{label}</Form.Label>
      {options
        && options.length > 0
        && options.map((option, index) => (
          <Form.Check
            key={option.text}
            inline
            type="checkbox"
            id={`${idKey}_${option.text}`}
            name={idKey}
            label={option.text}
            value={option.text}
            {...register(idKey)}
          />
        ))}
    </Col>
  )
}

export default Checkbox
