// src/pages/api/generate-posters.js
import { createClient } from "@sanity/client";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import path from "path";
import os from "os";

const client = createClient({
  projectId: "icj9mmoe",
  dataset: "production",
  token: "skoCCay1DRff7upXsypy6fRcSbOw5xR0ZXXxqTA6x9fio5bCRuvpzHMQcTtvWwgYIYvmYyDxk8wVuJ3XxXP5F3LnW7o6VoZHkhmUHDFbQGd9xPAdfr5RQDEkyfhKiZpb4LY4aYQ1W6KzzBtxn17YXZecyLvrBaXU2zI46CF5SFb4MW60Vruy",
  apiVersion: "2025-11-01",
  useCdn: false,
});

async function createPoster(videoUrl, docId, arrayKey, fieldName) {
  const tempDir = os.tmpdir();
  const tempPoster = path.join(tempDir, `poster-${Date.now()}.jpg`);

  try {
    console.log(`Creating poster from: ${videoUrl}`);
    
    await new Promise((resolve, reject) => {
      ffmpeg(videoUrl)
        .screenshots({
          timestamps: ["00:00:01"],
          filename: path.basename(tempPoster),
          folder: path.dirname(tempPoster),
        })
        .on("end", resolve)
        .on("error", reject);
    });

    console.log(`Uploading poster to Sanity...`);
    const asset = await client.assets.upload("image", fs.createReadStream(tempPoster));
    
    // Clean up temp file
    fs.unlinkSync(tempPoster);

    const patchPath = `${fieldName}[_key == "${arrayKey}"].poster`;

    await client
      .patch(docId)
      .set({
        [patchPath]: {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: asset._id,
          },
        },
      })
      .commit();

    console.log(`✅ Poster created successfully`);
    return true;
  } catch (error) {
    console.error(`❌ Error creating poster:`, error.message);
    if (fs.existsSync(tempPoster)) {
      fs.unlinkSync(tempPoster);
    }
    throw error;
  }
}

function isVideoFile(url) {
  if (!url) return false;
  const videoExtensions = [".mp4", ".mov", ".avi", ".webm", ".mkv", ".m4v"];
  return videoExtensions.some((ext) => url.toLowerCase().endsWith(ext));
}

export async function POST({ request }) {
  console.log("\n🎬 Poster generation API called");
  
  try {
    const { documentId } = await request.json();

    if (!documentId) {
      return new Response(
        JSON.stringify({ error: "documentId is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log(`📄 Processing document: ${documentId}`);

    const query = `*[_id == $id][0]{
      _id,
      title,
      thumbnail[] {
        _key,
        _type,
        "assetUrl": asset->url,
        poster
      },
      gallery[] {
        _key,
        _type,
        "assetUrl": asset->url,
        poster
      }
    }`;

    const doc = await client.fetch(query, { id: documentId });

    if (!doc) {
      return new Response(
        JSON.stringify({ error: "Document not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    let processedCount = 0;
    const errors = [];

    // Process thumbnail
    if (Array.isArray(doc.thumbnail)) {
      for (const item of doc.thumbnail) {
        if (
          item._type === "video" &&
          item.assetUrl &&
          !item.poster &&
          isVideoFile(item.assetUrl)
        ) {
          try {
            console.log(`Processing thumbnail video...`);
            await createPoster(
              item.assetUrl,
              doc._id,
              item._key,
              "thumbnail"
            );
            processedCount++;
          } catch (error) {
            errors.push(`Thumbnail: ${error.message}`);
          }
        }
      }
    }

    // Process gallery
    if (Array.isArray(doc.gallery)) {
      for (const item of doc.gallery) {
        if (
          item._type === "video" &&
          item.assetUrl &&
          !item.poster &&
          isVideoFile(item.assetUrl)
        ) {
          try {
            console.log(`Processing gallery video...`);
            await createPoster(
              item.assetUrl,
              doc._id,
              item._key,
              "gallery"
            );
            processedCount++;
          } catch (error) {
            errors.push(`Gallery: ${error.message}`);
          }
        }
      }
    }

    if (processedCount === 0 && errors.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          count: 0,
          message: "No videos found that need posters",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    if (errors.length > 0) {
      console.error("Errors occurred:", errors);
      return new Response(
        JSON.stringify({
          success: processedCount > 0,
          count: processedCount,
          message: `Processed ${processedCount} video(s) with ${errors.length} error(s)`,
          errors: errors,
        }),
        { status: 207, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log(`✨ Successfully processed ${processedCount} video(s)\n`);

    return new Response(
      JSON.stringify({
        success: true,
        count: processedCount,
        message: `Successfully processed ${processedCount} video(s)`,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("❌ API Error:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}