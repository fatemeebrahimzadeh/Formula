import React, { Component } from "react";

import "./Checkbox.scss"

interface IProps {
    id?: string
    enableHandler?: () => void
    onChange: (value: number | boolean, event: React.ChangeEvent<HTMLInputElement>) => void
    checked: number | boolean
    onSubmitedModeValidationHandler?: () => void
    className?: string
    onFocus?: () => void
}

interface IState {
    value: boolean
}

class Checkbox extends Component<IProps, IState> {

    ConvertedToBooleanChecked: boolean
    ConvertedToNumberChecked: number

    constructor(props: IProps) {
        super(props)
        this.ConvertedToBooleanChecked = false
        this.ConvertedToNumberChecked = 0
    }

    convertToBoolean = (numberChecked: number) => {
        return numberChecked === 0 ? false : true
    }

    convertToNumber = (booleanChecked: boolean) => {
        return booleanChecked ? 1 : 0
    }

    onChange = (event: React.ChangeEvent<HTMLInputElement>) => {

        this.props.onSubmitedModeValidationHandler && this.props.onSubmitedModeValidationHandler()
        this.props.enableHandler && this.props.enableHandler()

        this.props.onChange(typeof this.props.checked === 'boolean' ? event.target.checked : this.convertToNumber(event.target.checked), event)

        // this.props.onChange(!this.prepareCheckboxValueHandler(), event)
    }

    // prepareCheckboxValueHandler() {
    //     if (typeof this.props.checked === 'boolean') {
    //         return this.props.checked
    //     } else {
    //         return this.convertToNumber(this.state.value)
    //     }
    // }

    // get value() {
    //     if (typeof this.props.checked === 'boolean') {
    //         return this.props.checked
    //     } else {
    //         return this.convertToBoolean(this.props.checked)
    //     }
    // }

    onFocus = () => {
        this.props.onFocus && this.props.onFocus()
    }

    render() {

        return (
            <input
                className={`Checkbox ${this.props.className}`}
                type="checkbox"
                id={this.props.id}
                checked={typeof this.props.checked === "boolean" ? this.props.checked : this.convertToBoolean(this.props.checked)}
                onChange={this.onChange}
                onFocus={() => this.onFocus()} />
        );
    }

}

export default Checkbox;