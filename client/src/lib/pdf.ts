import { Book } from "@shared/schema";
import { toast } from "@/hooks/use-toast";
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';

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

    // Function to render a page and add it to the PDF
    const renderPageToPdf = async (element: HTMLElement, isFirstPage: boolean = false) => {
      try {
        updateStatus(`Processing page ${currentPage}...`);
        
        // Set the element as the content of our container
        bookContainer.innerHTML = '';
        bookContainer.appendChild(element);
        
        // Render the element to canvas
        const canvas = await html2canvas(element, {
          scale: 2, // Higher scale for better quality
          useCORS: true, // Enable CORS for images
          allowTaint: true,
          logging: false,
          backgroundColor: element.style.backgroundColor || '#ffffff'
        });
        
        // Calculate dimensions to fit page
        const imgWidth = 210; // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        
        if (!isFirstPage) {
          pdf.addPage();
        }
        
        pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
        currentPage++;
      } catch (err) {
        console.error("Error rendering page to PDF:", err);
      }
    };

    // GENERATE COVER PAGE
    updateStatus('Creating cover page...');
    const coverPage = document.createElement('div');
    coverPage.style.width = '210mm';
    coverPage.style.height = '297mm';
    coverPage.style.position = 'relative';
    coverPage.style.backgroundColor = '#1a2b3c';
    coverPage.style.overflow = 'hidden';
    
    // Cover background
    if (book.cover.imageUrl) {
      const coverBg = document.createElement('div');
      coverBg.style.position = 'absolute';
      coverBg.style.top = '0';
      coverBg.style.left = '0';
      coverBg.style.width = '100%';
      coverBg.style.height = '100%';
      coverBg.style.backgroundImage = `url(${book.cover.imageUrl})`;
      coverBg.style.backgroundSize = 'cover';
      coverBg.style.backgroundPosition = 'center';
      coverBg.style.opacity = '0.6';
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
      const centralImg = document.createElement('img');
      centralImg.src = book.cover.centralImageUrl;
      centralImg.style.width = '120px';
      centralImg.style.height = '120px';
      centralImg.style.objectFit = 'cover';
      centralImg.style.borderRadius = '50%';
      centralImg.style.border = '5px solid rgba(255, 255, 255, 0.3)';
      centralImg.style.marginTop = '20mm';
      centralImg.style.marginBottom = '20mm';
      centralImg.crossOrigin = 'anonymous';
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
          
          // Chapter image if available
          if (page.imageUrl) {
            const chapterImage = document.createElement('img');
            chapterImage.src = page.imageUrl;
            chapterImage.style.width = '100%';
            chapterImage.style.maxHeight = '50mm';
            chapterImage.style.objectFit = 'cover';
            chapterImage.style.marginBottom = '10mm';
            chapterImage.style.borderRadius = '3px';
            chapterImage.crossOrigin = 'anonymous';
            chapterPage.appendChild(chapterImage);
          }
        }
        
        // Page content
        const content = document.createElement('div');
        content.style.fontSize = '12px';
        content.style.lineHeight = '1.5';
        content.innerHTML = page.content;
        chapterPage.appendChild(content);
        
        // Add the chapter page to PDF
        await renderPageToPdf(chapterPage);
      }
      
      chapterCounter++;
    }
    
    updateStatus('Finalizing PDF...');
    
    // Save the PDF and clean up
    pdf.save(`${book.cover.title.replace(/\s+/g, "_")}.pdf`);
    
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
