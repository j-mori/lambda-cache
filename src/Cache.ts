import * as fs from 'fs'

interface ICacheItem<T> {
  value: T
  expiresAt: number
}

export class Cache {
  private readonly cache: { [key: string]: ICacheItem<unknown> } = {}
  private readonly basePath: string

  constructor(basePath = '/tmp/cache') {
    this.basePath = this.removeTrailingSlash(basePath)
    fs.mkdir(basePath, { recursive: true }, (err) => {
      if (err) throw err
    })
  }

  public set(key: string, value: unknown, expiresInSeconds = 0): void {
    const expiresAt = expiresInSeconds ? this.expiresIn(expiresInSeconds) : 0
    this.cache[key] = { value, expiresAt }
    this.writeToFile(key, { value, expiresAt })
  }

  public get<T>(key: string): T | undefined {
    const item = this.cache[key] || this.readFromFile<T>(key)
    if (!item) return undefined
    if (this.hasExpired(item.expiresAt)) {
      this.delete(key)
      return undefined
    }
    return item.value as T
  }

  public delete(key: string): void {
    delete this.cache[key]
    this.unlinkFile(key)
  }

  public clear(): void {
    for (const key of Object.keys(this.cache)) {
      this.delete(key)
    }
  }

  private hasExpired(timestamp: number): boolean {
    return !!(timestamp && timestamp < Date.now())
  }

  private expiresIn(seconds: number): number {
    return Date.now() + seconds * 1000
  }

  private writeToFile(key: string, value: ICacheItem<unknown>): void {
    fs.writeFileSync(
      `${this.basePath}/${key}.json`,
      JSON.stringify(value),
      'utf8'
    )
  }

  private readFromFile<T>(key: string): ICacheItem<T> | undefined {
    try {
      const data = fs.readFileSync(`${this.basePath}/${key}.json`, 'utf8')
      return JSON.parse(data)
    } catch (error) {
      return
    }
  }

  private unlinkFile(key: string): void {
    fs.unlinkSync(`${this.basePath}/${key}.json`)
  }

  private removeTrailingSlash(str: string): string {
    if (str.endsWith('/')) {
      return str.slice(0, -1)
    }
    return str
  }
}
