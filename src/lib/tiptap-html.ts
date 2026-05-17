type TiptapMark = { type: string }

export type TiptapNode = {
  type: string
  attrs?: { level?: number }
  content?: TiptapNode[]
  text?: string
  marks?: TiptapMark[]
}

export type TiptapDocument = {
  type?: string
  content?: TiptapNode[]
}

export function tiptapJsonToHtml(json: TiptapDocument | null | undefined): string {
  if (!json?.content) return ''

  return json.content
    .map((node) => {
      switch (node.type) {
        case 'paragraph':
          return `<p>${nodeText(node)}</p>`
        case 'heading': {
          const level = node.attrs?.level ?? 2
          return `<h${level}>${nodeText(node)}</h${level}>`
        }
        case 'bulletList':
          return `<ul>${(node.content ?? [])
            .map((li) => `<li>${nodeText(li.content?.[0])}</li>`)
            .join('')}</ul>`
        case 'orderedList':
          return `<ol>${(node.content ?? [])
            .map((li) => `<li>${nodeText(li.content?.[0])}</li>`)
            .join('')}</ol>`
        case 'blockquote':
          return `<blockquote>${nodeText(node.content?.[0])}</blockquote>`
        case 'horizontalRule':
          return '<hr />'
        default:
          return ''
      }
    })
    .join('')
}

function nodeText(node: TiptapNode | undefined): string {
  if (!node?.content) return ''
  return node.content
    .map((n) => {
      let text = n.text ?? ''
      if (n.marks) {
        for (const mark of n.marks) {
          if (mark.type === 'bold') text = `<strong>${text}</strong>`
          if (mark.type === 'italic') text = `<em>${text}</em>`
        }
      }
      return text
    })
    .join('')
}
