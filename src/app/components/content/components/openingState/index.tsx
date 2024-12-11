import Image from "next/image"
import ImgChatbot from "@/public/images/chatbot.png"
import classnames from "classnames/bind"
import styles from "./index.module.scss"
const classNames = classnames.bind(styles)

// 开场白
const OpeningState = () => {
  return (
    <div className={classNames("opening-state")}>
      <div className={classNames("avatar")}>
        <Image src={ImgChatbot} alt="chatbot" width={20} height={19} />
      </div>
      <div className={classNames("content")}>
        <p>您好，我是流程助手～</p>
        <p>您可以通过对话快速查找需要发起的流程，</p>
        <p>查询你的待办流程，或者了解流程处理常见问题。</p>
      </div>
    </div>
  )
}

export default OpeningState