import { component$, useVisibleTask$, useSignal, $ } from '@builder.io/qwik';
import { useUbiStore } from '../stores/ubi-data-store';

/**
 * Component that acts as a bridge between the Qwik app and the integrated calculator
 */
export const CalculatorBridge = component$(() => {
  const ubiStore = useUbiStore();
  const iframeRef = useSignal<HTMLIFrameElement | null>(null);
  
  // Function to send data to the iframe
  const sendDataToIframe = $(() => {
    if (iframeRef.value && iframeRef.value.contentWindow) {
      // Prepare data to send to the iframe
      const data = {
        selectedYear: ubiStore.selectedYear,
        exemptionAmount: ubiStore.selectedExemptionAmount,
        language: ubiStore.language
      };
      
      // Send the data to the iframe
      iframeRef.value.contentWindow.postMessage({
        type: 'UBI_UPDATE_DATA',
        data: data
      }, '*');
    }
  });
  
  // Listen for messages from the iframe
  useVisibleTask$(({ cleanup }) => {
    const handleMessage = (event: MessageEvent) => {
      const message = event.data;
      
      // Only process messages with the correct type
      if (message && message.type && message.type.startsWith('UBI_')) {
        console.log('Received message from iframe:', message);
        
        switch (message.type) {
          case 'UBI_CALCULATOR_READY':
            // The iframe is ready, send initial data
            sendDataToIframe();
            break;
            
          case 'UBI_DATA_UPDATED':
            // Update our store with data from the iframe
            if (message.data) {
              if (message.data.selectedYear) {
                ubiStore.selectYear(message.data.selectedYear.year);
                
                if (message.data.selectedYear.ubiamount) {
                  ubiStore.selectedYear!.ubiamount = message.data.selectedYear.ubiamount;
                }
                
                if (message.data.selectedYear.flattaxpercentage) {
                  ubiStore.selectedYear!.flattaxpercentage = message.data.selectedYear.flattaxpercentage;
                }
              }
              
              if (message.data.exemptionAmount !== undefined) {
                ubiStore.selectedExemptionAmount = message.data.exemptionAmount;
              }
              
              // Trigger a refresh
              ubiStore.refreshTrigger = Date.now();
            }
            break;
            
          case 'UBI_LANGUAGE_CHANGED':
            // Update our language
            if (message.language) {
              ubiStore.language = message.language;
            }
            break;
        }
      }
    };
    
    // Add event listener for messages from the iframe
    window.addEventListener('message', handleMessage);
    
    // Clean up the event listener when the component is unmounted
    cleanup(() => {
      window.removeEventListener('message', handleMessage);
    });
  });
  
  // Update the iframe when our store changes
  useVisibleTask$(({ track }) => {
    track(() => ubiStore.selectedYear);
    track(() => ubiStore.selectedExemptionAmount);
    track(() => ubiStore.language);
    track(() => ubiStore.refreshTrigger);
    
    // Send updated data to the iframe
    sendDataToIframe();
  });
  
  return (
    <div class="calculator-bridge">
      <iframe 
        ref={iframeRef}
        src="/integrated-calculator.html"
        style={{
          width: '100%',
          height: '1200px',
          border: 'none',
          overflow: 'hidden'
        }}
        title="Integrated UBI Calculator"
      ></iframe>
    </div>
  );
});
