import {defineField, defineType} from 'sanity'

export const alunoType = defineType({
  name: 'aluno',
  title: 'Aluno',
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