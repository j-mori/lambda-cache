# lambda-cache

A simple, fast, cheap, lightweight dependency-less and cross execution cache system for AWS Lambda functions, based on writing to files in the ["/tmp" folder](https://aws.amazon.com/it/blogs/aws/aws-lambda-now-supports-up-to-10-gb-ephemeral-storage/). It allows you to set a time-to-live (TTL) for cache keys and invalidate the cache.

## Installation

You can install the package via npm:
```bash
npm install @j-mori/lambda-cache
```

## Usage

```typescript
import { Cache } from 'lambda-cache';

// Create a new cache with the default base path /tmp/cache
const cache = new Cache();

// Set a value
cache.set('key', 'value', 10);  // expires in 10 seconds

// Get a value
console.log(cache.get('key'));

// Delete a value
cache.delete('key');

// Clear all values
cache.clear();

```

## API

### `new Cache(path?: string)`

Creates a new cache instance that stores the data in the specified path.

- `path` (optional): the path where the cache files will be stored.
### `cache.set(key: string, value: any, ttl?: number)`

Stores a value in the cache.

- `key`: the key used to store and retrieve the value.
- `value`: the value to store.
- `ttl` (optional): the time to live for this cache entry in seconds. If not provided, the key won't expire.

### `cache.get(key: string)`

Retrieves a value from the cache.

- `key`: the key used to store the value.

Returns the stored value or `undefined` if the key does not exist or the value has expired.

### `cache.delete(key: string)`

Deletes a value from the cache.

- `key`: the key used to store the value.

### `cache.clear()`

Clears all the values from the cache.
