import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";

import Input, { IProps } from "./Input";

const defaultProps: IProps = {
  onChange: () => { },
  value: ''
}

const setup = (props: IProps = defaultProps) => {

  render(<Input {...props} />)

  return {
    input: screen.getByTestId('input') as HTMLInputElement,
  }

}

describe('render simple component', () => {


  it('render input element', () => {

    setup()

    expect(screen.getByTestId('input'))

  })

  it('set default value', () => {

    const { input } = setup({ value: 'hiiii', onChange: () => { } })

    expect(input.value).toBe('hiiii')

  })

  it('onChange event', () => {

    const onChangeMock = jest.fn()

    const { input } = setup({ onChange: onChangeMock, value: '' })

    fireEvent.change(input, { target: { value: 'hi this is test' } })

    expect(onChangeMock).toHaveBeenCalled()
    expect(onChangeMock.mock.calls[0][0]).toBe('hi this is test')
  })

  // disabling
  it('disable input', () => {

    const { input } = setup({ onChange: () => { }, value: '', enable: false })

    fireEvent.change(input, { target: { value: 'hi this is test' } })

    expect(input.disabled).toBe(true)

  })

  // label
  it('render label element', () => {

    setup({ onChange: () => { }, value: '', label: 'Input Label', id: 'input' })

    expect(screen.queryByLabelText('Input Label')).toBeInTheDocument()

  })

})

describe('input types', () => {

  it('number type', () => {

    const onChangeMock = jest.fn()

    const { input } = setup({ onChange: onChangeMock, value: '', enable: false, type: 'number' })

    fireEvent.change(input, { target: { value: 'hi this is 123 abc' } })

    expect(onChangeMock.mock.calls[0][0]).toBe('123')

  })


})

describe('validation types', () => {

  // required
  it('show required text validation', async () => {

    const { input } = setup(
      {
        onChange: () => { },
        value: 'hi this is',
        validation: [{ name: 'required' }]
      }
    )

    fireEvent.change(input, { target: { value: 'Hi This is a test for required validation' } })
    expect(screen.queryByTestId("validation-group")).not.toBeInTheDocument()

    fireEvent.change(input, { target: { value: '' } })
    expect(await screen.findByTestId("validation-group")).toBeInTheDocument()

  })

  // number
  it('show validation part for number type', async () => {

    const { input } = setup(
      {
        onChange: () => { },
        value: '123',
        validation: [{ name: 'number' }]
      }
    )

    fireEvent.change(input, { target: { value: 'c12a3ab' } })
    expect(await screen.findByTestId("validation-group")).toBeInTheDocument()

  })


  // max length in string
  it('show validation part for Max length', async () => {

    const { input } = setup(
      {
        onChange: () => { },
        value: '123',
        validation: [{ name: 'max', value: 3 }]
      }
    )

    // exact value as max
    fireEvent.change(input, { target: { value: 'c12' } })
    try {
      await screen.findByTestId("validation-group")
      throw new Error('invalid  element with validation-group test id attribute')
    } catch (error) { }

    fireEvent.change(input, { target: { value: 'c12a3ab' } })
    expect(await screen.findByTestId("validation-group")).toBeInTheDocument()

  })

  // min in string
  it('show validation part for Min length', async () => {

    const { input } = setup(
      {
        onChange: () => { },
        value: '123',
        validation: [{ name: 'min', value: 3 }]
      }
    )

    // exact value as min
    fireEvent.change(input, { target: { value: 'cb1' } })
    try {
      await screen.findByTestId("validation-group")
      throw new Error('invalid  element with validation-group test id attribute')
    } catch (error) { }

    fireEvent.change(input, { target: { value: 'cb' } })
    expect(await screen.findByTestId("validation-group")).toBeInTheDocument()

  })

  // max in numbers
  it('show validation part for Max length', async () => {

    const { input } = setup(
      {
        onChange: () => { },
        value: '123',
        type: 'number',
        validation: [{ name: 'max', value: 30 }]
      }
    )

    // exact value as max
    fireEvent.change(input, { target: { value: 30 } })
    try {
      await screen.findByTestId("validation-group")
      throw new Error('invalid  element with validation-group test id attribute')
    } catch (error) { }

    fireEvent.change(input, { target: { value: 31 } })
    expect(await screen.findByTestId("validation-group")).toBeInTheDocument()

  })

  // min in numbers
  it('show validation part for Min length', async () => {

    const { input } = setup(
      {
        onChange: () => { },
        value: '123',
        type: 'number',
        validation: [{ name: 'min', value: 30 }]
      }
    )

    // exact value as max
    fireEvent.change(input, { target: { value: 30 } })
    try {
      await screen.findByTestId("validation-group")
      throw new Error('invalid  element with validation-group test id attribute')
    } catch (error) { }

    fireEvent.change(input, { target: { value: 1 } })
    expect(await screen.findByTestId("validation-group")).toBeInTheDocument()

  })

  // maxLength in numbers
  it('show validation part for Min length', async () => {

    const onChangeMock = jest.fn()

    const { input } = setup(
      {
        onChange: onChangeMock,
        value: '',
        type: 'number',
        maxLength: 3
      }
    )

    // exact value as max
    fireEvent.change(input, { target: { value: "1234" } })

    expect(onChangeMock.mock.calls[0][0]).toBe("123")

  })

  // required
  it('show required text validation in blured event', async () => {

    const { input } = setup(
      {
        onChange: () => { },
        value: '',
        validation: [{ name: 'required' }]
      }
    )

    input.focus()
    input.blur()

    expect(await screen.findByTestId("validation-group")).toBeInTheDocument()

  })

  // maxValue
  it('maxValue in input with type number', () => {

    const onChangeMock = jest.fn()

    const { input } = setup(
      {
        onChange: onChangeMock,
        value: '',
        type: 'number',
        maxValue: 30
      }
    )

    fireEvent.change(input, { target: { value: "301" } })
    expect(onChangeMock.mock.calls[0][0]).toBe("30")


    fireEvent.change(input, { target: { value: "30" } })
    expect(onChangeMock.mock.calls[0][0]).toBe("30")


  })

})