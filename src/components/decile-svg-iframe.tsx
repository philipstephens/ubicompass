import { component$, useVisibleTask$ } from '@builder.io/qwik';

/**
 * Component that displays the decile calculator SVG demo in an iframe
 */
export const DecileSvgIframe = component$(() => {
  // Use a visible task to handle iframe resizing
  useVisibleTask$(() => {
    // Function to adjust iframe height based on content
    const adjustIframeHeight = () => {
      const iframe = document.getElementById('decile-svg-iframe') as HTMLIFrameElement;
      if (iframe && iframe.contentWindow) {
        try {
          // Add some extra height to avoid scrollbars
          const height = iframe.contentWindow.document.body.scrollHeight + 50;
          iframe.style.height = `${height}px`;
        } catch (e) {
          console.error('Error adjusting iframe height:', e);
        }
      }
    };

    // Add event listener for iframe load
    const iframe = document.getElementById('decile-svg-iframe') as HTMLIFrameElement;
    if (iframe) {
      iframe.addEventListener('load', adjustIframeHeight);
    }

    // Set up window resize handler
    const handleResize = () => {
      setTimeout(adjustIframeHeight, 100);
    };
    window.addEventListener('resize', handleResize);

    // Clean up event listeners
    return () => {
      if (iframe) {
        iframe.removeEventListener('load', adjustIframeHeight);
      }
      window.removeEventListener('resize', handleResize);
    };
  });

  return (
    <div class="decile-svg-iframe-container">
      <iframe
        id="decile-svg-iframe"
        src="/decile-calculator-svg-demo.html"
        style={{
          width: '100%',
          height: '1200px', // Initial height, will be adjusted by JavaScript
          border: 'none',
          overflow: 'hidden'
        }}
        title="UBI Decile Calculator with SVG Charts"
      ></iframe>
    </div>
  );
});
