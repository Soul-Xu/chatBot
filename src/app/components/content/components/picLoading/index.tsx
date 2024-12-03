import React from 'react'
import Image from "next/image"
import ImgChatbot from "@/public/images/chatbot.png"
import classnames from "classnames/bind"
import styles from "./index.module.scss"
const classNames = classnames.bind(styles)
  
// 图片loading
const PicLoading = () => {
  return (
    <div className={classNames("assistant")}>
      <div className={classNames("assistant-avatar")}>
        <Image src={ImgChatbot} alt="chatbot" width={20} height={19} />
      </div>
      <div className={classNames("assistant-content")}>
        <div className={classNames("assistant-content-picLoading")}></div>
      </div>
    </div>
  )
}

export default PicLoading