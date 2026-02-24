export default {
  name: 'work',
  title: 'Work',
  type: 'document',
  fields: [
    {name: 'title', title: 'Title', type: 'string'},
    {name: 'client', title: 'Client', type: 'string'},
    {name: 'year', title: 'Year', type: 'number'},
    {name: 'featured', title: 'Featured (for One Project page)', type: 'boolean', initialValue: false},
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
  name: 'description',
  title: 'Description',
  type: 'array',
  of: [
    {
      type: 'block'
    }
  ]
},
    {name: 'pullquote', title: 'Pull Quote', type: 'text'},
    {
      name: 'thumbnail',
      title: 'Thumbnail',
      type: 'array',
      of: [
        {
          type: 'image',
          title: 'Image',
          options: {hotspot: true},
          fields: [
            {name: 'caption', type: 'string', title: 'Caption'},
            {name: 'alt', type: 'string', title: 'Alt Text'},
          ],
          preview: {
            select: {
              title: 'caption',
              media: 'asset',
            },
            prepare({title, media}) {
              return {
                title: title || 'No caption',
                media: media,
              }
            },
          },
        },
        {
          type: 'file',
          name: 'video',
          title: 'Video',
          options: {accept: 'video/*'},
          fields: [
            {name: 'caption', type: 'string', title: 'Caption'},
            {name: 'alt', type: 'string', title: 'Alt Text'},
            {
              name: 'displayMode',
              title: 'Display Mode',
              type: 'string',
              options: {
                list: [
                  {title: 'Fullscreen', value: 'fullscreen'},
                  {title: 'Inset (Contained)', value: 'inset'},
                ],
                layout: 'radio',
              },
              initialValue: 'fullscreen',
            },
            {
              name: 'poster',
              title: 'Poster (Generated Automatically)',
              type: 'image',
              readOnly: true,
            },
          ],
          preview: {
            select: {
              title: 'caption',
              media: 'poster', // use the poster image as preview if available
            },
            prepare({title, media}) {
              return {
                title: title || 'No caption',
                media: media || {_type: 'image', asset: {_ref: ''}}, // fallback
              }
            },
          },
        },
      ],
      validation: (Rule) => Rule.max(1),
      options: {layout: 'grid'},
    },
    {
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [
        {
          type: 'image',
          title: 'Image',
          options: {hotspot: true},
          fields: [
            {name: 'caption', type: 'string', title: 'Caption'},
            {name: 'alt', type: 'string', title: 'Alt Text'},
            {
              name: 'displayMode',
              title: 'Display Mode',
              type: 'string',
              options: {
                list: [
                  {title: 'Fullscreen', value: 'fullscreen'},
                  {title: 'Inset', value: 'inset'},
                ],
                layout: 'radio',
              },
              initialValue: 'fullscreen',
            },
            {
              name: 'poster',
              title: 'Poster (Generated Automatically)',
              type: 'image',
              readOnly: true,
            },
          ],
          preview: {
            select: {
              title: 'caption',
              media: 'asset',
            },
            prepare({title, media}) {
              return {
                title: title || 'No caption',
                media: media,
              }
            },
          },
        },
        {
          type: 'file',
          name: 'video',
          title: 'Video',
          options: {accept: 'video/*'},
          fields: [
            {name: 'caption', type: 'string', title: 'Caption'},
            {name: 'alt', type: 'string', title: 'Alt Text'},
            {
              name: 'displayMode',
              title: 'Display Mode',
              type: 'string',
              options: {
                list: [
                  {title: 'Fullscreen', value: 'fullscreen'},
                  {title: 'Inset (Contained)', value: 'inset'},
                ],
                layout: 'radio',
              },
              initialValue: 'fullscreen',
            },
            {
              name: 'poster',
              title: 'Poster (Generated Automatically)',
              type: 'image',
              readOnly: true,
            },
          ],
          preview: {
            select: {
              title: 'caption',
              poster: 'poster.asset',
              file: 'asset',
            },
            prepare({title, poster, file}) {
              return {
                title: title || (file ? file.originalFilename : 'Video'),
                media: poster
                  ? {_type: 'image', asset: poster}
                  : {
                      _type: 'image',
                      asset: {
                        _ref: 'image-placeholder-icon', // invisible fallback
                      },
                    },
              }
            },
          },
        },
      ],
      options: {layout: 'grid'},
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
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
}
