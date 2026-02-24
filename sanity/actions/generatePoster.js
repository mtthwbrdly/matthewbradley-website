// sanity/actions/generatePoster.js
import { defineAction } from 'sanity'

export default defineAction({
  name: 'generatePoster',
  title: 'Generate Video Posters',
  description: 'Automatically generate poster images from videos',
  onHandle: async ({ draft, published, documentId }) => {
    const doc = draft || published

    if (!doc) {
      throw new Error('Document not found')
    }

    // Show loading state
    const loadingToast = {
      status: 'info',
      title: 'Generating posters...',
      description: 'Please wait while we extract frames from your videos'
    }

    try {
      // Call your API endpoint
      const response = await fetch('/api/generate-posters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          documentId: doc._id,
          documentType: doc._type 
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate posters')
      }

      // Success!
      return {
        status: 'success',
        title: 'Posters Generated!',
        description: `Successfully processed ${result.count} video(s)`
      }
    } catch (error) {
      return {
        status: 'error',
        title: 'Error generating posters',
        description: error.message
      }
    }
  }
})