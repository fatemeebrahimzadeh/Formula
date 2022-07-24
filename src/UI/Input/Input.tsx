
import React, { Component } from "react";
import { FORM_VALIDATION } from "../../@types/events";
import { GlobalEvent } from "../../utils/event-emitter";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import './Input.scss'

type validationNames = 'required' | 'number' | 'max' | 'min' | 'custom'

export interface IInputValidationRules {
  name: validationNames,
  value?: number,
  handler?: (val: string) => string | undefined
  runtime?: 'onEvent' | 'onChange' | 'onBlur'
}

export interface IProps {
  onChange: (
    value: string,
    e?: React.ChangeEvent<HTMLInputElement>
  ) => void,
  onFocus?: () => void
  onBlur?: () => void
  groupName?: string
  className?: string
  value: string
  label?: string
  id?: string
  enable?: boolean,
  maxValue?: number
  validation?: IInputValidationRules[]
  type?: 'number'
  maxLength?: number
  needBottomBorder?: boolean
  placeholder?: string
  inputType?: "password" | "file"
  svgIcon?: JSX.Element
  faIcon?: { icon: IconDefinition, className?: string, onClickHandler?: () => void }
  focusOnMount?: boolean
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

interface IState {
  validationMessages: string[]
  isFocused: boolean
}

export default class Input extends Component<IProps, IState> {

  inputRef = React.createRef<HTMLInputElement>()

  state: IState = {
    validationMessages: [],
    isFocused: false
  }

  componentDidMount() {
    if (this.props.groupName) {
      GlobalEvent.get().subscribe<string>(FORM_VALIDATION, this.onValidationListener)
    }

    if (this.props.focusOnMount) {
      this.input.focus()
      this.props.onFocus && this.props.onFocus()
      this.setState({
        isFocused: true,
      })
    }
  }

  componentWillUnmount() {
    GlobalEvent.get().unsubscribe(FORM_VALIDATION, this.onValidationListener)
  }

  onValidationListener = (groupName: string) => {
    if (groupName === this.props.groupName) {
      const validationResult = checkInputValidate(this.props.value, this.props.validation, 'onEvent', this.props.type)
      this.setState({
        validationMessages: validationResult
      })
    }
  }

  //#region validation

  // main validation function

  //#endregion

  //#region converting

  convertStringToNumber = (text: string) => {
    let newText = text
    // if (Number(newText.split("")[0]) === 0) newText = newText.substring(1)
    return newText.split('').filter(letter => !isNaN(Number(letter))).join('').trim()
  }

  //#endregion

  onChange = (e?: React.ChangeEvent<HTMLInputElement>, extrnalValue: string = '') => {

    let value = ''
    if (e) {
      value = e.target.value
    } else {
      value = extrnalValue
    }

    if (this.props.type === 'number') {
      value = this.convertStringToNumber(value)
    }

    // maxLength checking
    if (this.props.maxLength !== undefined) {
      value = value.substring(0, this.props.maxLength)
    }

    // maxValue checking in number type
    if (this.props.maxValue !== undefined && this.props.type === 'number') {
      if (Number(value) > this.props.maxValue) {
        value = value.substring(0, value.length - 1)
      }
    }

    // this.validate(value)
    const validationResult = checkInputValidate(value, this.props.validation, 'onChange', this.props.type)
    this.setState({
      validationMessages: validationResult
    })

    this.props.onChange(value, e)

  }

  onBlur = () => {
    this.props.onBlur && this.props.onBlur()

    if (this.props.inputType !== "file") {
      const validationResult = checkInputValidate(this.props.value, this.props.validation, 'onBlur', this.props.type)
      this.setState({
        isFocused: false,
        validationMessages: validationResult
      })
    } else {
      this.setState({
        isFocused: false
      })
    }
  }

  onFocus = () => {
    // const validationResult = checkInputValidate(this.props.value, this.props.validation, this.props.type)

    this.props.onFocus && this.props.onFocus()

    this.setState({
      isFocused: true,
      // validationMessages: validationResult
    })
  }

  onKeypress(e: React.KeyboardEvent<HTMLInputElement>) {
    this.props.onKeyPress && this.props.onKeyPress(e)
  }

  get input() {
    return this.inputRef.current!
  }

  render() {

    let disabled = false
    if (this.props.enable === false) {
      disabled = true
    }

    let validationMessages = null
    if (this.state.validationMessages.length) {
      validationMessages = <div className="validation-group-messages" data-testid="validation-group">
        <span className="error-message">{this.state.validationMessages[0]}</span>
      </div>
    }

    return (
      <div
        className={`custom-input ${this.props.className}`}
        data-testid="input-component">
        {this.props.label && <label className={`${(this.state.isFocused || this.props.value.length) && 'label-focused'}`} htmlFor={this.props.id}>{this.props.label}</label>}

        <div className={this.state.validationMessages.length ? 'input__details invalid-input' : 'input__details'}>
          {this.props.svgIcon && this.props.svgIcon}
          {this.props.faIcon && <FontAwesomeIcon
            icon={this.props.faIcon.icon}
            className={disabled ? this.props.faIcon.className + " disabled" : this.props.faIcon.className}
            onClick={this.props.faIcon.onClickHandler}
          />}

          <input
            autoComplete="off"
            ref={this.inputRef}
            className={this.state.isFocused ? 'input-field input-focused' : 'input-field'}
            id={this.props.id}
            disabled={disabled}
            data-testid='input'
            onChange={this.onChange}
            value={this.props.value}
            onFocus={() => this.onFocus()}
            onBlur={() => this.onBlur()}
            placeholder={this.props.placeholder}
            type={this.props.inputType}
            onKeyPress={(e) => this.onKeypress(e)}
          />
          {validationMessages}
        </div>

        {this.props.needBottomBorder && <div className={`${this.state.isFocused && 'border-bottom-focused'} border-bottom`}></div>}

      </div>
    )
  }
}


export const checkInputValidate = (
  value: string,
  validationRules?: IInputValidationRules[],
  runime?: IInputValidationRules['runtime'],
  type?: 'number'
) => {
  let validationMessages: string[] = []

  if (validationRules && validationRules.length) {

    for (const validation of validationRules) {

      switch (validation.name) {

        case 'required':
          if (!value.trim().length) {
            validationMessages.push('This Field is Required')
          }
          break

        case 'number':
          if (!value.length || isNaN(Number(value))) {
            validationMessages.push('Please enter Numberic values')
          }
          break

        case 'max':
          if (type === 'number') {

            if (!isNaN(Number(value))) {
              if (Number(value) > validation.value!) {
                validationMessages.push(`Less than ${validation.value! + 1} is acceptable`)
              }
            }

          } else {
            if (value.length > validation.value!) {
              validationMessages.push(`Less than ${validation.value! + 1} character is acceptable`)
            }
          }
          break

        case 'min':
          if (type === 'number') {

            if (!isNaN(Number(value))) {
              if (Number(value) < validation.value!) {
                validationMessages.push(`More than ${validation.value! - 1} is acceptable`)
              }
            }

          } else {
            if (value.length < validation.value!) {
              validationMessages.push(`More than ${validation.value! - 1} character is acceptable`)
            }

          }
          break

        case 'custom':
          if (validation.runtime) {
            if (runime === validation.runtime) {
              const customValidationMessage = validation.handler!(value)
              customValidationMessage && validationMessages.push(customValidationMessage)
            }
          } else {
            const customValidationMessage = validation.handler!(value)
            customValidationMessage && validationMessages.push(customValidationMessage)
          }
          break
      }

    }

  }

  return validationMessages

}