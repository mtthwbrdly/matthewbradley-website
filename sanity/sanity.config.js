import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemaTypes";
import {media} from 'sanity-plugin-media'
import {BulkDelete} from 'sanity-plugin-bulk-delete'
import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'


export default defineConfig({
  name: "default",
  title: "Matthew Bradley Website",

  projectId: "icj9mmoe",
  dataset: "production",
  apiVersion: "2025-01-01",

  basePath: "/studio",

  plugins: [
    media(),
    structureTool({
      structure: (S, context) => {
        return S.list()
          .title('Content')
          .items([
            orderableDocumentListDeskItem({type: 'work', title: 'Work', S, context}),
            ...S.documentTypeListItems().filter(
              (listItem) => !['work'].includes(listItem.getId())
            ),
          ])
      },
    }),
    BulkDelete({ schemaTypes }),
    process.env.NODE_ENV === "development" && visionTool(),
  ].filter(Boolean),

  schema: {
    types: schemaTypes,
  },
});