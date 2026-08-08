import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'

export default {
  groups: [
    {
      name: 'overview',
      title: 'Overview',
      default: true,
    },
    {
      name: 'media',
      title: 'Media',
    },
  ],
  name: 'work',
  title: 'Work',
  type: 'document',
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({type: 'work'}),
    {name: 'title', title: 'Title', type: 'string', group: 'overview'},
    {name: 'client', title: 'Client', type: 'string', group: 'overview'},
    {name: 'year', title: 'Year', type: 'number', group: 'overview'},
    {
      name: 'clickable',
      title: 'Click Through',
      type: 'boolean',
      initialValue: true,
      description: 'If disabled, this work will appear in the grid but won\'t open an overlay when clicked.',
      group: 'overview',
    },
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
      group: 'overview',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [
        {
          type: 'block'
        }
      ],
      group: 'overview',
    },
    {name: 'pullquote', title: 'Pull Quote', type: 'text', group: 'overview'},
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
      group: 'overview',
    },
    {
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [
        // keep backward-compatible direct media entries so existing docs keep working
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
                  {title: 'Contained', value: 'contained'},
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
                media,
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
              media: 'poster',
            },
            prepare({title, media}) {
              return {
                title: title || 'No caption',
                media,
              }
            },
          },
        },
        {
          type: 'object',
          name: 'gallerySlide',
          title: 'Layout',
          fields: [
            {
              name: 'items',
              title: 'Items',
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
                        media,
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
                      media: 'poster',
                    },
                    prepare({title, media}) {
                      return {
                        title: title || 'No caption',
                        media,
                      }
                    },
                  },
                },
              ],
              options: {layout: 'grid'},
            },
            {
              name: 'layout',
              title: 'Slide Layout',
              type: 'string',
              options: {
                list: [
                  {title: 'Two-up', value: 'two-up'},
                  {title: 'Grid', value: 'grid'},
                ],
                layout: 'radio',
              },
              initialValue: 'single',
            },
          ],
          preview: {
            select: {
              title: 'items.0.caption',
              media: 'items.0.asset',
            },
            prepare(selection) {
              const {title, media} = selection
              return {
                title: title || 'Layout',
                media,
              }
            },
          },
        },
      ],
      options: {layout: 'grid'},
      group: 'media',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      group: 'overview',
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
