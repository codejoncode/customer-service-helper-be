export interface KnowledgeBaseEntry {
  reason: string
  required: string[]       // statements that must be read
  template: string         // call-log template
  url: string              // link for deeper reference
  fullArticle: string      // expanded content
}