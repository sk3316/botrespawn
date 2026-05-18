export interface TiptapMark {
  type: string
  attrs?: Record<string, string>
}

export interface TiptapNode {
  type: string
  attrs?: Record<string, unknown>
  content?: TiptapNode[]
  marks?: TiptapMark[]
  text?: string
}

export interface TiptapDocument {
  type: 'doc'
  content: TiptapNode[]
}

export function tiptapJsonToHtml(doc: TiptapDocument | null): string {
  if (!doc || !doc.content) return ''
  return doc.content.map(renderNode).join('')
}

function renderNode(node: TiptapNode): string {
  switch (node.type) {
    case 'paragraph':
      return `<p>${renderChildren(node)}</p>`
    case 'heading':
      return `<h${node.attrs?.level}>${renderChildren(node)}</h${node.attrs?.level}>`
    case 'bulletList':
      return `<ul>${renderChildren(node)}</ul>`
    case 'orderedList':
      return `<ol>${renderChildren(node)}</ol>`
    case 'listItem':
      return `<li>${renderChildren(node)}</li>`
    case 'blockquote':
      return `<blockquote>${renderChildren(node)}</blockquote>`
    case 'horizontalRule':
      return `<hr />`
    case 'hardBreak':
      return `<br />`
    case 'image':
      return `<img src="${node.attrs?.src}" alt="${node.attrs?.alt ?? ''}" style="width:100%;border-radius:12px;margin:12px 0" />`
    case 'video':
      return `<video controls src="${node.attrs?.src}" style="width:100%;border-radius:12px;margin:12px 0"></video>`
    case 'youtube': {
      const src = node.attrs?.src as string ?? ''
      const ytMatch = src.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)
      const embedId = ytMatch?.[1] ?? src
      const embedUrl = embedId.includes('youtube.com/embed')
        ? embedId
        : `https://www.youtube.com/embed/${embedId}`
      return `<div style="position:relative;padding-bottom:56.25%;height:0;margin:16px 0">
        <iframe src="${embedUrl}" style="position:absolute;top:0;left:0;width:100%;height:100%;border-radius:12px;border:none" allowfullscreen></iframe>
      </div>`
    }
    case 'text':
      return renderText(node)
    default:
      return renderChildren(node)
  }
}

function renderChildren(node: TiptapNode): string {
  return node.content?.map(renderNode).join('') ?? ''
}

function renderText(node: TiptapNode): string {
  let text = node.text ?? ''
  if (node.marks) {
    node.marks.forEach((mark) => {
      if (mark.type === 'bold') text = `<strong>${text}</strong>`
      if (mark.type === 'italic') text = `<em>${text}</em>`
      if (mark.type === 'code') text = `<code>${text}</code>`
      if (mark.type === 'link') text = `<a href="${mark.attrs?.href}" target="_blank">${text}</a>`
    })
  }
  return text
}