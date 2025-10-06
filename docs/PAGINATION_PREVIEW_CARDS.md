# Enhanced Pagination with Preview Cards

## 🎨 **Improved Navigation Design**

### **Before:**
Simple text-based pagination with small icons
```
← Previous Flow | [Grid Icon] | Next Flow →
```

### **After:**
Rich preview cards with images and content
```
┌─────────────────────────┬─────────────────────────┐
│  [Featured Image]       │  [Featured Image]       │
│  ← Previous             │  Next →                 │
│  Category | Complexity  │  Category | Complexity  │
│  Flow Title             │  Flow Title             │
│  Description preview    │  Description preview    │
└─────────────────────────┴─────────────────────────┘
         [View All Flows Button]
```

## 📐 **Card Structure**

### **Each Preview Card Contains:**

1. **Featured Image** (h-48)
   - Full-width hero image
   - Hover zoom effect (scale-105)
   - Gradient overlay for text readability
   - Direction badge (Previous/Next)

2. **Category & Complexity Badge**
   - Primary category badge
   - Complexity indicator with icon

3. **Flow Title**
   - Large, bold heading
   - Hover effect (changes to primary color)
   - Line clamp (max 2 lines)

4. **Description Preview**
   - Excerpt or description
   - Line clamp (max 2 lines)
   - Body color text

## 🎯 **Visual Features**

### **Image Section:**
```tsx
<div className="relative h-48 w-full overflow-hidden">
  <Image 
    src={flow.featured_image}
    fill
    className="object-cover transition-transform duration-300 group-hover:scale-105"
  />
  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
  <div className="absolute bottom-3 left-3">
    <span className="bg-white/90 px-3 py-1">
      ← Previous / Next →
    </span>
  </div>
</div>
```

### **Content Section:**
```tsx
<div className="p-5">
  {/* Badges */}
  <div className="flex items-center gap-2">
    <span className="bg-primary/10 text-primary">Category</span>
    <span className="text-xs">⚡ Complexity</span>
  </div>
  
  {/* Title */}
  <h4 className="text-lg font-bold line-clamp-2">Title</h4>
  
  {/* Description */}
  <p className="text-sm line-clamp-2">Description</p>
</div>
```

## ✨ **Interactive Effects**

### **Hover States:**
- ✅ **Border color**: Changes to primary color
- ✅ **Shadow**: Adds shadow-lg for depth
- ✅ **Image zoom**: Scales to 105%
- ✅ **Title color**: Changes to primary
- ✅ **Smooth transitions**: All effects are smooth

### **Responsive Design:**
```tsx
// Desktop: 2 columns
<div className="grid gap-6 sm:grid-cols-2">

// Mobile: 1 column (stacks vertically)
```

## 🎨 **Design Details**

### **Direction Badges:**

**Previous Flow:**
```tsx
<span className="absolute bottom-3 left-3">
  <ArrowRight className="rotate-180" />
  Previous
</span>
```

**Next Flow:**
```tsx
<span className="absolute bottom-3 right-3">
  Next
  <ArrowRight />
</span>
```

### **Gradient Overlay:**
```tsx
// Makes text readable on images
<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
```

### **Badge Styling:**
```tsx
// Category badge
className="bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"

// Complexity indicator
className="flex items-center gap-1 text-xs text-body-color"
```

## 📊 **Layout Structure**

### **Complete Navigation Section:**
```
Continue Exploring
├── Grid (2 columns on desktop, 1 on mobile)
│   ├── Previous Flow Card
│   │   ├── Featured Image (h-48)
│   │   │   ├── Gradient overlay
│   │   │   └── "← Previous" badge
│   │   └── Content (p-5)
│   │       ├── Category + Complexity
│   │       ├── Title (line-clamp-2)
│   │       └── Description (line-clamp-2)
│   │
│   └── Next Flow Card
│       ├── Featured Image (h-48)
│       │   ├── Gradient overlay
│       │   └── "Next →" badge
│       └── Content (p-5)
│           ├── Category + Complexity
│           ├── Title (line-clamp-2)
│           └── Description (line-clamp-2)
│
└── View All Flows Button (centered)
```

## 🎯 **Benefits**

### **User Experience:**
- ✅ **Visual preview**: See what's next before clicking
- ✅ **More context**: Image + description helps decision making
- ✅ **Better engagement**: Rich cards are more appealing
- ✅ **Clear direction**: Previous/Next badges show navigation

### **Information Density:**
- ✅ **Featured image**: Visual representation of the flow
- ✅ **Category**: Quick topic identification
- ✅ **Complexity**: Difficulty level at a glance
- ✅ **Title**: Clear flow name
- ✅ **Description**: Brief overview of content

### **Design Quality:**
- ✅ **Professional appearance**: Modern card design
- ✅ **Consistent styling**: Matches global design system
- ✅ **Smooth animations**: Polished hover effects
- ✅ **Responsive**: Works on all screen sizes

## 📱 **Responsive Behavior**

### **Desktop (sm+):**
```
┌──────────────────┬──────────────────┐
│  Previous Card   │   Next Card      │
└──────────────────┴──────────────────┘
```

### **Mobile:**
```
┌──────────────────┐
│  Previous Card   │
└──────────────────┘
┌──────────────────┐
│   Next Card      │
└──────────────────┘
```

## 🔄 **Comparison**

| Feature | Before | After |
|---------|--------|-------|
| **Visual** | Text + small icon | Full preview card with image |
| **Information** | Title only | Image + Category + Title + Description |
| **Size** | Small, compact | Large, prominent cards |
| **Engagement** | Low | High |
| **Context** | Minimal | Rich preview |
| **Layout** | Horizontal row | Grid cards |
| **Hover Effect** | Color change | Border + Shadow + Image zoom |

## 💡 **Technical Implementation**

### **Image Optimization:**
```tsx
<Image
  src={flow.featured_image}
  alt={flow.title}
  fill
  className="object-cover transition-transform duration-300 group-hover:scale-105"
/>
```

### **Text Truncation:**
```tsx
// Title: Max 2 lines
className="line-clamp-2"

// Description: Max 2 lines
className="line-clamp-2"
```

### **Conditional Rendering:**
```tsx
{relatedFlows[0] && <PreviousCard />}
{relatedFlows[1] && <NextCard />}
```

### **Fallback Content:**
```tsx
// Uses excerpt if available, otherwise description
{flow.excerpt || flow.description}
```

## 🎨 **Color Scheme**

### **Card Elements:**
- **Border**: `border-stroke dark:border-stroke-dark`
- **Background**: `bg-white dark:bg-gray-dark`
- **Hover border**: `hover:border-primary`
- **Category badge**: `bg-primary/10 text-primary`
- **Direction badge**: `bg-white/90 text-black`

### **Text Colors:**
- **Title**: `text-black dark:text-white`
- **Description**: `text-body-color dark:text-body-color-dark`
- **Complexity**: `text-body-color dark:text-body-color-dark`
- **Hover title**: `group-hover:text-primary`

## 🚀 **Performance**

### **Optimizations:**
- ✅ **Next.js Image**: Automatic optimization and lazy loading
- ✅ **Transition duration**: 300ms for smooth effects
- ✅ **CSS transforms**: Hardware-accelerated animations
- ✅ **Conditional rendering**: Only renders if flows exist

---

**Status**: ✅ Complete
**Impact**: 🔥 High - Much better navigation experience
**User Engagement**: ⭐⭐⭐⭐⭐ Rich preview cards
**Visual Appeal**: 🎨 Professional and modern
