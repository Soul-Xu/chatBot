// 聊天记录内容
export const conversationList = [
  {
    id: 1,
    role: "user",
    content: "下周二我要出差，需要申请相关的流程",
  },
  {
    id: 2,
    role: "assistant",
    content: "您好，如果您要出差的话，可以发起以下流程：",
    list: [
      {
        id: 21,
        title: "金科中心差旅申请",
        description: "金科中心差旅申请",
        link: "http://www.baidu.com",
        linkIcon: true
      },
      {
        id: 22,
        title: "营业部出差申请",
        description: "营业部出差申请",
        link: "http://www.baidu.com",
        linkIcon: true
      },
      {
        id: 23,
        title: "业务部门出差申请",
        description: "业务部门出差申请",
        link: "http://www.baidu.com",
        linkIcon: true
      }
    ]
  },
  {
    id: 3,
    role: "user",
    content: "我想查询最近一个月我提交的IT需求申请流程",
  },
  {
    id: 4,
    role: "assistant",
    content: "您好，按照您的要求查询出共有14条流程实例：",
    detailUrl: "http://www.baidu.com"
  },
  {
    id: 5,
    role: "user",
    content: "我想知道在流程过程中会有哪些操作",
  },
  {
    id: 6,
    role: "assistant",
    content: "在流程管理中，一个流程通常包含一系列的操作步骤，这些步骤是完成特定任务或目标所必需的。以下是一些常见的流程操作类型：",
    textList: [
      {
        id: 1,
        title: "1、输入：",
        description: "流程开始时接收数据或信息。",
      },
      {
        id: 62,
        title: "2、处理：",
        description: "对输入的数据进行分析、计算或转换。",
      },
      {
        id: 63,
        title: "3、决策：",
        description: "基于处理结果做出选择或判断，通常会导致流程的分支。",
      },
      {
        id: 64,
        title: "4、输出：",
        description: "向用户或系统提供结果或信息。",
      },
      {
        id: 65,
        title: "5、存储：",
        description: "向用户或系统提供结果或信息。",
      },
      {
        id: 66,
        title: "6、通信：",
        description: "与外部系统或用户进行信息交换。",
      },
      {
        id: 67,
        title: "7、控制：",
        description: "流程中的控制结构，如循环、条件判断等。",
      },
      {
        id: 68,
        title: "8、同步：",
        description: "确保流程中的不同部分在正确的时间点协调一致。",
      },
      {
        id: 69,
        title: "9、异步：",
        description: "允许流程的某些部分独立于其他部分运行。",
      },
      {
        id: 610,
        title: "10、错误处理：",
        description: "识别和响应",
      },
    ]
  },
  {
    id: 7,
    role: "user",
    content: "我想知道在流程过程中会有哪些操作",
  },
  {
    id: 8,
    role: "assistant",
    content: "在流程管理中，一个流程通常包含一系列的操作步骤，这些步骤是完成特定任务或目标所必需的。以下是一些常见的流程操作类型：",
    textList: [
      {
        id: 81,
        type: "sub",
        title: "1、输入：",
        description: "流程开始时接收数据或信息。",
      },
      {
        id: 82,
        type: "sub",
        title: "2、处理：",
        description: "对输入的数据进行分析、计算或转换。",
      },
      {
        id: 83,
        type: "sub",
        title: "3、决策：",
        description: "基于处理结果做出选择或判断，通常会导致流程的分支。",
      },
      {
        id: 84,
        type: "sub",
        title: "4、输出：",
        description: "向用户或系统提供结果或信息。",
      },
      {
        id: 85,
        type: "sub",
        title: "5、存储：",
        description: "向用户或系统提供结果或信息。",
      },
      {
        id: 86,
        type: "sub",
        title: "6、通信：",
        description: "与外部系统或用户进行信息交换。",
      },
      {
        id: 87,
        type: "sub",
        title: "7、控制：",
        description: "流程中的控制结构，如循环、条件判断等。",
      },
      {
        id: 88,
        type: "sub",
        title: "8、同步：",
        description: "确保流程中的不同部分在正确的时间点协调一致。",
      },
      {
        id: 89,
        type: "sub",
        title: "9、异步：",
        description: "允许流程的某些部分独立于其他部分运行。",
      },
      {
        id: 810,
        type: "sub",
        title: "10、错误处理：",
        description: "识别和响应",
      },
    ]
  },
  {
    id: 9,
    role: "user",
    content: "如果我申请常规出差的话，整体的审批环节是什么样的",
  },
  {
    id: 10,
    role: "assistant",
    type: "stopOutput",
  },
  {
    id: 11,
    role: "user",
    content: "我想知道在流程过程中会有哪些操作",
  },
  {
    id: 12,
    role: "assistant",
    content: "在流程管理中，一个流程通常包含一系列的操作步骤，这些步骤是完成特定任务或目标所必需的。以下是一些常见的流程操作类型：",
    mainTitle: "一、概况描述",
    detailTitle: "二、细节补充",
    detailDesc: "在这个例子中，用户通过前端界面与系统交互，前端界面通过API调用与后端服务通信，后端服务再与数据库交互来处理用户的请求，并将结果返回给前端界面展示给用户。",
    textList: [
      {
        id: 121,
        type: "sub",
        title: "1、输入：",
        description: "流程开始时接收数据或信息。",
      },
      {
        id: 122,
        type: "sub",
        title: "2、处理：",
        description: "对输入的数据进行分析、计算或转换。",
      },
      {
        id: 123,
        type: "sub",
        title: "3、决策：",
        description: "基于处理结果做出选择或判断，通常会导致流程的分支。",
      },
      {
        id: 124,
        type: "sub",
        title: "4、输出：",
        description: "向用户或系统提供结果或信息。",
      },
      {
        id: 125,
        type: "sub",
        title: "5、存储：",
        description: "向用户或系统提供结果或信息。",
      },
      {
        id: 126,
        type: "sub",
        title: "6、通信：",
        description: "与外部系统或用户进行信息交换。",
      },
      {
        id: 127,
        type: "sub",
        title: "7、控制：",
        description: "流程中的控制结构，如循环、条件判断等。",
      },
      {
        id: 128,
        type: "sub",
        title: "8、同步：",
        description: "确保流程中的不同部分在正确的时间点协调一致。",
      },
      {
        id: 129,
        type: "sub",
        title: "9、异步：",
        description: "允许流程的某些部分独立于其他部分运行。",
      },
      {
        id: 1210,
        type: "sub",
        title: "10、错误处理：",
        description: "识别和响应",
      },
    ]
  },
  {
    id: 13,
    role: "user",
    content: "如果我申请常规出差的话，整体的审批环节是什么样的",
  },
  {
    id: 14,
    role: "assistant",
    type: "answerLoading",
  },
  {
    id: 15,
    role: "user",
    content: "我想知道在流程过程中会有哪些操作",
  },
  {
    id: 16,
    role: "assistant",
    content: "在流程管理中，一个流程通常包含一系列的操作步骤，这些步骤是完成特定任务或目标所必需的。以下是一些常见的流程操作类型：",
    textList: [
      {
        id: 81,
        type: "sub",
        title: "1、输入：",
        description: "流程开始时接收数据或信息。",
      },
      {
        id: 82,
        type: "sub",
        title: "2、处理：",
        description: "对输入的数据进行分析、计算或转换。",
      },
      {
        id: 83,
        type: "sub",
        title: "3、决策：",
        description: "基于处理结果做出选择或判断，通常会导致流程的分支。",
      },
      {
        id: 84,
        type: "sub",
        title: "4、输出：",
        description: "向用户或系统提供结果或信息。",
      },
      {
        id: 85,
        type: "sub",
        title: "5、存储：",
        description: "向用户或系统提供结果或信息。",
      },
      {
        id: 86,
        type: "sub",
        title: "6、通信：",
        description: "与外部系统或用户进行信息交换。",
      },
      {
        id: 87,
        type: "sub",
        title: "7、控制：",
        description: "流程中的控制结构，如循环、条件判断等。",
      },
      {
        id: 88,
        type: "sub",
        title: "8、同步：",
        description: "确保流程中的不同部分在正确的时间点协调一致。",
      },
      {
        id: 89,
        type: "sub",
        title: "9、异步：",
        description: "允许流程的某些部分独立于其他部分运行。",
      },
      {
        id: 810,
        type: "sub",
        title: "10、错误处理：",
        textLoading: true,
        description: "识别和响应",
      },
    ]
  },
  {
    id: 17,
    role: "user",
    content: "如果我申请常规出差的话，整体的审批环节是什么样的",
  },
  {
    id: 18,
    role: "assistant",
    type: "picLoading",
  },
  {
    id: 19,
    role: "user",
    content: "我想知道在流程过程中会有哪些操作",
  },
  {
    id: 20,
    role: "assistant",
    content: "您好，根据您的描述，以下这些问题是否能帮到你：",
    list: [
      {
        id: 221,
        title: "在流程设计中，如何确定各个操作的优先级和顺序？",
        description: "在流程设计中，如何确定各个操作的优先级和顺序？",
        link: "http://www.baidu.com",
        linkIcon: false
      },
      {
        id: 222,
        title: "在流程设计中，如何平衡不同利益相关者的优先级需求？",
        description: "在流程设计中，如何平衡不同利益相关者的优先级需求？",
        link: "http://www.baidu.com",
        linkIcon: false
      },
    ]
  },
]

// 常见问题列表
export const qaCommonList = [
  {
    id: 1,
    title: "我要发起流程",
    description: "我要发起流程",
    link: "http://www.baidu.com"
  },
  {
    id: 2,
    title: "我要查询我近期的待办",
    description: "我要查询我近期的待办",
    link: "http://www.baidu.com"
  }
]

// {
//   id: 1730423311783,
//   content: '1111',
//   role: 'user',
// }