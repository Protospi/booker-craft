import { Book } from "@shared/schema";
import { toast } from "@/hooks/use-toast";
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';

// In-memory image cache (could be moved to IndexedDB or local storage in the future)
const globalImageCache: Record<string, string> = {};

// Function to create a proxy URL for images to bypass CORS
const createProxyUrl = (originalUrl: string): string => {
  try {
    // Create a URL-safe encoded version of the original URL
    const encodedUrl = encodeURIComponent(originalUrl);
    
    // For OpenAI or other problematic CORS images, use a proxy service
    // Note: This is a public image proxy service. In production, you should use your own server proxy.
    const proxyUrl = `https://images.weserv.nl/?url=${encodedUrl}&default=fallback`;
    return proxyUrl;
  } catch (error) {
    console.error("Error creating proxy URL:", error);
    return originalUrl;
  }
};

export const generatePDF = async (book: Book): Promise<void> => {
  try {
    // Container for the entire book
    const bookContainer = document.createElement('div');
    bookContainer.id = 'book-pdf-container';
    bookContainer.style.position = 'fixed';
    bookContainer.style.left = '-9999px';
    bookContainer.style.top = '0';
    bookContainer.style.width = '210mm'; // A4 width
    bookContainer.style.backgroundColor = 'white';
    bookContainer.style.zIndex = '-1000';
    document.body.appendChild(bookContainer);

    const pdf = new jsPDF('p', 'mm', 'a4');
    let currentPage = 1;
    
    // Add a status indicator
    const statusIndicator = document.createElement('div');
    statusIndicator.style.position = 'fixed';
    statusIndicator.style.top = '50%';
    statusIndicator.style.left = '50%';
    statusIndicator.style.transform = 'translate(-50%, -50%)';
    statusIndicator.style.padding = '15px 20px';
    statusIndicator.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    statusIndicator.style.color = 'white';
    statusIndicator.style.borderRadius = '5px';
    statusIndicator.style.zIndex = '9999';
    statusIndicator.style.fontFamily = 'Arial, sans-serif';
    statusIndicator.textContent = 'Generating PDF... Please wait.';
    document.body.appendChild(statusIndicator);

    // Function to update status
    const updateStatus = (message: string) => {
      statusIndicator.textContent = message;
    };

    // Session-specific cache for storing fetched image data
    const imageCache = new Map<string, string>();

    // Check if a URL is from OpenAI's DALL-E service or other problematic sources
    const isProblematicImage = (url: string): boolean => {
      return url.includes('oaidalleapiprodscus.blob.core.windows.net') || 
             url.includes('dall-e') || 
             url.includes('openai');
    };

    // Helper function to fetch and cache an image as base64
    const fetchAndCacheImage = async (url: string): Promise<string> => {
      // Return fallback for empty URLs
      if (!url) {
        return getFallbackImage();
      }

      // Check global cache first
      if (globalImageCache[url]) {
        console.log(`Image found in global cache: ${url.substring(0, 50)}...`);
        return globalImageCache[url];
      }

      // Check session cache next
      if (imageCache.has(url)) {
        return imageCache.get(url) || '';
      }

      try {
        // If this is a problematic image, use a proxy
        const fetchUrl = isProblematicImage(url) ? createProxyUrl(url) : url;
        console.log(`Fetching image from: ${fetchUrl.substring(0, 50)}...`);

        const response = await fetch(fetchUrl, {
          mode: 'cors',
          cache: 'force-cache',
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch image: ${response.status}`);
        }
        
        const blob = await response.blob();
        
        // Convert blob to base64
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64data = reader.result as string;
            // Cache the result in both caches
            imageCache.set(url, base64data);
            globalImageCache[url] = base64data;
            
            console.log(`Successfully cached image: ${url.substring(0, 50)}...`);
            resolve(base64data);
          };
          reader.readAsDataURL(blob);
        });
      } catch (error) {
        console.error(`Error fetching image ${url}:`, error);
        
        // Try alternative method for problematic images
        if (isProblematicImage(url)) {
          try {
            console.log(`Trying alternative method for image: ${url.substring(0, 50)}...`);
            return await fetchWithImageElement(url);
          } catch (innerError) {
            console.error(`Alternative method failed for ${url}:`, innerError);
            return getFallbackImage();
          }
        }
        
        return getFallbackImage();
      }
    };
    
    // Helper function to fetch image using Image element
    const fetchWithImageElement = (url: string): Promise<string> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        // Set up success handler
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = img.width || 800;
            canvas.height = img.height || 600;
            
            const ctx = canvas.getContext('2d');
            if (!ctx) {
              reject(new Error('Could not get canvas context'));
              return;
            }
            
            // Draw the image to canvas
            ctx.drawImage(img, 0, 0);
            
            try {
              // Convert to data URL
              const dataUrl = canvas.toDataURL('image/png');
              
              // Cache the image
              imageCache.set(url, dataUrl);
              globalImageCache[url] = dataUrl;
              
              resolve(dataUrl);
            } catch (e) {
              console.error('Canvas tainted by cross-origin data:', e);
              reject(e);
            }
          } catch (e) {
            reject(e);
          }
        };
        
        // Set up error handler
        img.onerror = () => {
          reject(new Error(`Failed to load image: ${url}`));
        };
        
        // Try the image with proxy if it's a problematic source
        const imgUrl = isProblematicImage(url) ? createProxyUrl(url) : url;
        img.src = imgUrl;
      });
    };
    
    // Return a fallback image
    const getFallbackImage = (): string => {
      // SVG fallback with better visibility and styling
      return 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MDAiIGhlaWdodD0iNDAwIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2YwZjBmMCIgc3Ryb2tlPSIjZDBkMGQwIiBzdHJva2Utd2lkdGg9IjIiLz48dGV4dCB4PSI1MCUiIHk9IjQ1JSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjIwIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SW1hZ2UgTm90IEF2YWlsYWJsZTwvdGV4dD48dGV4dCB4PSI1MCUiIHk9IjU1JSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNjY2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5UaGlzIGltYWdlIGNvdWxkIG5vdCBiZSBsb2FkZWQgZHVlIHRvIENPUlMgcmVzdHJpY3Rpb25zPC90ZXh0PjwvY3ZnPg==';
    };

    // Helper function to preserve image aspect ratio
    const preserveImageAspectRatio = async (imageUrl: string, containerWidth: number, maxHeight: number): Promise<{ width: number, height: number }> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          // Calculate aspect ratio
          const aspectRatio = img.width / img.height;
          
          // Set width to container width
          const width = containerWidth;
          
          // Calculate height based on aspect ratio
          let height = width / aspectRatio;
          
          // If height exceeds max height, adjust width and height
          if (height > maxHeight) {
            height = maxHeight;
            // Recalculate width based on max height and aspect ratio
            const adjustedWidth = height * aspectRatio;
            resolve({ width: adjustedWidth, height });
          } else {
            resolve({ width, height });
          }
        };
        
        img.onerror = () => {
          // Default dimensions if image fails to load
          resolve({ width: containerWidth * 0.8, height: containerWidth * 0.5 });
        };
        
        // Set source after handlers
        if (imageUrl.startsWith('data:')) {
          img.src = imageUrl;
        } else {
          img.src = globalImageCache[imageUrl] || imageUrl;
        }
      });
    };

    // Pre-cache all images to prevent CORS issues during PDF generation
    const imageUrls = new Set<string>();
    
    // Collect cover images
    if (book.cover.imageUrl) imageUrls.add(book.cover.imageUrl);
    if (book.cover.centralImageUrl) imageUrls.add(book.cover.centralImageUrl);
    
    // Collect chapter images
    book.chapters.forEach(chapter => {
      chapter.pages.forEach(page => {
        if (page.imageUrl) imageUrls.add(page.imageUrl);
      });
    });
    
    // Pre-load images
    updateStatus('Fetching and processing images...');
    console.log("Starting to preload images...");
    try {
      // First check if images are already in global cache
      const uncachedUrls = Array.from(imageUrls).filter(url => !globalImageCache[url]);
      
      if (uncachedUrls.length > 0) {
        console.log(`Need to fetch ${uncachedUrls.length} uncached images`);
        const results = await Promise.allSettled(
          uncachedUrls.map(async (url) => {
            console.log(`Pre-loading image: ${url.substring(0, 50)}...`);
            try {
              const base64 = await fetchAndCacheImage(url);
              return { url, base64, success: !!base64 };
            } catch (error) {
              console.error(`Failed to preload image ${url}:`, error);
              return { url, success: false };
            }
          })
        );
        
        // Log preloading results
        const successCount = results.filter(r => 
          r.status === 'fulfilled' && (r.value as any).success
        ).length;
        
        console.log(`Successfully preloaded ${successCount} of ${uncachedUrls.length} images`);
      } else {
        console.log("All images already in global cache, skipping preload");
      }
    } catch (error) {
      console.error("Error pre-loading images:", error);
      // Continue even if preloading fails
    }

    // Function to render a page and add it to the PDF
    const renderPageToPdf = async (element: HTMLElement, isFirstPage: boolean = false) => {
      try {
        updateStatus(`Processing page ${currentPage}...`);
        
        // Set the element as the content of our container
        bookContainer.innerHTML = '';
        bookContainer.appendChild(element);
        
        // Wait for a moment to ensure DOM rendering is complete
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Process images inside the element
        const imgElements = element.querySelectorAll('img');
        for (const img of Array.from(imgElements) as HTMLImageElement[]) {
          if (img.src.startsWith('http')) {
            try {
              // Use cached or fetch new image as base64
              console.log(`Processing image in element: ${img.src.substring(0, 50)}...`);
              const base64Data = globalImageCache[img.src] || 
                                 imageCache.get(img.src) || 
                                 await fetchAndCacheImage(img.src);
              
              if (base64Data) {
                img.src = base64Data;
                console.log("Successfully replaced image with base64 data");
              } else {
                console.warn("No base64 data returned for image, using fallback");
                img.src = getFallbackImage();
              }
            } catch (error) {
              console.error(`Error processing image ${img.src}:`, error);
              img.src = getFallbackImage();
            }
          }
        }
        
        console.log(`Rendering page ${currentPage} with html2canvas`);
        // Render the element to canvas with improved settings
        const canvas = await html2canvas(element, {
          scale: 2, // Higher scale for better quality
          useCORS: true, // Enable CORS for images
          allowTaint: true,
          logging: false, // Disable verbose logging
          backgroundColor: element.style.backgroundColor || '#ffffff',
          imageTimeout: 15000, // Longer timeout for images
          onclone: (clonedDoc) => {
            // Ensure images are visible in the cloned document
            console.log("Preparing cloned document for rendering");
            const clonedImages = clonedDoc.querySelectorAll('img');
            clonedImages.forEach(img => {
              // Force image display
              img.style.display = 'block';
              img.style.opacity = '1';
              img.style.visibility = 'visible';
            });
          }
        });
        
        console.log(`Successfully rendered page ${currentPage} to canvas`);
        
        // Calculate dimensions to fit page
        const imgWidth = 210; // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        
        if (!isFirstPage) {
          pdf.addPage();
        }
        
        pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
        console.log(`Added page ${currentPage} to PDF`);
        currentPage++;
      } catch (err) {
        console.error("Error rendering page to PDF:", err);
        // Add a blank page with error message
        if (!isFirstPage) {
          pdf.addPage();
        }
        pdf.setFontSize(16);
        pdf.text('Error rendering page. Please try again.', 20, 20);
        currentPage++;
      }
    };

    // GENERATE COVER PAGE
    updateStatus('Creating cover page...');
    console.log("Creating cover page");
    const coverPage = document.createElement('div');
    coverPage.style.width = '210mm';
    coverPage.style.height = '297mm';
    coverPage.style.position = 'relative';
    coverPage.style.backgroundColor = '#1a2b3c';
    coverPage.style.overflow = 'hidden';
    
    // Cover background with image
    if (book.cover.imageUrl) {
      console.log("Creating cover with background image:", book.cover.imageUrl);
      const coverBg = document.createElement('div');
      coverBg.style.position = 'absolute';
      coverBg.style.top = '0';
      coverBg.style.left = '0';
      coverBg.style.width = '100%';
      coverBg.style.height = '100%';
      coverBg.style.overflow = 'hidden';
      
      // Use an actual img element for better compatibility
      const coverImg = document.createElement('img');
      // Use cached or fetch new image
      const coverImgBase64 = globalImageCache[book.cover.imageUrl] || 
                             await fetchAndCacheImage(book.cover.imageUrl);
      
      coverImg.src = coverImgBase64 || getFallbackImage();
      console.log("Cover image source set to:", coverImgBase64 ? "base64 data" : "fallback image");
      coverImg.alt = "Book cover";
      coverImg.style.width = '100%';
      coverImg.style.height = '100%';
      coverImg.style.objectFit = 'cover';
      coverImg.style.objectPosition = 'center';
      coverImg.style.opacity = '0.6';
      
      coverBg.appendChild(coverImg);
      coverPage.appendChild(coverBg);
    }
    
    // Overlay for readability
    const overlay = document.createElement('div');
    overlay.style.position = 'absolute';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    coverPage.appendChild(overlay);
    
    // Cover content container
    const coverContent = document.createElement('div');
    coverContent.style.position = 'relative';
    coverContent.style.height = '100%';
    coverContent.style.width = '100%';
    coverContent.style.display = 'flex';
    coverContent.style.flexDirection = 'column';
    coverContent.style.justifyContent = 'space-between';
    coverContent.style.alignItems = 'center';
    coverContent.style.padding = '40mm 20mm';
    coverContent.style.boxSizing = 'border-box';
    coverContent.style.color = 'white';
    coverContent.style.textAlign = 'center';
    
    // Title
    const title = document.createElement('h1');
    title.textContent = book.cover.title;
    title.style.fontSize = '32px';
    title.style.fontWeight = 'bold';
    title.style.marginBottom = '10mm';
    
    // Subtitle
    const subtitle = document.createElement('h2');
    subtitle.textContent = book.cover.subtitle;
    subtitle.style.fontSize = '20px';
    subtitle.style.fontStyle = 'italic';
    subtitle.style.fontWeight = 'normal';
    subtitle.style.color = '#cccccc';
    
    const titleWrapper = document.createElement('div');
    titleWrapper.appendChild(title);
    titleWrapper.appendChild(subtitle);
    coverContent.appendChild(titleWrapper);
    
    // Central image if available
    if (book.cover.centralImageUrl) {
      console.log("Adding central cover image:", book.cover.centralImageUrl);
      const centralImgBase64 = globalImageCache[book.cover.centralImageUrl] || 
                              await fetchAndCacheImage(book.cover.centralImageUrl);
      
      const centralImg = document.createElement('img');
      centralImg.src = centralImgBase64 || getFallbackImage();
      console.log("Central image source set to:", centralImgBase64 ? "base64 data" : "fallback image");
      centralImg.style.width = '120px';
      centralImg.style.height = '120px';
      centralImg.style.objectFit = 'cover';
      centralImg.style.borderRadius = '50%';
      centralImg.style.border = '5px solid rgba(255, 255, 255, 0.3)';
      centralImg.style.marginTop = '20mm';
      centralImg.style.marginBottom = '20mm';
      
      coverContent.appendChild(centralImg);
    }
    
    // Footer
    const footer = document.createElement('div');
    footer.innerHTML = `<p style="margin-bottom: 5mm;">Generated by AI</p>
                        <p>${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</p>`;
    coverContent.appendChild(footer);
    
    coverPage.appendChild(coverContent);
    
    // Add cover page to PDF
    await renderPageToPdf(coverPage, true);
    
    // GENERATE TABLE OF CONTENTS
    updateStatus('Creating table of contents...');
    const tocPage = document.createElement('div');
    tocPage.style.width = '210mm';
    tocPage.style.height = '297mm';
    tocPage.style.padding = '20mm';
    tocPage.style.boxSizing = 'border-box';
    tocPage.style.backgroundColor = 'white';
    tocPage.style.fontFamily = 'Arial, sans-serif';
    
    const tocTitle = document.createElement('h1');
    tocTitle.textContent = 'Table of Contents';
    tocTitle.style.fontSize = '24px';
    tocTitle.style.marginBottom = '15mm';
    tocTitle.style.paddingBottom = '5mm';
    tocTitle.style.borderBottom = '1px solid #eeeeee';
    tocPage.appendChild(tocTitle);
    
    const tocContent = document.createElement('div');
    book.chapters.forEach(chapter => {
      const chapterItem = document.createElement('div');
      chapterItem.style.marginBottom = '8mm';
      chapterItem.style.display = 'flex';
      chapterItem.style.justifyContent = 'space-between';
      chapterItem.style.alignItems = 'baseline';
      chapterItem.style.borderBottom = '1px dotted #dddddd';
      chapterItem.style.paddingBottom = '3mm';
      
      const chapterTitle = document.createElement('span');
      chapterTitle.textContent = `Chapter ${chapter.number}: ${chapter.title}`;
      chapterTitle.style.fontWeight = 'normal';
      chapterTitle.style.fontSize = '14px';
      
      chapterItem.appendChild(chapterTitle);
      tocContent.appendChild(chapterItem);
    });
    
    tocPage.appendChild(tocContent);
    
    // Add TOC to PDF
    await renderPageToPdf(tocPage);
    
    // GENERATE CHAPTER PAGES
    let chapterCounter = 1;
    const totalChapters = book.chapters.length;
    
    for (const chapter of book.chapters) {
      updateStatus(`Processing chapter ${chapterCounter} of ${totalChapters}...`);
      
      // Process each page in the chapter
      for (let pageIndex = 0; pageIndex < chapter.pages.length; pageIndex++) {
        const page = chapter.pages[pageIndex];
        
        const chapterPage = document.createElement('div');
        chapterPage.style.width = '210mm';
        chapterPage.style.minHeight = '297mm';
        chapterPage.style.padding = '20mm';
        chapterPage.style.boxSizing = 'border-box';
        chapterPage.style.backgroundColor = 'white';
        chapterPage.style.fontFamily = 'Arial, sans-serif';
        
        // Chapter header if it's the start of a chapter
        if (page.isChapterStart) {
          const chapterHeader = document.createElement('h2');
          chapterHeader.textContent = `Chapter ${chapter.number}: ${chapter.title}`;
          chapterHeader.style.fontSize = '20px';
          chapterHeader.style.marginBottom = '10mm';
          chapterPage.appendChild(chapterHeader);
          
          // Chapter image if available - using a more direct approach
          if (page.imageUrl) {
            console.log(`Adding chapter ${chapter.number} image:`, page.imageUrl);
            // Get cached or fetch new image
            const chapterImgBase64 = globalImageCache[page.imageUrl] || 
                                    await fetchAndCacheImage(page.imageUrl);
            
            console.log(`Chapter image base64 retrieved:`, chapterImgBase64 ? "yes" : "no");
            
            // Use a figure element with explicit styling for better semantic structure
            const figure = document.createElement('figure');
            figure.style.width = '100%';
            figure.style.margin = '0 0 15mm 0';
            figure.style.padding = '0';
            
            // Calculate image dimensions while preserving aspect ratio
            // A4 paper width is 210mm, with 20mm padding on each side = 170mm content width
            // Convert to pixels for calculation (approximately)
            const containerWidthPx = 800; // Representing ~170mm content width
            const maxHeightPx = 400; // Maximum height for the image (approximately)
            const dimensions = await preserveImageAspectRatio(
              chapterImgBase64 || page.imageUrl, 
              containerWidthPx, 
              maxHeightPx
            );
            
            // Create image container with calculated dimensions 
            const imageContainer = document.createElement('div');
            imageContainer.style.width = `${dimensions.width}px`;
            imageContainer.style.height = `${dimensions.height}px`;
            imageContainer.style.position = 'relative';
            imageContainer.style.margin = '0 auto'; // Center the image horizontally
            imageContainer.style.overflow = 'hidden';
            imageContainer.style.backgroundColor = '#f8f8f8'; // Light background to show where image should be
            imageContainer.style.border = '1px solid #eaeaea';
            
            // Use an actual img element
            const img = document.createElement('img');
            img.src = chapterImgBase64 || getFallbackImage();
            img.alt = `Image for Chapter ${chapter.number}`;
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'contain'; // Changed from 'cover' to 'contain' to preserve aspect ratio
            img.style.objectPosition = 'center';
            img.style.display = 'block';
            
            // Add a caption for the image
            const caption = document.createElement('figcaption');
            caption.textContent = `Figure for Chapter ${chapter.number}`;
            caption.style.fontSize = '10px';
            caption.style.color = '#666';
            caption.style.textAlign = 'center';
            caption.style.marginTop = '5px';
            
            imageContainer.appendChild(img);
            figure.appendChild(imageContainer);
            figure.appendChild(caption);
            chapterPage.appendChild(figure);
          }
        }
        
        // Page content
        const content = document.createElement('div');
        content.style.fontSize = '12px';
        content.style.lineHeight = '1.5';
        content.style.fontFamily = 'Arial, sans-serif';
        content.innerHTML = page.content;

        // Apply proper styling to all HTML elements to ensure they render correctly in PDF
        content.querySelectorAll('h1, h2, h3, h4, h5, h6, p, ul, ol, li').forEach((element) => {
          // Cast to HTMLElement to access style properties
          const el = element as HTMLElement;
          
          // Apply specific styles based on element type
          if (el.tagName === 'H1' || el.tagName === 'H2') {
            el.style.fontSize = '1.5em';
            el.style.fontWeight = 'bold';
            el.style.margin = '0.83em 0';
            el.style.fontFamily = 'serif';
          } else if (el.tagName === 'H3') {
            el.style.fontSize = '1.3em';
            el.style.fontWeight = 'bold';
            el.style.margin = '0.67em 0';
            el.style.fontFamily = 'serif';
          } else if (el.tagName === 'H4') {
            el.style.fontSize = '1.15em';
            el.style.fontWeight = 'bold';
            el.style.margin = '0.5em 0';
          } else if (el.tagName === 'P') {
            el.style.margin = '0.75em 0';
            el.style.display = 'block';
          } else if (el.tagName === 'UL' || el.tagName === 'OL') {
            el.style.paddingLeft = '2em';
            el.style.margin = '0.75em 0';
          } else if (el.tagName === 'LI') {
            el.style.display = 'list-item';
            el.style.margin = '0.5em 0';
          }

          // Ensure all elements have the necessary display property
          if (!el.style.display) {
            el.style.display = 'block';
          }
        });

        // Ensure list items have proper bullet points in the PDF
        content.querySelectorAll('ul').forEach((ul) => {
          const ulEl = ul as HTMLUListElement;
          ulEl.style.listStyleType = 'disc';
          ulEl.querySelectorAll('li').forEach((li) => {
            const liEl = li as HTMLLIElement;
            liEl.style.display = 'list-item';
            liEl.style.marginLeft = '1em';
            // Ensure bullet points are visible
            if (!liEl.style.listStyleType) {
              liEl.style.listStyleType = 'disc';
            }
          });
        });

        // Ensure ordered lists have proper numbering
        content.querySelectorAll('ol').forEach((ol) => {
          const olEl = ol as HTMLOListElement;
          olEl.style.listStyleType = 'decimal';
          olEl.querySelectorAll('li').forEach((li) => {
            const liEl = li as HTMLLIElement;
            liEl.style.display = 'list-item';
            liEl.style.marginLeft = '1em';
            // Ensure numbers are visible
            if (!liEl.style.listStyleType) {
              liEl.style.listStyleType = 'decimal';
            }
          });
        });

        // Process any images inside the content
        const contentImages = content.querySelectorAll('img');
        for (const img of Array.from(contentImages) as HTMLImageElement[]) {
          if (img.src.startsWith('http')) {
            console.log(`Processing content image:`, img.src.substring(0, 50) + '...');
            try {
              const imgBase64 = globalImageCache[img.src] || 
                               imageCache.get(img.src) || 
                               await fetchAndCacheImage(img.src);
              
              if (imgBase64) {
                img.src = imgBase64;
                console.log("Content image replaced with base64 data");
              } else {
                console.warn("No base64 data returned for content image, using fallback");
                img.src = getFallbackImage();
              }
            } catch (error) {
              console.error(`Error processing content image ${img.src}:`, error);
              img.src = getFallbackImage();
            }
          }
        }

        // Apply global CSS to improve text rendering in PDFs
        const styleTag = document.createElement('style');
        styleTag.textContent = `
          /* Global styles for PDF rendering */
          div, p, h1, h2, h3, h4, h5, h6, ul, ol, li {
            page-break-inside: avoid;
          }
          h1, h2, h3, h4, h5, h6 {
            page-break-after: avoid;
            margin-top: 1em;
            margin-bottom: 0.5em;
            line-height: 1.2;
          }
          p {
            margin-bottom: 0.5em;
            line-height: 1.5;
          }
          ul, ol {
            margin-left: 2em;
            margin-bottom: 0.75em;
          }
          li {
            margin-bottom: 0.25em;
          }
          strong, b {
            font-weight: bold;
          }
          em, i {
            font-style: italic;
          }
        `;
        content.appendChild(styleTag);

        chapterPage.appendChild(content);
        
        // Add the chapter page to PDF
        await renderPageToPdf(chapterPage);
      }
      
      chapterCounter++;
    }
    
    updateStatus('Finalizing PDF...');
    
    // Save the PDF and clean up
    pdf.save(`${book.cover.title.replace(/\s+/g, "_")}.pdf`);
    console.log("PDF saved successfully");
    
    // Clean up
    document.body.removeChild(bookContainer);
    document.body.removeChild(statusIndicator);
    
    toast({
      title: "PDF Generated Successfully",
      description: "Your book has been downloaded as a PDF file.",
    });
    
  } catch (error) {
    console.error("Error generating PDF:", error);
    // Clean up any elements that might have been added
    const container = document.getElementById('book-pdf-container');
    if (container) {
      document.body.removeChild(container);
    }
    
    const statusIndicator = document.querySelector('div[style*="position: fixed"][style*="top: 50%"]');
    if (statusIndicator && statusIndicator.parentNode) {
      statusIndicator.parentNode.removeChild(statusIndicator);
    }
    
    toast({
      title: "PDF Generation Failed",
      description: "There was an error creating your PDF. Please try again.",
      variant: "destructive",
    });
  }
};
