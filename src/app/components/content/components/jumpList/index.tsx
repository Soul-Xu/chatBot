 // 跳转列表
import React from 'react';
import Image from "next/image"
import Link from "next/link"
import ImgLinkIcon from "@/public/images/link_icon.png"
import classnames from "classnames/bind"
import styles from "./index.module.scss"
const classNames = classnames.bind(styles)
interface JumpListProps {
  messageTip: string
  listData: Array<any>
}

const JumpList = (props: JumpListProps) => {
  const { messageTip, listData } = props

  return (
    <div className={classNames("assistant")}>
      <div className={classNames("assistant-tip")}>
        您好，如果您要{messageTip}，请发起以下流程：
      </div>
      <div className={classNames("assistant-list")}>
        {
          listData.length > 0 && listData.map((item:any) => {
            return (
              <Link 
                className={classNames("assistant-item")} 
                href={item.url}
                key={item.templateId} 
                target="_blank"
              >
                <span className={classNames("assistant-item-title")}>
                  {item.order + '、' + item.templateName}
                </span>
                {
                  item?.url && (
                    <span className={classNames("assistant-item-link")}>
                      <Image src={ImgLinkIcon} alt="link_icon" width={12} height={12}  />
                    </span>
                  )
                }
              </Link>
            )
          }
          )
        }
      </div>
    </div>
  )
}

export default JumpList