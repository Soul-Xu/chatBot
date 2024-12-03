"use client"
import React, { useEffect, useState, useRef } from "react"
import Image from "next/image"
import ImgChatbot from "@/public/images/chatbot.png"
import ImgCopyAction from "@/public/images/copy_action.png"
import ImgRefreshAction from "@/public/images/refresh_action.png"
import DotAnimation from "./components/dotAnimation"
import TextLoading from "./components/textLoading"
import TextLoadingStopOut from "./components/stopOut"
import PicLoading from "./components/picLoading"
import JumpList from "./components/jumpList"
import JumpDetail from "./components/jumpDetail"
import copy from 'copy-to-clipboard'
import { message,  Avatar } from "antd"
import { useDispatch, useSelector } from 'react-redux';
import { getChatResponse, pushChat } from '@/lib/features/slices/agentSlice'
import { UserOutlined, RedoOutlined } from '@ant-design/icons'
import classnames from "classnames/bind"
import styles from "./index.module.scss"
const classNames = classnames.bind(styles)
import dayjs from 'dayjs'
interface Props {
  children?: React.ReactNode
  messages?: any[]
}

const Content = (props: Props) => {
  const { messages } = props
  const dispatch = useDispatch();
  const chatResponse = useSelector((state: any) => state.chat);
  // 当前场景
  const [currentScene, setCurrentScene] = useState('tl_generate')
  // 添加一个loading控制答案的输出状态
  const [isLoading, setIsLoading] = useState(false)
  // 添加一个answerLoading控制答案输入中还未完成的输出状态
  const [answerLoading, setAnswerLoading] = useState(false)
  // 修改 chatRecord 状态，为每个记录添加一个旋转状态
  const [chartRecord, setChartRecord] = useState<any>([])
  const messagesEndRef = useRef(null) // 添加一个引用

  // 处理复杂功能
  const handleCopy = (text: string) => {
    copy(text)
    message.success('复制成功')
  }

  // 处理点击"再试一次"的事件
  const handleTryAgainClick = (item: any) => {
    console.log("handleTryAgainClick", item)
    // 在这里执行你的操作
    const params = {
      inputContent: item.question,
      sessionId: item.sessionId
    }
    postStreamData(params)
  }

  // // 处理点击"再试一次"的事件
  // const handleTryAgainClick = (item: any) => {
  //   console.log("handleTryAgainClick", item);
  //   // 在这里执行你的操作
  //   const params = {
  //     inputContent: item.question,
  //     sessionId: item.sessionId
  //   };
  //   // 找到对应记录的索引
  //   const recordIndex = chartRecord.findIndex((record: any) => record.sessionId === item.sessionId);
  //   if (recordIndex !== -1) {
  //     // 更新对应记录的状态，以便重新渲染
  //     setChartRecord((prevChartRecord: any) => {
  //       const newChartRecord = [...prevChartRecord];
  //       // 设置旋转状态，表示正在重新请求
  //       newChartRecord[recordIndex] = {
  //         ...newChartRecord[recordIndex],
  //         isRotating: true
  //       };
  //       return newChartRecord;
  //     });
  //     // 调用 postStreamData 并处理异步逻辑
  //     postStreamData(params).then(() => {
  //       // 请求完成后，清除旋转状态
  //       setChartRecord((prevChartRecord: any) => {
  //         const newChartRecord = [...prevChartRecord];
  //         newChartRecord[recordIndex] = {
  //           ...newChartRecord[recordIndex],
  //           isRotating: false
  //         };
  //         return newChartRecord;
  //       });
  //     });
  //   }
  // };

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

  const rawContent = (content: any) => {
    // 检查 content 是否为字符串
    if (typeof content !== 'string') {
      return ''; // 或者返回 null，或者根据你的需求返回合适的默认值
    }

    // 替换换行符为 <br> 标签
    const contentWithBreaks = content.replace(/\n/g, '<br>');
    // 替换加粗标记为 <strong> 标签
    const contentWithStrong = contentWithBreaks.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    return contentWithStrong;
  }

    // 给父级页面发送信息
  // 假设在AI聊天机器人的某个函数中，比如处理完聊天消息后
  const sendChatMessageToParent = (message:any) => {
    console.log('给父级页面发送信息', message)

    // const parentOrigin = window.parent.location.origin
    const destUrl = 'http://172.253.168.62:8080/cms-center/desktop/#/processEntrust/view'

    // 发送消息给父页面
    window.parent.postMessage({
      type: 'CHAT_MESSAGE',
      content: message
    }, destUrl) // 替换为父页面的实际源
  }

  // stream-post
  const postStreamData = async (data:any) => {
    setIsLoading(true)
    let postUrl = ''

    // 1.0接口请求逻辑
    const baseUrlLocal = 'http://81.69.218.11:9140/data/chatBot/qa'
    const baseUrlSit = 'http://172.253.168.62:8080/aiagent/api/data/chatbot/chat'
    const baseUrlUat = 'https://workflow-uat.newone.com.cn/aiagent/api/data/chatbot/chat '
    const sitUrl = 'http://172.253.168.62:8080'

    // 获取当前页面的 URL
    const currentUrl = window.location.href

    // 获取当前时间 - push时使用
    const nowTime = dayjs().format('YYYY-MM-DD HH:mm:ss')

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

    // 流式输出逻辑
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
              // 使用回调函数确保状态更新完成
              setChartRecord((prevChartRecord:any) => {
                const questionObj = prevChartRecord[0]
                const answerObj = prevChartRecord[1]
                const params = {
                  id: answerObj.id,
                  sessionId: answerObj.sessionId,
                  userCode: 'chenhaiyong',
                  question: questionObj.content,
                  answer: JSON.stringify(answerObj.data),
                  createTime: nowTime,
                  intent: answerObj.intent,
                }
                // @ts-ignore
                dispatch(pushChat(params))
                // 这里是更新状态的逻辑
                return prevChartRecord; // 假设这里没有修改，只是返回当前状态
              });
              // 如果 done 为 true，表示所有数据已经接收完毕，我们可以关闭流
              setAnswerLoading(false);
            } else {
              setIsLoading(false);
              setAnswerLoading(true);
              // 检查intent是否为'tl_launch'
              if (lineObj.intent === 'tl_launch') {
                setCurrentScene('tl_launch')
                // 更新chartRecord，将JumpList组件作为内容的一部分
                setChartRecord((prevChartRecord:any) => [
                  ...prevChartRecord,
                  {
                    id: lineObj.id,
                    sessionId: lineObj.sessionId,
                    userCode: 'chenhaiyong',
                    question: prevChartRecord[0].content,
                    createTime: lineObj.createTime,
                    role: 'assistant',
                    intent: lineObj.intent,
                    data: lineObj.data,
                    // @ts-ignore
                    content: <JumpList messageTip={prevChartRecord[0].content} listData={lineObj.data} />,
                    isRotating: false,
                  },
                ]);
              }
              // 检查intent是否为'tl_generate'
              if (lineObj.intent === 'tl_generate') {
                setCurrentScene('tl_generate')
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
                      id: lineObj.id,
                      sessionId: lineObj.sessionId,
                      userCode: 'chenhaiyong',
                      createTime: lineObj.createTime,
                      role: 'assistant',
                      intent: lineObj.intent,
                      data: lineObj.data,
                      content: lineObj.data?.answer,
                      isRotating: false,
                    };
                    return [...prevChartRecord, newRecord];
                  }
                });
              }
              // 检查intent是否为''
              if (lineObj.intent === 'tl_query') {
                console.log('tl_query', lineObj.data)
                setCurrentScene('tl_query')
                // 更新chartRecord，将JumpList组件作为内容的一部分
                setChartRecord((prevChartRecord:any) => [
                  ...prevChartRecord,
                  {
                    id: lineObj.id,
                    sessionId: lineObj.sessionId,
                    userCode: 'chenhaiyong',
                    question: prevChartRecord[0].content,
                    createTime: lineObj.createTime,
                    role: 'assistant',
                    intent: lineObj.intent,
                    data: lineObj.data,
                    // @ts-ignore
                    content: <JumpDetail item={lineObj.data} />,
                    isRotating: false,
                  },
                ]);
              }
            }
          } catch (error) {
            console.error('Failed to process line:', error);
          }
        }
      });
    }
  }

  // 聊天记录
  const chatRecord = () => {
    return (
      <div className={classNames("chat-record")}>
        {
          chartRecord?.map((item: any, index: number) => {
            const key = item.id ? item.id : `record-${index}`;
            return (
              <div className={classNames("record-item")} key={key}>
                {
                  item.role === "user" ? (
                    <div className={classNames("user")}>
                      <div className={classNames("user-content")}>
                        <span>{item?.content}</span>
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
                                    { currentScene === 'tl_generate' && <div dangerouslySetInnerHTML={{ __html: rawContent(item?.content) }}></div>}
                                    { currentScene === 'tl_launch' && <div>{item?.content}</div>}   
                                    { currentScene === 'tl_query' && <div>{item?.content}</div>}  
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
                                  onClick={() => handleTryAgainClick(item)}
                                >再试一次</span>
                              </span>
                            </div>
                          </div>
                        </div>
                    </div>
                  ) : (
                    <div>
                    { item.type === "stopOutput" && <TextLoadingStopOut />}
                    { item.type === "answerLoading" && <TextLoading />}
                    { item.type === "picLoading" && <PicLoading />}
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
      setIsLoading(true)
      // 调用 postStreamData 并处理异步逻辑
      const params = {
          inputContent: messages?.pop(),
          sessionId: ''
        }
      postStreamData(params)
    }
  }, [messages])

  useEffect(() => {
    scrollToBottom()
  }, [chartRecord]) // 监听 chartRecord 的变化

  return (
    <main className={classNames("main")}>
      <div className={classNames("content")}>
        {openingStatement()}
        {chatRecord()}
      </div>
    </main>
  )
}

export default Content