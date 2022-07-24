import { fireEvent, render, screen } from "@testing-library/react";
import TextArea, { IProps } from "./TextArea";

const defaultProps: IProps = {
    onChange: () => { },
    value: ''
}

const setup = (props: IProps = defaultProps) => {
    render(<TextArea {...props} />)
    return {
        textarea: screen.getByTestId('textarea') as HTMLTextAreaElement,
    }
}

describe('render simple component', () => {
    it('render textarea element', () => {
        setup()
        expect(screen.getByTestId('textarea'))
    })

    it('set default value', () => {
        const { textarea } = setup({ value: 'hiiii', onChange: () => { } })
        expect(textarea.value).toBe('hiiii')
    })

    it('onChange event', () => {
        const onChangeMock = jest.fn()
        const { textarea } = setup({ onChange: onChangeMock, value: '' })
        fireEvent.change(textarea, { target: { value: 'hi this is test' } })
        expect(onChangeMock).toHaveBeenCalled()
        expect(onChangeMock.mock.calls[0][0]).toBe('hi this is test')
    })

    // disabling
    it('disable input', () => {
        const { textarea } = setup({ onChange: () => { }, value: '', disabled: true })
        fireEvent.change(textarea, { target: { value: 'hi this is test' } })
        expect(textarea.disabled).toBe(true)
    })
})