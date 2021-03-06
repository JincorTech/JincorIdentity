import { RedisClient } from 'redis';
import * as redis from 'redis';
import { injectable } from 'inversify';
import 'reflect-metadata';

import config from '../config';
import { any } from 'joi';
import { rejects } from 'assert';

const { redis: { url, prefix } } = config;

export interface StorageService {
  client: RedisClient;
  flushdb: () => Promise<{}>;
  set: (key: string, value: string) => Promise<string>;
  get: (key: string) => Promise<string>;
  expire: (key: string, time: number) => Promise<any>;
  del: (key: string) => Promise<any>;
  keys: (key: string) => Promise<any>;
  mget: (keys: string[]) => Promise<any>;
  scan: (cursor: string, tenantId: string) => Promise<any>;
}

@injectable()
export class RedisService implements StorageService {
  client: RedisClient;

  constructor() {
    this.client = redis.createClient(url);
  }

  flushdb(): Promise<{}> {
    return new Promise((resolve, reject) => {
      this.client.flushdb((err, result) => err ? reject(err) : resolve());
    });
  }

  set(key: string, value: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.client.set(this.getKey(key), value, (err, result) => err ? reject(err) : resolve(result));
    });
  }

  get(key: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.client.get(this.getKey(key), (err, result) => err ? reject(err) : resolve(result));
    });
  }

  expire(key: string, time: number): Promise<number> {
    return new Promise((resolve, reject) => {
      this.client.expire(this.getKey(key), time, (err, result) => err ? reject(err) : resolve(result));
    });
  }

  del(key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.client.del(this.getKey(key), (err, result) => err ? reject(err) : resolve(result));
    });
  }

  getKey(key: string): string {
    return prefix + key;
  }

  keys(key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.client.keys(key, (err, result) => err ? reject(err) : resolve(result));
    });
  }

  mget(keys: string[]): Promise<any> {
    return new Promise(async(resolve, reject) => {
      this.client.mget(keys, (err, result) => err ? reject(err) : resolve(result));
    });
  }

  scan(cursor: string, pattern: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.client.scan([cursor, 'match', pattern, 'count', config.redis.pageLength], (err, result) => err ? reject(err) : resolve(result));
    });
  }
}

const StorageServiceType = Symbol('StorageService');
export { StorageServiceType };
