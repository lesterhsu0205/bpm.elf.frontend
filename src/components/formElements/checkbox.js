import { Form, Col } from 'react-bootstrap'
import { useFormContext } from 'react-hook-form'

const Checkbox = ({ label, idKey, options, ticketName = '' }) => {
  const {
    register,
  } = useFormContext({ mode: 'all' })

  // 創建唯一的 ID 前綴，避免多單據間的 ID 衝突
  const uniquePrefix = ticketName ? `${ticketName}_${idKey}` : idKey

  return (
    <Col className="d-flex">
      <Form.Label className="me-5">{label}</Form.Label>
      {options
        && options.length > 0
        && options.map((option, index) => {
          const optionId = `${uniquePrefix}_${crypto.randomUUID()}_${index}`
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
