export const MONGODB_URI =
    process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/train'

export const COOKIE_SECRET =
    process.env.COOKIE_SECRET ??
    'une-cle-secrete-pour-la-session-de-32-caracteres-minimum'

export const MINUTE = 60_000 // 60 secondes dans une minutes

export const SESSION_TIMEOUT_MS = 3 * MINUTE

export const DEV = true
