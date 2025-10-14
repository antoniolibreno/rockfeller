import {defineField, defineType} from 'sanity'

export const clienteType = defineType({
  name: 'clientes',
  title: 'Clientes',
  type: 'document',
  fields: [
    defineField({
      name: 'nome',
      type: 'string',
    }),
    defineField({
      name: 'sobrenome',
      type: 'string',
    }),
    defineField({
      name: 'idade',
      type: 'number',
    }),
  ],
})