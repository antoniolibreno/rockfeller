import {defineField, defineType} from 'sanity'

export const feedbacksType = defineType({
  name: 'feedbacks',
  title: 'Feedbacks',
  type: 'document',
  fields: [
    defineField({
      name: 'Feedback',
      type: 'string',
    }),
    defineField({
      name: 'nota',
      type: 'number',
    }),
  ],
})