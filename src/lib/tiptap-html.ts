/**
 * Converts TipTap/ProseMirror JSON (stored in posts.content) to HTML for display.
 * Used on the blog post detail page where we render with dangerouslySetInnerHTML.
 * Supports: paragraphs, headings, lists, blockquotes, horizontal rules, bold, italic.
 */

/** Inline formatting mark (bold, italic, etc.) on a text node. */
type TiptapMark = { type: string }

/** A node in the TipTap document tree (block or inline). */
export type TiptapNode = {
  type: string
  attrs?: { level?: number }
  content?: TiptapNode[]
  text?: string
  marks?: TiptapMark[]
}

/** Root document shape saved by the write editor via editor.getJSON(). */
export type TiptapDocument = {
  type?: string
  content?: TiptapNode[]
}

/**
 * Maps a full TipTap document to an HTML string.
 * Returns empty string if content is missing or invalid.
 */
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

/** Extracts plain text from a node and wraps bold/italic marks in HTML tags. */
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
