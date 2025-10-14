import {defineField, defineType} from 'sanity'

export const cursoType = defineType({
  name: 'cursos',
  title: 'Cursos',
  type: 'document',
  fields: [
    defineField({
      name: 'nome',
      type: 'string',
    }),
    defineField({
      name: 'nivel',
      type: 'number',
    }),
  ],
})