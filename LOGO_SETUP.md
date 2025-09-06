# 🎨 Logo Setup Instructions

## How to Add Your Logo

### Step 1: Add Your Logo File
1. Place your logo file in the `public/` directory
2. Supported formats: `.png`, `.jpg`, `.jpeg`, `.svg`, `.webp`
3. Recommended size: 120x120 pixels or larger (square format works best)

### Step 2: Update the Logo Path
In `app/page.tsx`, line 47, change:
```typescript
src="/logo.jpg"
```
to your actual logo filename:
```typescript
src="/your-logo-name.jpg"  // Replace with your actual filename
```

### Step 3: Optional Customization

#### Change Logo Size
Update the `width` and `height` props (lines 50-51):
```typescript
width={120}    // Change to your preferred width
height={120}   // Change to your preferred height
```

#### Adjust Logo Styling
Modify the `className` on line 52:
```typescript
className="rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
```

### Example Logo Files
- `/public/logo.png`
- `/public/finovo-logo.svg`
- `/public/company-logo.jpg`

### Fallback Logo
If your logo doesn't load, a gradient "F" logo will be displayed automatically.

### Logo Best Practices
- Use high-resolution images (at least 120x120px)
- Square format works best for the circular design
- PNG with transparency is recommended
- Keep file size under 100KB for fast loading

## Current Logo Implementation
The logo is displayed with:
- Rounded corners with shadow effects
- Hover animations
- Responsive sizing
- Automatic fallback if image fails to load
