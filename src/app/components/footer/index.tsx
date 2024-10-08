"use client"
import React, { useState, useEffect } from "react"
import Image from "next/image"
import { Input, Button } from "antd"
import ImgActionIcon from "@/public/images/action_icon.png"
import classnames from "classnames/bind"
import styles from "./index.module.scss"
const classNames = classnames.bind(styles)
const Textarea = Input.TextArea

interface Props {
  onSendMessage: (params: any) => void
}

const Footer = (props: Props) => {
  const { onSendMessage } = props
  const [inputHeight, setInputHeight] = useState(36)
  const [message, setMessage] = useState("")
  const [isThrottled, setIsThrottled] = useState(false) // 节流状态

  const handleInput = (event: any) => {
    const { target } = event
    const inputLength = target.value.length
    const inputWidth = 394
    const charWidth = 14
    const lineHeight = 36

    const lines = Math.ceil(inputLength * charWidth / inputWidth)
    let newHeight = lines * lineHeight
    const maxHeight = 200
    if (newHeight > maxHeight) {
      newHeight = maxHeight
    }

    setInputHeight(newHeight)
    setMessage(target.value)
  };

  // 点击提交按钮
  const handleSubmit = () => {
    if (isThrottled) return
    setIsThrottled(true)
    if (message) {
      onSendMessage(message)
      sendChatMessageToParent(message)
      setMessage("")
      setInputHeight(36)
    }
    setTimeout(() => setIsThrottled(false), 3000) // 3秒后恢复按钮点击功能
  }

  // 给父级页面发送信息
  // 假设在AI聊天机器人的某个函数中，比如处理完聊天消息后
  const sendChatMessageToParent = (message:any) => {
    // 发送消息给父页面
    window.parent.postMessage({
      type: 'CHAT_MESSAGE',
      content: message
    }, 'http://127.0.0.1:2771/cms-center/desktop/#/processList/List') // 替换为父页面的实际源
  }

  useEffect(() => {
    if (inputHeight === 0) {
      setInputHeight(36)
    }
  }, [inputHeight])

  return (
    <footer className={classNames("footer")}>
      <div className={classNames("content")}>
        <Textarea
          className={classNames("input")}
          placeholder="请输入关键字"
          value={message} // 绑定value到message状态
          style={{
            height: `${inputHeight}px`,
            overflowY: inputHeight >= 200 ? 'auto' : 'hidden',
            resize: 'none',
          }}
          onChange={handleInput}
        />
        <Button className={classNames("button")} onClick={handleSubmit}>
          <Image src={ImgActionIcon} alt="action_icon" width={16} height={16} />
        </Button>
      </div>
    </footer>
  )
}

export default Footer
