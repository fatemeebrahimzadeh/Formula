import React, { Component } from "react";

import { CLEAR_ALL_TOAST, SHOW_TOAST } from "../../@types/events";
import { GlobalEvent } from "../../utils/event-emitter";
import { makeid } from "../../utils/make-id";
import Item, { IToastMessage, IProps as IToast } from "./Item/Item";


interface IProps {
  duration: number
}

interface IState {
  messages: IToast[]
}

export default class ToastGroup extends Component<IProps, IState> {

  state: IState = {
    messages: []
  }

  componentDidMount() {

    GlobalEvent.get().subscribe<IToastMessage>(SHOW_TOAST, this.addToastMessage)
    GlobalEvent.get().subscribe(CLEAR_ALL_TOAST, this.clearAllMessages)
  }

  addToastMessage = (message: IToastMessage) => {

    const fullMessage = {
      ...message,
      id: message.message + Date.now() + makeid(10),
      onClearMessage: this.onClearMessage,
      index: this.state.messages.length,
      duration: message.duration || this.props.duration
    }

    this.setState(prevState => (
      {
        messages: [fullMessage, ...prevState.messages]
      }
    ))

  }

  onClearMessage = (id: string) => {
    this.setState(prevState => (
      {
        messages: prevState.messages.filter(message => message.id !== id)
      }
    ))
  }

  clearAllMessages = () => {
    this.setState(
      {
        messages: []
      }
    )
  }

  componentWillUnmount() {
    GlobalEvent.get().unsubscribe(SHOW_TOAST, this.addToastMessage)
    GlobalEvent.get().unsubscribe(CLEAR_ALL_TOAST, this.clearAllMessages)

  }

  render() {

    const messages = this.state.messages.map((message, i) => {

      // detect each message based on its position
      let index = 0
      let position = message.position
      for (let j = 0; j < this.state.messages.length; j++) {
        const messageInfo = this.state.messages[j]

        if (messageInfo.position === position && messageInfo != message) {
          index++
        }

        if (messageInfo == message) break
      }

      return <Item {...message} index={index} key={message.id} />
    })

    return (
      <>
        {messages}
      </>
    )
  }
}