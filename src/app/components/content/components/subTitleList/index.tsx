import React from 'react'
import { UserOutlined, RedoOutlined } from '@ant-design/icons'
import classnames from "classnames/bind"
import styles from "./index.module.scss"
const classNames = classnames.bind(styles)
  
// 二级标题列表
const subTitleList = (list: Array<any>) => {
  return (
    <div className={classNames("assistant-content-list")}>
      {
        list.map((item:any) => {
          return (
            <div
              className={classNames("assistant-text-item")} 
              key={item.id} 
            >
              <span className={classNames(
                {
                  "assistant-text-item-main": item.type === "sub",
                  "assistant-text-item-description": item.type !== "sub"
                }
              )}>
                {item.title}
              </span>
              <span className={classNames("assistant-text-item-description")}>
                {item.description}
                {item.textLoading && 
                  <span 
                    className={classNames("loading")}
                  >
                    <RedoOutlined className={classNames('rotate-animation-infinite')} />
                  </span>
                }
              </span>
            </div>
          )
        }
        )
      }
    </div>
  )
}

export default subTitleList