import { config } from 'dotenv'
import {z} from 'zod'

if(process.env.NODE_ENV === 'test'){
  config({path: '.env.test', override: true})
}else{
  config()
}

console.log("ambiente",process.env.NODE_ENV)

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  DATABASE_CLIENT: z.enum(['sqlite', 'pg']),
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().default(3333)
})

//export const env = envSchema.parse(process.env)

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error('Invalid environment variables!', _env.error.format())

  throw new Error('Invalid environment variables.')
}

export const env = _env.data


