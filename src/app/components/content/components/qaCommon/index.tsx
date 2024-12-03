// 常见问题
import React, { useState, useEffect } from 'react';
import Image from "next/image"
import Link from "next/link"
import ImgQAIcon from "@/public/images/qa_icon.png"
import ImgRefreshIcon from "@/public/images/refresh_icon.png"
import ImgArrowIcon from "@/public/images/arrow_icon.png"
import classnames from "classnames/bind"
import styles from "./index.module.scss"
const classNames = classnames.bind(styles)
import { qaCommonList } from "@/app/constants"

const QaCommon = () => {
  // 添加一个状态来控制旋转动画
  const [isRotating, setIsRotating] = useState(false)

    // 处理点击"换一批"的事件
  const handleRefreshClick = (index?: number) => {
    if (!index && !isRotating) {
      setIsRotating(true)
      // 在动画结束后重置 isRotating 状态
      setTimeout(() => setIsRotating(false), 3000) // 假设动画持续时间为10秒
      // @ts-ignore
    } else if (index && !chatRecord[index]?.isRotating) {
    }
  }

  return (
    <div className={classNames("qa-common")}>
      <div className={classNames("description")}>
        <span className={classNames("description-left")}>
          <Image src={ImgQAIcon} alt="qa_icon" width={14} height={14}  />
          <span className={classNames("title")}>常见问题</span>
        </span>
        <span className={classNames("description-right")}>
          <Image
            src={ImgRefreshIcon}
            alt="refresh_icon"
            width={14}
            height={14}
            className={classNames({ 'rotate-animation': isRotating })}
          />
          <span className={classNames("refresh")} onClick={() => handleRefreshClick()}>换一批</span>
        </span>
      </div>
      <div className={classNames("list")}>
        {
          qaCommonList?.map((item:any) => {
            return (
              <Link className={classNames("item")} key={item.id} href={item.link} target="_blank">
                <span className={classNames("item-content")}>
                  <div className={classNames("dot")}></div>
                  <div className={classNames("text")}>
                    {item.title}
                  </div>
                </span>
                <div className={classNames("item-link")}>
                  <Image src={ImgArrowIcon} alt="arrow_icon" width={12} height={12}  />
                </div>
              </Link>
            )
          })
        }
      </div>
    </div>
  )
}

export default QaCommon