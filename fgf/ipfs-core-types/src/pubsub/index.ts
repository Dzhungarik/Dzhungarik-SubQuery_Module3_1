import type { AbortOptions } from '../utils'

export interface API<OptionExtension = {}> {
  /**
   * Subscribe to a pubsub topic
   *
   * @example
   * ```js
   * const topic = 'fruit-of-the-day'
   * const receiveMsg = (msg) => console.log(msg.data.toString())
   *
   * await ipfs.pubsub.subscribe(topic, receiveMsg)
   * console.log(`subscribed to ${topic}`)
   * ```
   */
  subscribe: (topic: string, handler: MessageHandlerFn, options?: SubscribeOptions & OptionExtension) => Promise<void>

  /**
   * Unsubscribes from a pubsub topic
   *
   * @example
   * ```js
   * const topic = 'fruit-of-the-day'
   * const receiveMsg = (msg) => console.log(msg.toString())
   *
   * await ipfs.pubsub.subscribe(topic, receiveMsg)
   * console.log(`subscribed to ${topic}`)
   *
   * await ipfs.pubsub.unsubscribe(topic, receiveMsg)
   * console.log(`unsubscribed from ${topic}`)
   *
   * // Or removing all listeners:
   *
   * const topic = 'fruit-of-the-day'
   * const receiveMsg = (msg) => console.log(msg.toString())
   * await ipfs.pubsub.subscribe(topic, receiveMsg);
   * // Will unsubscribe ALL handlers for the given topic
   * await ipfs.pubsub.unsubscribe(topic);
   * ```
   */
  unsubscribe: (topic: string, handler?: MessageHandlerFn, options?: AbortOptions & OptionExtension) => Promise<void>

  /**
   * Publish a data message to a pubsub topic
   *
   * @example
   * ```js
   * const topic = 'fruit-of-the-day'
   * const msg = new TextEncoder().encode('banana')
   *
   * await ipfs.pubsub.publish(topic, msg)
   * // msg was broadcasted
   * console.log(`published to ${topic}`)
   * ```
   */
  publish: (topic: string, data: Uint8Array, options?: AbortOptions & OptionExtension) => Promise<void>

  /**
   * Returns the list of subscriptions the peer is subscribed to
   */
  ls: (options?: AbortOptions & OptionExtension) => Promise<string[]>

  /**
   * Returns the peers that are subscribed to one topic.
   *
   * @example
   * ```js
   * const topic = 'fruit-of-the-day'
   *
   * const peerIds = await ipfs.pubsub.peers(topic)
   * console.log(peerIds)
   * ```
   */
  peers: (topic: string, options?: AbortOptions & OptionExtension) => Promise<string[]>

  setMaxListeners?: (max: number) => void
}

export interface Message {
  from: string
  seqno: Uint8Array
  data: Uint8Array
  topicIDs: string[]
}

export interface SubscribeOptions extends AbortOptions {
  /**
   * A callback to receive an error if one occurs during processing
   * subscription messages. Only supported by ipfs-http-client.
   */
  onError?: (err: Error) => void
}

export interface MessageHandlerFn { (message: Message): void }
