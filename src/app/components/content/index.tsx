"use client"
import React, { useEffect, useState, useRef, useCallback } from "react"
import Image from "next/image"
import ImgChatbot from "@/public/images/chatbot.png"
import ImgCopyAction from "@/public/images/copy_action.png"
import ImgRefreshAction from "@/public/images/refresh_action.png"
import OpeningState from "./components/openingState"
import DotAnimation from "./components/dotAnimation"
import TextLoading from "./components/textLoading"
import JumpList from "./components/jumpList"
import JumpDetail from "./components/jumpDetail"
import copy from 'copy-to-clipboard'
import { message,  Avatar } from "antd"
import { useDispatch, useSelector } from 'react-redux';
import { pushChat } from '@/lib/features/slices/agentSlice'
import { UserOutlined, RedoOutlined } from '@ant-design/icons'
import classnames from "classnames/bind"
import styles from "./index.module.scss"
const classNames = classnames.bind(styles)
import { baseURL } from "@/lib/constants"
import dayjs from 'dayjs'
interface Props {
  children?: React.ReactNode
  messages?: any[]
}

const Content = (props: Props) => {
  const { messages } = props
  const dispatch = useDispatch();
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

  const renderAnswer = (content: any) => {
    if (typeof content === 'object') {
      // 如果是 React 元素，直接返回它，以便在 JSX 中渲染
      return <div>{content}</div>
    }
    if (typeof content === 'string') {
      // 如果 content 是字符串，进行字符串处理
      if (content.includes('\n')) {
        // 替换换行符为 <br> 标签
        const contentWithBreaks = content.replace(/\n/g, '<br>');
        // 替换加粗标记为 <strong> 标签
        const contentWithStrong = contentWithBreaks.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        return <div dangerouslySetInnerHTML={{ __html: contentWithStrong }}></div>;
      } else {
        return <div>{content}</div>;
      }
    }
  }

  // stream-post
  const postStreamData = async (data:any) => {
    let postUrl = ''

    // 1.0接口请求逻辑
    const baseUrlLocal = `${baseURL}/chatBot/qa`
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
                const len = prevChartRecord.length
                if (prevChartRecord.length === 0) {
                  return prevChartRecord
                }
                if (prevChartRecord.length === 1) {
                  return prevChartRecord
                }
                if (prevChartRecord.length > 1) {
                  const questionObj = prevChartRecord[len - 2]
                  const answerObj = prevChartRecord[len - 1]
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
                }
              });
              // 如果 done 为 true，表示所有数据已经接收完毕，我们可以关闭流
            } else {
              if (lineObj.intent === 'tl_launch') {
                setChartRecord((prevChartRecord:any) => {
                  // 获取倒数第二个元素作为question的值
                  const questionContent = prevChartRecord[prevChartRecord.length - 2]?.content || '';

                  if (lineObj.data.length > 0) {
                    const updatedRecords = [
                      ...prevChartRecord.slice(0, -1), // 获取除了最后一个元素之外的所有元素
                      {
                        id: lineObj.id,
                        sessionId: lineObj.sessionId,
                        userCode: 'chenhaiyong',
                        question: questionContent, // 使用倒数第二个元素的内容
                        createTime: lineObj.createTime,
                        role: 'assistant',
                        intent: lineObj.intent,
                        data: lineObj.data,
                        content: <JumpList messageTip={questionContent} listData={lineObj.data} />,
                        isRotating: false,
                      },
                    ];
                    return updatedRecords;
                  } else if (Array.isArray(lineObj.data) && lineObj.data.length === 0){
                    // 创建一个新数组，其中最后一个元素被新的对象替换
                    const updatedRecords = [
                      ...prevChartRecord.slice(0, -1), // 获取除了最后一个元素之外的所有元素
                      {
                        id: lineObj.id,
                        sessionId: lineObj.sessionId,
                        userCode: 'chenhaiyong',
                        question: questionContent, // 使用倒数第二个元素的内容
                        createTime: lineObj.createTime,
                        role: 'assistant',
                        intent: lineObj.intent,
                        data: lineObj.data,
                        content: '您输入的流程名称在流程库中不存在，请确认输入的流程名称。',
                        isRotating: false,
                      },
                    ];
                    return updatedRecords;
                  } else if (!Array.isArray(lineObj.data) && lineObj.data === '') {
                    // 创建一个新数组，其中最后一个元素被新的对象替换
                    const updatedRecords = [
                      ...prevChartRecord.slice(0, -1), // 获取除了最后一个元素之外的所有元素
                      {
                        id: lineObj.id,
                        sessionId: lineObj.sessionId,
                        userCode: 'chenhaiyong',
                        question: questionContent, // 使用倒数第二个元素的内容
                        createTime: lineObj.createTime,
                        role: 'assistant',
                        intent: lineObj.intent,
                        data: lineObj.data,
                        content: '服务已断开，请刷新后重试。',
                        isRotating: false,
                      },
                    ];
                    return updatedRecords;
                  }
                });
              }
              if (lineObj.intent === 'tl_generate') {
                setChartRecord((prevChartRecord:any) => {
                  // 检查数组是否至少有一个元素
                  if (prevChartRecord.length > 0) {
                    // 获取最后一个元素
                    const lastRecord = prevChartRecord[prevChartRecord.length - 1];
                    // 更新最后一个元素的内容，假设最后一个元素是 loading 状态
                    const updatedRecord = {
                      ...lastRecord,
                      id: lineObj.id,
                      createTime: lineObj.createTime,
                      userCode: 'chenhaiyong',
                      role: 'assistant',
                      intent: lineObj.intent,
                      data: lineObj.data,
                      isLoading: false,
                      isRotating: false, // 假设 isRotating 表示 loading 状态
                      content: lineObj.data?.answer, // 替换为实际的回答内容
                    };
                    // 创建一个新数组，其中最后一个元素被更新后的记录替换
                    const renderRecord = [
                      ...prevChartRecord.slice(0, -1), // 获取除了最后一个元素之外的所有元素
                      updatedRecord, // 添加更新后的最后一个元素
                    ];
                    return renderRecord
                  } else {
                    // 如果 prevChartRecord 为空，则添加一个新的记录
                    const newRecord = {
                      id: lineObj.id,
                      userCode: 'chenhaiyong',
                      createTime: lineObj.createTime,
                      role: 'assistant',
                      intent: lineObj.intent,
                      data: lineObj.data,
                      content: lineObj.data?.answer, // 这里应该是实际的回答内容
                      isRotating: false, // 不需要 loading 状态
                    };
                    return [newRecord];
                  }
                });
              }
              // 检查intent是否为'tl_query'
              if (lineObj.intent === 'tl_query') {
                setChartRecord((prevChartRecord: any) => {
                  // 获取倒数第二个元素作为question的值
                  const questionContent = prevChartRecord[prevChartRecord.length - 2]?.content || '';

                  // 创建一个新数组，其中添加了新的对象
                  const updatedRecords = [
                    ...prevChartRecord.slice(0, -1), // 包含之前所有元素
                    {
                      id: lineObj.id,
                      sessionId: lineObj.sessionId,
                      userCode: 'chenhaiyong',
                      question: questionContent, // 使用倒数第二个元素的内容
                      createTime: lineObj.createTime,
                      role: 'assistant',
                      intent: lineObj.intent,
                      data: lineObj.data,
                      // @ts-ignore
                      content: <JumpDetail item={lineObj.data} />,
                      isLoading: false,
                      isRotating: false,
                    },
                  ];

                  return updatedRecords;
                });
              }
              // 检查intent是否为'intent'
              if (lineObj.intent === 'intent') {    
                if (!Array.isArray(lineObj.data) && lineObj.data === '') {
                  setChartRecord((prevChartRecord:any) => {
                    // 获取倒数第二个元素作为question的值
                    const questionContent = prevChartRecord[prevChartRecord.length - 2]?.content || '';
                     // 创建一个新数组，其中最后一个元素被新的对象替换
                    const updatedRecords = [
                      ...prevChartRecord.slice(0, -1), // 获取除了最后一个元素之外的所有元素
                      {
                        id: lineObj.id,
                        sessionId: lineObj.sessionId,
                        userCode: 'chenhaiyong',
                        question: questionContent, // 使用倒数第二个元素的内容
                        createTime: lineObj.createTime,
                        role: 'assistant',
                        intent: lineObj.intent,
                        data: lineObj.data,
                        content: '服务已断开，请刷新后重试。',
                        isRotating: false,
                      },
                    ];
                    return updatedRecords;
                  })
                }                      
              }
            }
          } catch (error) {
            console.error('Failed to process line:', error);
          }
        }
      });
    }
  }

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
                  ) : (
                    <div className={classNames("assistant")}>
                      <div className={classNames("assistant-avatar")}>
                        <Image src={ImgChatbot} alt="chatbot" width={20} height={19} />
                      </div>
                      <div className={classNames("assistant-content")}>
                        {
                          item.isLoading ? (
                            <span className={classNames("assistant-content-title")}>
                              <DotAnimation />
                            </span>
                          ) : (
                            <div>
                              <span className={classNames("assistant-content-title")}>
                                {renderAnswer(item?.content)}
                                {
                                  item.isRotating && (
                                    <span className={classNames("loading")}>
                                      <RedoOutlined className={classNames('rotate-animation-infinite')} />
                                    </span>
                                  )
                                }
                              </span>
                            </div>
                          )
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
                  )
                }
              </div>
            );
          })
        }
        <div ref={messagesEndRef} /> {/* 放置在消息列表的最后 */}
      </div>
    );
  };

  const scrollToBottom = () => {
    // @ts-ignore
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // 调整后的 useEffect，用于处理新的消息
  useEffect(() => {
    if (messages && messages?.length > 0) {
      const newMessage = messages[messages.length - 1];
      // 添加新消息到 chartRecord，但不改变之前的 loading 状态
      setChartRecord((prevChartRecord:any) => [
        ...prevChartRecord,
        {
          sessionId: Date.now(), // 使用时间戳作为 sessionId
          role: "user",
          content: newMessage,
        },
        {
          sessionId: Date.now(), // 使用时间戳作为 sessionId
          role: "assistant",
          content: <TextLoading />, // 显示加载组件
          isLoading: true, // 添加一个 isLoading 标志
        },
      ]);

      // 调用 postStreamData 并处理异步逻辑
      const params = {
        inputContent: newMessage,
        sessionId: Date.now().toString(), // 使用时间戳作为 sessionId
      };
      // 模拟异步请求后端数据
      postStreamData(params);
    }
  }, [messages]); // 依赖项仅包含 messages

  useEffect(() => {
    scrollToBottom()
  }, [chartRecord]) // 监听 chartRecord 的变化

  return (
    <main className={classNames("main")}>
      <div className={classNames("content")}>
        <OpeningState />
        {chatRecord()}
      </div>
    </main>
  )
}

export default Content