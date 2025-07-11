import dotenv from "dotenv"

dotenv.config()

import jwt from "jsonwebtoken"

const anonKey = jwt.sign(
    {
        "x-triplit-token-type": "anon"
    },
    process.env.BETTER_AUTH_SECRET!,
    { algorithm: "HS256" }
)

const serviceKey = jwt.sign(
    {
        "x-triplit-token-type": "secret"
    },
    process.env.BETTER_AUTH_SECRET!,
    { algorithm: "HS256" }
)

console.log({
    anonKey,
    serviceKey
})
