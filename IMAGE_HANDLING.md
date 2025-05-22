# Next.js Image Handling Guide for Vercel Deployment

This guide provides multiple approaches to handle images in a Next.js application deployed to Vercel, ensuring they display correctly.

## Method 1: Using Public Directory (Recommended for Static Assets)

1. Place images in the `public` directory:
   ```
   public/
     images/
       example.jpg
   ```

2. Reference them with absolute paths in your components:
   ```jsx
   import Image from 'next/image';
   
   function MyComponent() {
     return (
       <Image 
         src="/images/example.jpg" 
         alt="Example" 
         width={500} 
         height={300} 
       />
     );
   }
   ```

3. For public images used this way, no special configuration is needed.

## Method 2: Importing Images from Your Project (Recommended for Tracked Assets)

1. Import images directly in your components:
   ```jsx
   import Image from 'next/image';
   import exampleImage from '../assets/example.jpg';
   
   function MyComponent() {
     return (
       <Image 
         src={exampleImage} 
         alt="Example" 
         // No need for width/height - they're automatically provided
       />
     );
   }
   ```

2. When deploying to Vercel, this works automatically with no extra configuration.

## Method 3: Using Remote Images

1. Configure `next.config.js` to allow specific domains:
   ```js
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     images: {
       domains: ['example.com', 'your-cdn.com'],
     },
   };
   ```

2. Use remote images in your components:
   ```jsx
   import Image from 'next/image';
   
   function MyComponent() {
     return (
       <Image 
         src="https://example.com/image.jpg" 
         alt="Remote example" 
         width={500} 
         height={300} 
       />
     );
   }
   ```

## Troubleshooting Common Issues

1. **Images not displaying on Vercel but work locally**:
   - Make sure paths are absolute when using the public directory (start with `/`)
   - Check case sensitivity in filenames - Vercel is case-sensitive!
   - Verify all image domains are listed in the `domains` array in `next.config.js`

2. **Performance issues with many images**:
   - Use the `priority` prop for above-the-fold images
   - Implement lazy loading for images lower on the page
   - Consider using responsive sizes with the `sizes` prop

3. **SVG handling issues**:
   - Add `dangerouslyAllowSVG: true` to your Image configuration
   - Or use the `unoptimized` prop for specific SVGs

4. **Blurry placeholder images**:
   - Add `placeholder="blur"` and `blurDataURL` for a better loading experience

## For Your Current Project

The approach we've implemented:
- We've moved dot images to the public directory for consistent loading
- We're using absolute paths with the `unoptimized` prop to ensure compatibility
- We've configured the Next.js config for proper image handling on Vercel

When you deploy to Vercel, your images should now load correctly! 