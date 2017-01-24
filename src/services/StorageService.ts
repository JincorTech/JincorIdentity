import { RedisClient } from 'redis'
import * as redis from 'redis'
import * as Bluebird from 'bluebird'

import config from '../config'

const {redis: {port, host}} = config


export interface StorageService {
  client: RedisClient
  set: (key: string, value: string) => Promise<string>
  get: (key: string) => Promise<string>
  expire: (key: string, time: number) => Promise<any>
  del: (key: string) => Promise<any>
}

class RedisService implements StorageService {
  client: RedisClient

  constructor(client: RedisClient) {
    this.client = client
  }

  set(key: string, value: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.client.set(key, value, (err, result) => err ? reject(err) : resolve(result))
    })
  }

  get(key: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, result) => err ? reject(err) : resolve(result))
    })
  }

  expire(key: string, time: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.client.expire(key, time, (err, result) => err ? reject(err) : resolve(result))
    })
  }

  del(key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.client.del(key, (err, result) => err ? reject(err) : resolve(result))
    })
  }
}

export default new RedisService(redis.createClient(port, host))
