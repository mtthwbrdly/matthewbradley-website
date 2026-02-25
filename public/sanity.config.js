import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemaTypes";

export default defineConfig({
  name: "default",
  title: "Matthew Bradley Website",

  projectId: "icj9mmoe",
  dataset: "production",
  apiVersion: "2025-01-01",

  basePath: "/studio",

  plugins: [
    structureTool(),
    process.env.NODE_ENV === "development" && visionTool(),
  ].filter(Boolean),

  schema: {
    types: schemaTypes,
  },
});