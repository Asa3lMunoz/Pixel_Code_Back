import { Elysia } from 'elysia'
import * as functions from 'firebase-functions'

const app = new Elysia()
  .get('/', () => '¡Hola desde Elysia en Firebase!')
  .get('/ping', () => 'pong')
  .onError(({ code }) => {
    console.error(`Error: ${code}`)
    return `Error: ${code}`
  })

// Adaptador para Firebase Functions
export const api = functions.https.onRequest(async (req, res) => {
  const response = await app.fetch(req)

  res.status(response.status)
  response.headers.forEach((value, key) => res.setHeader(key, value))
  
  const body = await response.text()
  res.send(body)
})