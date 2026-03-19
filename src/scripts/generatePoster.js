import { createClient } from "@sanity/client";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const client = createClient({
  projectId: "icj9mmoe",
  dataset: "production",
  token: "skoCCay1DRff7upXsypy6fRcSbOw5xR0ZXXxqTA6x9fio5bCRuvpzHMQcTtvWwgYIYvmYyDxk8wVuJ3XxXP5F3LnW7o6VoZHkhmUHDFbQGd9xPAdfr5RQDEkyfhKiZpb4LY4aYQ1W6KzzBtxn17YXZecyLvrBaXU2zI46CF5SFb4MW60Vruy",
  apiVersion: "2025-11-01",
  useCdn: false,
});

async function createPoster(videoUrl, docId, arrayKey, fieldName) {
  const tempPoster = path.resolve(__dirname, `./poster-${Date.now()}.jpg`);

  try {
    console.log(`  📸 Extracting frame from: ${videoUrl}`);
    
    await new Promise((resolve, reject) => {
      ffmpeg(videoUrl)
        .screenshots({
          timestamps: ["00:00:05"],
          filename: path.basename(tempPoster),
          folder: path.dirname(tempPoster),
        })
        .on("end", resolve)
        .on("error", reject);
    });

    console.log(`  ⬆️  Uploading poster to Sanity...`);
    const asset = await client.assets.upload("image", fs.createReadStream(tempPoster));
    fs.unlinkSync(tempPoster);

    const patchPath = `${fieldName}[_key == "${arrayKey}"].poster`;

    await client
      .patch(docId)
      .set({ 
        [patchPath]: { 
          _type: "image", 
          asset: { 
            _type: "reference", 
            _ref: asset._id 
          } 
        } 
      })
      .commit();

    console.log(`✅ Poster created and linked: ${patchPath}\n`);
  } catch (error) {
    console.error(`❌ Error:`, error.message);
    if (fs.existsSync(tempPoster)) {
      fs.unlinkSync(tempPoster);
    }
  }
}

function isVideoFile(url) {
  if (!url) return false;
  const videoExtensions = ['.mp4', '.mov', '.avi', '.webm', '.mkv', '.m4v'];
  return videoExtensions.some(ext => url.toLowerCase().endsWith(ext));
}

(async () => {
  try {
    console.log("🔍 Searching for videos without posters in 'work' and 'home' documents...\n");

    // Query both 'work' and 'home' documents
    const workQuery = `*[_type == "work"]{
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

    const homeQuery = `*[_type == "home"]{
      _id,
      title,
      thumbnail[] {
        _key,
        _type,
        "assetUrl": asset->url,
        poster
      }
    }`;

    const [workDocs, homeDocs] = await Promise.all([
      client.fetch(workQuery),
      client.fetch(homeQuery)
    ]);

    let processedCount = 0;

    // Process work documents
    if (workDocs.length > 0) {
      console.log(`📄 Found ${workDocs.length} work documents\n`);
      for (const doc of workDocs) {
        // Process thumbnail
        if (Array.isArray(doc.thumbnail)) {
          for (const item of doc.thumbnail) {
            if (
              item._type === "video" &&
              item.assetUrl &&
              !item.poster &&
              isVideoFile(item.assetUrl)
            ) {
              console.log(`🎬 Processing: "${doc.title}" - Thumbnail Video`);
              await createPoster(item.assetUrl, doc._id, item._key, "thumbnail");
              processedCount++;
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
              console.log(`🎬 Processing: "${doc.title}" - Gallery Video`);
              await createPoster(item.assetUrl, doc._id, item._key, "gallery");
              processedCount++;
            }
          }
        }
      }
    } else {
      console.log("❌ No work documents found.\n");
    }

    // Process home documents
    if (homeDocs.length > 0) {
      console.log(`📄 Found ${homeDocs.length} home documents\n`);
      for (const doc of homeDocs) {
        if (Array.isArray(doc.thumbnail)) {
          for (const item of doc.thumbnail) {
            if (
              item._type === "video" &&
              item.assetUrl &&
              !item.poster &&
              isVideoFile(item.assetUrl)
            ) {
              console.log(`🎬 Processing: "${doc.title}" (home) - Thumbnail Video`);
              await createPoster(item.assetUrl, doc._id, item._key, "thumbnail");
              processedCount++;
            }
          }
        }
      }
    } else {
      console.log("❌ No home documents found.\n");
    }

    console.log(`\n✨ Done! Processed ${processedCount} video(s).`);
    if (processedCount === 0) {
      console.log("💡 All videos already have posters, or no videos found.");
    }
  } catch (err) {
    console.error("❌ Error:", err);
  }
})();