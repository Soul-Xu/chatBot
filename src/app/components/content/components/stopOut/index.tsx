import React from 'react'
import Image from "next/image"
import ImgChatbot from "@/public/images/chatbot.png"
import DotAnimation from "../dotAnimation"
import classnames from "classnames/bind"
import styles from "./index.module.scss"
const classNames = classnames.bind(styles)

// 文字loading - 停止输出
const TextLoadingStopOut = () => {
  return (
    <div>
      <div className={classNames("assistant")}>
        <div className={classNames("assistant-avatar")}>
          <Image src={ImgChatbot} alt="chatbot" width={20} height={19} />
        </div>
        <div className={classNames("assistant-content")}>
          <DotAnimation />
        </div>
      </div>
      <div className={classNames("tip")}>
        <span>停止输出</span>
      </div>
    </div>
  )
}

export default TextLoadingStopOut