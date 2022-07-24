import React, { Component } from "react";
import { CLEAR_ALL_TOAST } from "../../../@types/events";
import { GlobalEvent } from "../../../utils/event-emitter";

import DangerToastIcon from "./Icons/DangerToast";
import DefaultToastIcon from "./Icons/DefaultToast";
import SuccessToastIcon from "./Icons/SuccessToast";
import WarningToastIcon from "./Icons/WarningToast";

import './Item.scss'

export interface IToastMessage {
  type: 'danger' | 'warning' | 'success' | 'default'
  message: string
  duration?: number
  position?: 'left-bottom' | 'right-bottom'
}

export interface IProps extends IToastMessage {
  id: string,
  onClearMessage: (id: string) => void
  index: number
}

interface IState {
  visibility: 'visible' | 'hidden'
}

export default class Item extends Component<IProps, IState> {

  timer: number | undefined
  visibilityTimer: NodeJS.Timeout | undefined

  state: Readonly<IState> = {
    visibility: 'hidden'
  }

  componentDidMount() {
    // @ts-ignore
    this.timer = setTimeout(() => {
      this.clearMessage()
    }, this.props.duration)

    this.setState({
      visibility: 'visible'
    })


  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer)
  }

  clearMessage = () => {

    this.visibilityTimer && clearTimeout(this.visibilityTimer)

    this.setState({
      visibility: 'hidden'
    })

    this.visibilityTimer = setTimeout(() => {
      this.props.onClearMessage(this.props.id)
    }, 100)
  }

  render() {

    let toastIcon = <></>
    switch (this.props.type) {

      case 'danger':
        toastIcon = <DangerToastIcon />
        break

      case 'success':
        toastIcon = <SuccessToastIcon />
        break

      case 'warning':
        toastIcon = <WarningToastIcon />
        break

      default:
        toastIcon = <DefaultToastIcon />
        break
    }

    let position = this.props.position
    if (!position) {
      position = 'left-bottom'
    }

    return (
      <>

        <div
          onClick={this.clearMessage}
          className={`toast-item toast-${this.props.type} ${position} item-${this.state.visibility}`}
          style={
            {
              bottom: (this.props.index * 50 + 10) + 'px',
            }
          }
        >
          <div className="toast-message-container">
            <div className="toast-icon">
              {toastIcon}
            </div>
            <div className="toast-message">
              <p className="message">
                {this.props.message}
              </p>
            </div>
          </div>
        </div>

      </>
    )
  }
}