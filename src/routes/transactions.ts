import { FastifyInstance } from "fastify"
import { knex } from "../database"
import { randomUUID } from "crypto"
import { z } from "zod"
import { checkSessionIdExists } from "../middlewares/check-session-id-exists"
//Cookies - É forma de coletar dados e comportamento do usuario, muitas vezes salvando um id na maquina/navegador para identificar esse usuário. Os cookies são usados pelos sites para melhorar sua experiência de navegação.
// Quando criar a transação, será anotado um session_id no cookies do novegador, quando usuário for listar alguma transação, vamos validar apenas transações daquele mesmo session_id.

/*
Uma breve explicação:

Testes unitários são testes que validam o comportamento de uma única unidade de código, como uma função ou método. Eles são úteis para garantir que cada parte da aplicação esteja funcionando corretamente, sem depender de outras partes.

Testes de integração são testes que validam a integração entre várias partes da aplicação, como a integração entre a camada de banco de dados e a camada de serviço. Eles são importantes para garantir que a aplicação esteja funcionando corretamente como um todo.

Testes e2e (end-to-end) são testes que validam o comportamento da aplicação como um todo, simulando a interação do usuário com a aplicação. Eles são importantes para garantir que a aplicação esteja funcionando corretamente em todos os níveis, desde a camada de interface até a camada de banco de dados.

A pirâmide de testes é uma estratégia que se baseia em ter mais testes unitários e menos testes de integração e e2e, pois testes unitários são mais rápidos e fáceis de escrever e manter do que outros tipos de testes.
*/
export async function transactionsRoutes(app: FastifyInstance) {

  app.get('/', { preHandler: [checkSessionIdExists] }, async (request, replay) => {

    const { sessionId } = request.cookies

    const transactions = await knex('transactions').where('session_id', sessionId).select("*")

    return {
      transactions,
    }
  })


  app.get('/:id',  { preHandler: [checkSessionIdExists] }, async (request) => {
    const getTransactionParamsSchema = z.object({
      id: z.string().uuid(),
    })
    
    const { id } = getTransactionParamsSchema.parse(request.params)

    const { sessionId } = request.cookies

    const transaction = await knex('transactions')
    .where({
     session_id: sessionId,
     id
    }).first()

    return {
      transaction
    }
  })

  app.get('/summary', { preHandler: [checkSessionIdExists] }, async (request) => {

    const { sessionId } = request.cookies

    const summary = await knex('transactions')
     .where('session_id', sessionId)
     .sum('amount', { as: 'amount' })
     .first()

    return { summary }
  })


  app.post('/', async (request, replay) => {

    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit'])
    })
    const { title, amount, type } = createTransactionBodySchema.parse(request.body)

    let sessionId = request.cookies.sessionId // Verificando se já existe sessionId no navegador

    if (!sessionId) {
      sessionId = randomUUID()

      // Aqui ele cria o sessionId no navegador
      replay.cookie('sessionId', sessionId, {
        path: '/', // Qual rota porerá acessar o cookie
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
    }

    await knex('transactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
      session_id: sessionId
    })


    return replay.status(201).send()

  })
}