"use client"
import React, { useState, useEffect } from 'react'
import Header from './components/header'
import Content from './components/content'
import Footer from './components/footer'
import Error from 'next/error'

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
    <main className="flex min-h-screen flex-col items-center" style={{ borderRadius: '12px' }}>
      <div className="z-10 items-center justify-between">
        <Header />
        <Content messages={messages} />
        <Footer onSendMessage={addMessage} />
      </div>
    </main>
  )
}