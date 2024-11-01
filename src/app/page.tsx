"use client"
import React, { useState, useEffect } from 'react'
import Header from './components/header'
import Content from './components/content'
import Footer from './components/footer'
import Error from 'next/error'
import classnames from "classnames/bind"
import styles from "./.index.module.scss"
const classNames = classnames.bind(styles)

// @ts-ignore
export default function Home(props) {
  const { errorCode } = props
  const [messages, setMessages] = useState<any>([])
  const addMessage = (message:any) => {
    setMessages([...messages, message])
  }

  if (errorCode) {
    return <Error statusCode={errorCode} />
  }

  return (
    <main className={classNames("main-container")}>
      <Header />
      <Content messages={messages} />
      <Footer onSendMessage={addMessage} />
    </main>
  )
}