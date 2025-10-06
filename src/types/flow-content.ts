// ============================================================================
// FLOW BLOG CONTENT TYPES
// ============================================================================
// TypeScript interfaces for blog-style flow content structures
// ============================================================================

export interface FlowSection {
  type: 'overview' | 'challenge' | 'solution' | 'how-it-works' | 'custom'
  title: string
  content: string // HTML or Markdown
  order?: number
}

export interface FlowUseCase {
  title: string
  description: string
  industry?: string
  scenario?: string
  results?: string
  metrics?: {
    label: string
    value: string
  }[]
}

export interface FlowImplementationStep {
  step: number
  title: string
  description: string
  duration?: string // e.g., "2 hours", "1 day"
  difficulty?: 'easy' | 'medium' | 'hard'
  code_example?: string
  tips?: string[]
}

export interface FlowBenefit {
  title: string
  description: string
  metric?: string // e.g., "80%", "$50k/year"
  icon?: string // Lucide icon name
  category?: 'efficiency' | 'cost' | 'quality' | 'scalability' | 'other'
}

export interface FlowFAQ {
  question: string
  answer: string
  category?: string
}

export interface FlowTOCItem {
  id: string
  title: string
  level: number // 1, 2, 3 for h1, h2, h3
  children?: FlowTOCItem[]
}

// Complete flow with all blog content
export interface FlowWithContent {
  // Basic fields
  id: string
  title: string
  description: string | null
  category: string
  categories: string[] | null
  complexity: 'beginner' | 'intermediate' | 'advanced'
  time_to_implement: string | null
  roi: string | null
  technologies: string[]
  flow_data: any | null
  featured_image: string | null
  status: 'draft' | 'published' | 'archived'
  author_id: string | null
  created_at: string
  updated_at: string
  
  // Blog content fields
  content: string | null
  sections: FlowSection[] | null
  use_cases: FlowUseCase[] | null
  implementation_steps: FlowImplementationStep[] | null
  benefits: FlowBenefit[] | null
  prerequisites: string[] | null
  faq: FlowFAQ[] | null
  related_flows: string[] | null
  reading_time: number | null
  meta_description: string | null
  meta_keywords: string[] | null
  excerpt: string | null
  table_of_contents: FlowTOCItem[] | null
  
  // Relations (if populated)
  profiles?: {
    full_name: string | null
    avatar_url: string | null
  }
}

// Form data for admin
export interface FlowContentFormData {
  content?: string
  sections?: FlowSection[]
  use_cases?: FlowUseCase[]
  implementation_steps?: FlowImplementationStep[]
  benefits?: FlowBenefit[]
  prerequisites?: string[]
  faq?: FlowFAQ[]
  related_flows?: string[]
  reading_time?: number
  meta_description?: string
  meta_keywords?: string[]
  excerpt?: string
}

// Helper type for creating new flows
export type CreateFlowInput = Omit<FlowWithContent, 'id' | 'created_at' | 'updated_at' | 'profiles'>

// Helper type for updating flows
export type UpdateFlowInput = Partial<CreateFlowInput>
