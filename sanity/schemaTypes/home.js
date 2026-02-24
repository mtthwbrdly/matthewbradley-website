export default {
  name: 'home',
  title: 'Home',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string' },
    {
      name: 'category',
      title: 'Category',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Identity', value: 'identity' },
          { title: 'Website', value: 'website' },
          { title: 'Book', value: 'book' },
          { title: 'Other Graphic Solutions', value: 'other' },
        ],
        layout: 'checkbox',
      },
    },
    {
      name: 'thumbnail',
      title: 'Thumbnail',
      type: 'array',
      of: [
        {
          type: 'image',
          title: 'Image',
          options: { hotspot: true },
          fields: [
            { name: 'caption', type: 'string', title: 'Caption' },
            { name: 'alt', type: 'string', title: 'Alt Text' },
          ],
        },
        {
          type: 'file',
          name: 'video',
          title: 'Video',
          options: { accept: 'video/*' },
          fields: [
            { name: 'caption', type: 'string', title: 'Caption' },
            { name: 'alt', type: 'string', title: 'Alt Text' },
            {
              name: 'displayMode',
              title: 'Display Mode',
              type: 'string',
              options: {
                list: [
                  { title: 'Fullscreen', value: 'fullscreen' },
                  { title: 'Inset (Contained)', value: 'inset' },
                ],
                layout: 'radio',
              },
              initialValue: 'fullscreen',
            },
          ],
        },
      ],
      validation: (Rule) => Rule.max(1),
      options: { layout: 'grid' },
    },

  ],
    preview: {
    select: {
      title: 'title',
      media: 'thumbnail.0.asset',
    },
    prepare({title, media}) {
      return {
        title: title || 'Untitled Work',
        media,
      }
    },
  },
};