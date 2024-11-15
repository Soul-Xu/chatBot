"use client"
import React, { useEffect, useState, useRef, useDebugValue } from "react"
import Image from "next/image"
import Link from "next/link"
import ImgChatbot from "@/public/images/chatbot.png"
import ImgQAIcon from "@/public/images/qa_icon.png"
import ImgRefreshIcon from "@/public/images/refresh_icon.png"
import ImgArrowIcon from "@/public/images/arrow_icon.png"
import ImgLinkIcon from "@/public/images/link_icon.png"
import ImgCopyAction from "@/public/images/copy_action.png"
import ImgRefreshAction from "@/public/images/refresh_action.png"
import DotAnimation from "./components/dotAnimation"
import copy from 'copy-to-clipboard'
import { message,  Avatar } from "antd"
import { UserOutlined, RedoOutlined } from '@ant-design/icons'
import classnames from "classnames/bind"
import styles from "./index.module.scss"
const classNames = classnames.bind(styles)
// @ts-ignore
import EventSource from "eventsource"
import { qaCommonList } from "@/app/constants"

interface Props {
  children?: React.ReactNode
  messages?: any[]
}

const Content = (props: Props) => {
  const { messages } = props
  // 添加一个状态来控制旋转动画
  const [isRotating, setIsRotating] = useState(false)
  // 添加一个loading控制答案的输出状态
  const [isLoading, setIsLoading] = useState(false)
  // 添加一个answerLoading控制答案输入中还未完成的输出状态
  const [answerLoading, setAnswerLoading] = useState(false)
  // 修改 chatRecord 状态，为每个记录添加一个旋转状态
  const [chartRecord, setChartRecord] = useState<any>(
    // conversationList.map((item) => ({ ...item, isRotating: false })),
    []
  )
  const messagesEndRef = useRef(null) // 添加一个引用

  // 处理复杂功能
  const handleCopy = (text: string) => {
    copy(text)
    message.success('复制成功')
  }

  // // 处理点击"换一批"的事件
  // const handleRefreshClick = (index?: number) => {
  //   if (!index && !isRotating) {
  //     setIsRotating(true)
  //     // 在动画结束后重置 isRotating 状态
  //     setTimeout(() => setIsRotating(false), 3000) // 假设动画持续时间为10秒
  //     // @ts-ignore
  //   } else if (index && !chatRecord[index]?.isRotating) {
  //     setChartRecord((prevChatRecords:any) => {
  //       const newChatRecords = [...prevChatRecords]
  //       // 只更新对应聊天记录项的旋转状态
  //       newChatRecords[index] = {
  //         ...newChatRecords[index],
  //         isRotating: true,
  //       }
  //       return newChatRecords
  //     })
  //     // 在动画结束后重置旋转状态
  //     setTimeout(() => {
  //       setChartRecord((prevChatRecords:any) => {
  //         const newChatRecords = [...prevChatRecords]
  //         newChatRecords[index] = {
  //           ...newChatRecords[index],
  //           isRotating: false,
  //         }
  //         return newChatRecords
  //       })
  //     }, 10000) // 假设动画持续时间为3秒
  //   }
  // }

  // 处理点击"再试一次"的事件
  const handleTryAgainClick = (index: number) => {
    // 在这里执行你的操作
    const params = {
      inputContent: chartRecord[index - 1].content,
      sceneType: 'QA',
      sessionId: ''
    }
    postStreamData(params)
  }

  // 开场白
  const openingStatement = () => {
    return (
      <div className={classNames("opening-statement")}>
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

  // 常见问题
  // const qaCommon = () => {
  //   return (
  //     <div className={classNames("qa-common")}>
  //       <div className={classNames("description")}>
  //         <span className={classNames("description-left")}>
  //           <Image src={ImgQAIcon} alt="qa_icon" width={14} height={14}  />
  //           <span className={classNames("title")}>常见问题</span>
  //         </span>
  //         <span className={classNames("description-right")}>
  //           <Image
  //             src={ImgRefreshIcon}
  //             alt="refresh_icon"
  //             width={14}
  //             height={14}
  //             className={classNames({ 'rotate-animation': isRotating })}
  //           />
  //           <span className={classNames("refresh")} onClick={() => handleRefreshClick()}>换一批</span>
  //         </span>
  //       </div>
  //       <div className={classNames("list")}>
  //         {
  //           qaCommonList?.map((item) => {
  //             return (
  //               <Link className={classNames("item")} key={item.id} href={item.link} target="_blank">
  //                 <span className={classNames("item-content")}>
  //                   <div className={classNames("dot")}></div>
  //                   <div className={classNames("text")}>
  //                     {item.title}
  //                   </div>
  //                 </span>
  //                 <div className={classNames("item-link")}>
  //                   <Image src={ImgArrowIcon} alt="arrow_icon" width={12} height={12}  />
  //                 </div>
  //               </Link>
  //             )
  //           })
  //         }
  //       </div>
  //     </div>
  //   )
  // }

  // 文字loading
  const textLoading = () => {
      return (
        <div className={classNames("assistant")}>
          <div className={classNames("assistant-avatar")}>
            <Image src={ImgChatbot} alt="chatbot" width={20} height={19} />
          </div>
          <div className={classNames("assistant-content")}>
            <DotAnimation />
          </div>
        </div>
      )
  }

  // 文字loading - 停止输出
  const textLoadingStopOut = () => {
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

  // 图片loading
  const picLoading = () => {
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

  // // 跳转列表
  // const jumpList = (list: Array<any>) => {
  //   return (
  //     <div>
  //       <div className={classNames("assistant-content-list")}>
  //         {
  //           list.map((item:any) => {
  //             return (
  //               <Link 
  //                 className={classNames("assistant-item")} 
  //                 href={item.link}
  //                 key={item.id} 
  //                 target="_blank"
  //               >
  //                 <span className={classNames("assistant-item-title")}>
  //                   {item.title}
  //                 </span>
  //                 {
  //                   item?.linkIcon && (
  //                     <span className={classNames("assistant-item-link")}>
  //                       <Image src={ImgLinkIcon} alt="link_icon" width={12} height={12}  />
  //                     </span>
  //                   )
  //                 }
  //               </Link>
  //             )
  //           }
  //           )
  //         }
  //       </div>
  //     </div>
  //   )
  // }

  // // 查看详情跳转
  // const jumpDetail = (item: any) => {
  //   return (
  //     <div className={classNames("assistant-content-detail")}>
  //       <Link href={item.detailUrl} target="_blank">
  //         查看详情
  //       </Link>
  //       <span className={classNames("assistant-detail-link")}>
  //         <Image src={ImgLinkIcon} alt="link_icon" width={12} height={12}  />
  //       </span>
  //     </div>
  //   )
  // }

  // // 二级标题列表
  // const subTitleList = (list: Array<any>) => {
  //   return (
  //     <div className={classNames("assistant-content-list")}>
  //       {
  //         list.map((item:any) => {
  //           return (
  //             <div
  //               className={classNames("assistant-text-item")} 
  //               key={item.id} 
  //             >
  //               <span className={classNames(
  //                 {
  //                   "assistant-text-item-main": item.type === "sub",
  //                   "assistant-text-item-description": item.type !== "sub"
  //                 }
  //               )}>
  //                 {item.title}
  //               </span>
  //               <span className={classNames("assistant-text-item-description")}>
  //                 {item.description}
  //                 {item.textLoading && 
  //                   <span 
  //                     className={classNames("loading")}
  //                   >
  //                     <RedoOutlined className={classNames('rotate-animation-infinite')} />
  //                   </span>
  //                 }
  //               </span>
  //             </div>
  //           )
  //         }
  //         )
  //       }
  //     </div>
  //   )
  // }

  // const content = "报销流程的设计会因组织和行业的不同而有所差异，但通常会包括以下几个关键步骤：\n\n1. **申请报销**：员工提交详细的费用报告，包括日期、费用类型、金额、供应商信息以及相关凭证（如收据或发票的复印件）。\n\n2. **审批权限**：设置审批层级，可能包括直线经理的初步审批，财务部门的复核，以及在某些情况下，可能还需要更高层级的管理人员批准。\n\n3. **合规检查**：确保所有费用符合公司政策和法规要求，例如，是否超出预算是不是合理的且是否有适当的凭证支持。\n\n4. **支付处理**：一旦报销申请获得批准，财务部门将处理付款，这可能包括转账到员工的银行账户或者以现金形式发放。\n\n5. **记录和报告**：将报销信息录入会计系统，以便进行财务报告和税务报告。\n\n6. **审计跟踪**：保留报销单据和记录，以备后续审计或调查之需。\n\n每个公司的报销流程可能会根据其具体需求和规模有所不同，但以上步骤提供了一个通用框架。设计时应考虑流程的效率、控制和灵活性，确保既能防止欺诈又能满足不同角色和部门之间的有效沟通。"

  const rawContent = (content: string) => {
    // 替换换行符为 <br> 标签
    const contentWithBreaks = content.replace(/\n/g, '<br>');

    // 替换加粗标记为 <strong> 标签
    const contentWithStrong = contentWithBreaks.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    return contentWithStrong
  }

  // 聊天记录
  const chatRecord = () => {
    return (
      <div className={classNames("chat-record")}>
        {
          chartRecord?.map((item: any, index: number) => {
            return (
              <div className={classNames("record-item")} key={item.id}>
                {
                  item.role === "user" ? (
                    <div className={classNames("user")}>
                      <div className={classNames("user-content")}>
                        <span>{item.content}</span>
                        <div className={classNames("user-content-action")} onClick={() => handleCopy(item.content)}>
                          <Image src={ImgCopyAction} alt="复制" width={20} height={20} />
                          <span className={classNames("action-box-text")}>复制</span>
                        </div>
                      </div>
                      <div className={classNames("user-avatar")}>
                        <Avatar size={32} icon={<UserOutlined />} />
                      </div>
                    </div>
                  ) : item.type !== "stopOutput" && item.type !== "answerLoading" && item.type !== "picLoading" ?
                  (
                    <div>
                      <div className={classNames("assistant")}>
                          <div className={classNames("assistant-avatar")}>
                            <Image src={ImgChatbot} alt="chatbot" width={20} height={19} />
                          </div>                  
                          <div className={classNames("assistant-content")}>
                            { isLoading 
                              ? <span className={classNames("assistant-content-title")}>
                                <DotAnimation />
                              </span> 
                              : <div>
                                  <span className={classNames("assistant-content-title")}>
                                    <div dangerouslySetInnerHTML={{ __html: rawContent(item?.content) }}></div>
                                    {
                                      answerLoading && (
                                        <span 
                                          className={classNames("loading")}
                                        >
                                          <RedoOutlined className={classNames('rotate-animation-infinite')} />
                                        </span>
                                      )
                                    }
                                  </span>
                              </div>
                            }
                            {/* { item.list && item.list.length > 0 && (jumpList(item.list))}
                            { item.detailUrl && jumpDetail(item)}
                            { item.mainTitle && <div className={classNames("assistant-main-title")} >{item.mainTitle}</div>}
                            { item.textList && item.textList.length > 0 && subTitleList(item.textList) }
                            { item.detailTitle && <div className={classNames("assistant-detail-title")} >{item.detailTitle}</div>}
                            { item.detailDesc && <div className={classNames("assistant-detail-desc")} >{item.detailDesc}</div>} */}
                            <div className={classNames("assistant-content-action")}>
                              <span className={classNames("action-box")} onClick={() => handleCopy(item.content)}>
                                <Image src={ImgCopyAction} alt="复制" width={20} height={20} />
                                <span className={classNames("action-box-text")}>复制</span>
                              </span>
                              <span className={classNames("action-box")}>
                                <Image 
                                  src={ImgRefreshAction} 
                                  alt="再试一次" 
                                  width={20} 
                                  height={20}
                                  className={classNames({ 'rotate-animation': item.isRotating })}
                                />
                                <span 
                                  className={classNames("action-box-text")} 
                                  onClick={() => handleTryAgainClick(index)}
                                >再试一次</span>
                              </span>
                            </div>
                          </div>
                        </div>
                    </div>
                  ) : (
                    <div>
                    { item.type === "stopOutput" && textLoadingStopOut()}
                    { item.type === "answerLoading" && textLoading()}
                    { item.type === "picLoading" && picLoading()}
                    </div>
                  )
                }
              </div>
            )
          })
        }
        <div ref={messagesEndRef} /> {/* 放置在消息列表的最后 */}
      </div>
    )
  }

  useEffect(() => {
    console.log('chartRecord', chartRecord)
    scrollToBottom()
  }, [chartRecord]) // 监听 chartRecord 的变化

  const scrollToBottom = () => {
    // @ts-ignore
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    // @ts-ignore
    if (messages?.length > 0) {
      const newMessages:any = messages?.map((content, index) => {
        return {
          sessionId: Date.now() + index, // 使用当前时间戳加上索引来确保id的唯一性
          role: "user",
          content: content
        }
      }) || []
      // @ts-ignore
      setChartRecord(chartRecord.concat(newMessages))
      
      // 调用 postStreamData 并处理异步逻辑
      const params = {
          inputContent: messages?.pop(),
          sceneType: 'QA',
          sessionId: ''
        }
      postStreamData(params)
    }
  }, [messages, chartRecord])

  // stream-post
  const postStreamData = async (data:any) => {
    setIsLoading(true)
    let postUrl = ''

    const baseUrlLocal = 'http://81.69.218.11/data/test/stream-post'
    const baseUrlSit = 'http://172.253.168.62:8080/aiagent/api/data/chatbot/chat'
    const baseUrlUat = 'https://workflow-uat.newone.com.cn/aiagent/api/data/chatbot/chat '
    const sitUrl = 'http://172.253.168.62:8080'

    // // 获取当前页面的 URL
    const currentUrl = window.location.href

    // 判断当前 URL 是否包含特定的 URL 段
    if (currentUrl.includes(sitUrl)) {
      // 如果包含特定的 URL 段，则使用第二个 URL
      postUrl = baseUrlSit
    } else if(currentUrl.includes('uat')) {
      // 否则使用第一个 URL
      postUrl = baseUrlUat
    } else {
      postUrl = baseUrlLocal
    }

    const response:any = await fetch(postUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    // 获取 ReadableStream
    const reader = response.body.getReader()
    const decoder = new TextDecoder('utf-8')
    let done = false
    let buffer = ''

    // 逐块读取数据
    while (!done) {
      const { value, done: doneReading } = await reader.read()
      done = doneReading
      if (value) {
        // 解码二进制数据为字符串
        buffer += decoder.decode(value, { stream: !done })
        // 处理缓冲区中的数据
        processBuffer()
      }
    }

  // 处理缓冲区中的数据
  function processBuffer() {
    // 找到最后一个换行符
    const lastNewLineIndex = buffer.lastIndexOf('\n');
    if (lastNewLineIndex === -1) {
      // 如果没有换行符，缓冲区中的数据不完整，等待更多数据
      return;
    }

    // 获取完整的 JSON 对象
    const completeLines = buffer.slice(0, lastNewLineIndex);
    // 更新缓冲区，移除已处理的数据
    buffer = buffer.slice(lastNewLineIndex + 1);

    // 处理每一行数据
    completeLines.split('\n').forEach((line) => {
      if (line) {
        try {
          const lineObj = JSON.parse(line.split('data:')[1]);

          if (lineObj.done === true) {
            // 如果 done 为 true，表示所有数据已经接收完毕，我们可以关闭流
            setAnswerLoading(false);
          } else {
            setIsLoading(false);
            setAnswerLoading(true);
            setChartRecord((prevChartRecord:any) => {
              // 查找是否有匹配的 sessionId 来更新助手的回答
              const foundIndex = prevChartRecord.findIndex((item:any) => {
                if(item.sessionId === lineObj.sessionId) {
                  return item
                }
              });
              if (foundIndex !== -1) {
                // 如果找到匹配的 sessionId，更新助手的回答
                const updatedRecord = {
                  ...prevChartRecord[foundIndex],
                  sessionId: lineObj.sessionId, // 使用 sessionId 而不是 id
                  role: 'assistant',
                  isRotating: false,
                  content: lineObj.data?.answer,
                };
                const newChartRecord = [...prevChartRecord];
                newChartRecord[foundIndex] = updatedRecord;
                return newChartRecord;
              } else {
                // 如果没有找到匹配的 sessionId，添加新的记录
                const newRecord = {
                  sessionId: lineObj.sessionId, // 使用 sessionId 而不是 id
                  role: 'assistant',
                  content: lineObj.data?.answer,
                  isRotating: false,
                };
                return [...prevChartRecord, newRecord];
              }
            });
          }
        } catch (error) {
          console.error('Failed to process line:', error);
        }
      }
      });
    }
  }

  return (
    <main className={classNames("main")}>
      <div className={classNames("content")}>
        {openingStatement()}
        {/* {qaCommon()} */}
        {chatRecord()}
      </div>
    </main>
  )
}

export default Content