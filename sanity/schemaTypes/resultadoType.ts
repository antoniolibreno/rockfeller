import {defineField, defineType} from 'sanity'

export const resultadoType = defineType({
  name: 'resultado',
  title: 'Resultado',
  type: 'document',
  fields: [
    defineField({
      name: 'resultado',
      type: 'number',
    }),
  ],
})