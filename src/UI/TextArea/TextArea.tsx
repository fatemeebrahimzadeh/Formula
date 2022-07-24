import { Dispatch, SetStateAction } from "react"
import "./TextArea.scss"

export interface IProps {
    value: string
    onChange?: (
        value: string,
        e?: React.ChangeEvent<HTMLTextAreaElement>
    ) => void
    rows?: number
    cols?: number
    name?: string
    placeholder?: string
    wrap?: string
    className?: string
    formId?: string
    maxLength?: number
    disabled?: boolean
    readOnly?: boolean
    autoFocus?: boolean
    required?: boolean
}

export default function TextArea(props: IProps) {

    return (
        <textarea
            onChange={(event) => { props.onChange && props.onChange(event.target.value, event) }}
            value={props.value}
            className={`Textarea ${props.className}`}
            rows={props.rows}
            cols={props.cols}
            name={props.name}
            placeholder={props.placeholder}
            wrap={props.wrap}
            form={props.formId}
            maxLength={props.maxLength}
            disabled={props.disabled}
            readOnly={props.readOnly}
            autoFocus={props.autoFocus}
            required={props.required}
            data-testid='textarea'
        />
    )
}