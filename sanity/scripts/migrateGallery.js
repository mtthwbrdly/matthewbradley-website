// Migration script: convert existing gallery items into gallerySlide objects
// Usage: set SANITY_TOKEN env var and run from the repo root:
// cd sanity && node scripts/migrateGallery.js

const {createClient} = require('@sanity/client')

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || '', // optional: set or leave blank to use config
  dataset: process.env.SANITY_DATASET || 'production',
  token: process.env.SANITY_TOKEN,
  useCdn: false,
})

async function run() {
  if (!process.env.SANITY_TOKEN) {
    console.error('Please set SANITY_TOKEN environment variable with a write token.')
    process.exit(1)
  }

  // fetch all work docs that have gallery defined
  const docs = await client.fetch('*[_type == "work" && defined(gallery)]{_id, gallery}')
  console.log(`Found ${docs.length} documents with gallery`)

  for (const doc of docs) {
    const { _id, gallery } = doc
    // normalize each entry: if it's already a gallerySlide object (has items), keep it
    // otherwise wrap it into a gallerySlide with items array
    const normalized = (gallery || []).map((entry) => {
      if (entry && entry._type === 'gallerySlide') return entry
      return {
        _type: 'gallerySlide',
        items: [entry],
      }
    })

    // only patch when change needed
    const needsChange = JSON.stringify(normalized) !== JSON.stringify(gallery)
    if (needsChange) {
      try {
        await client
          .patch(_id)
          .set({ gallery: normalized })
          .commit({ autoGenerateArrayKeys: true })
        console.log(`Patched ${_id}`)
      } catch (err) {
        console.error(`Failed to patch ${_id}:`, err.message)
      }
    }
  }

  console.log('Migration complete')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
