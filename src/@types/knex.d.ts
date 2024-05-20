// eslint-disable-next-line
import { Knex } from 'knex'
// ou faça apenas:
// import 'knex'

//Esta aula ensinará como integrar o Knex com o TypeScript para ter suporte ao autocomplete de tabelas. Isso significa que, ao digitar o nome de uma tabela, o TypeScript será capaz de sugerir automaticamente as colunas existentes e as tipagens de dados corretas.
declare module 'knex/types/tables' {
  export interface Tables {
    transactions: {
      id: string
      title: string
      amount: number
      created_at: string
      session_id?: string
    }
  }
}