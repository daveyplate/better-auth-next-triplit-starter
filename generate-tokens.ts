import dotenv from "dotenv"

dotenv.config()

import jwt from "jsonwebtoken"

const secret = process.env.BETTER_AUTH_SECRET!

const anonKey = jwt.sign({ "x-triplit-token-type": "anon" }, secret, {
    algorithm: "HS256"
})
const serviceKey = jwt.sign({ "x-triplit-token-type": "secret" }, secret, {
    algorithm: "HS256"
})

console.log("ANON_KEY:", anonKey)
console.log("SERVICE_KEY:", serviceKey)
