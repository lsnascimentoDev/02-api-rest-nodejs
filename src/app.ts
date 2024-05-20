import fastify from "fastify";
import  cookie from '@fastify/cookie'
import { transactionsRoutes } from "./routes/transactions";

export const app = fastify();

app.register(cookie)

// Registrando o plugin, que nada mais é um trecho de código, nesse caso uma rota em outro arquivo. 
// Plugins no fastify são funções adicionais que fornecem recursos ao framework.
//Os plugins podem ser usados para adicionar funcionalidades como autenticação, log, validação de dados, gerenciamento de erros, entre outras. A aula vai te ensinar a criar e utilizar um plugin de rotas.
app.register(transactionsRoutes, {
  prefix: "transactions"
})