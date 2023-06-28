export interface MessageMQ {
  source: string
  appId: string
  channel: string
  site: string
  ruleId: string
  messages: Message[]
}

export interface Message {
  id: string
  timestamp: number
  encoding: string
  data: string
  name: string
}

export interface Data {
  serverId: string,
  commandId: number
}
