import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Matthew Bradley Website',

  projectId: 'icj9mmoe',
  dataset: 'production',

  basePath: "/studio",


  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
