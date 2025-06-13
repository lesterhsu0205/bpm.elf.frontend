import { Form, Col, InputGroup } from 'react-bootstrap'
import { useFormContext } from 'react-hook-form'

const Select = ({ label, idKey, options }) => {
  const {
    register,
    reset,
    getValues,
    formState: { errors },
  } = useFormContext({ mode: 'all' })

  return (
    <InputGroup as={Col}>
      <InputGroup.Text>{label}</InputGroup.Text>
      <Form.Select {...register(idKey)}>
        {options
          && options.length > 0
          && options.map((option, index) => (
            <option key={option.text} value={option.text}>
              {option.text}
            </option>
          ))}
      </Form.Select>
    </InputGroup>
  )
}

export default Select
