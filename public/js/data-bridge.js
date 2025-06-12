/**
 * Data Bridge for UBI Calculator
 * 
 * This script provides a bridge between the main Qwik application and the standalone calculator.
 * It allows data to be shared between the two, ensuring a consistent user experience.
 */

// Store for calculator data
const UbiDataBridge = {
  // Default values
  data: {
    // Tax year data
    years: [
      { year: 2022, ubiid: 1, ubiamount: 24, flattaxpercentage: 30 },
      { year: 2023, ubiid: 2, ubiamount: 24, flattaxpercentage: 30 }
    ],
    // Selected year
    selectedYear: { year: 2022, ubiid: 1, ubiamount: 24, flattaxpercentage: 30 },
    // Selected exemption amount
    exemptionAmount: 24,
    // Selected language
    language: 'en',
    // Decile data for 2022
    decileData2022: [
      { decile: 1, lowerBound: 0, upperBound: 10, averageTaxableIncome: 5 },
      { decile: 2, lowerBound: 10, upperBound: 20, averageTaxableIncome: 15 },
      { decile: 3, lowerBound: 20, upperBound: 30, averageTaxableIncome: 25 },
      { decile: 4, lowerBound: 30, upperBound: 40, averageTaxableIncome: 35 },
      { decile: 5, lowerBound: 40, upperBound: 50, averageTaxableIncome: 45 },
      { decile: 6, lowerBound: 50, upperBound: 60, averageTaxableIncome: 55 },
      { decile: 7, lowerBound: 60, upperBound: 70, averageTaxableIncome: 65 },
      { decile: 8, lowerBound: 70, upperBound: 100, averageTaxableIncome: 85 },
      { decile: 9, lowerBound: 100, upperBound: 150, averageTaxableIncome: 120 },
      { decile: 10, lowerBound: 150, upperBound: 500, averageTaxableIncome: 280 }
    ],
    // Decile data for 2023
    decileData2023: [
      { decile: 1, lowerBound: 0, upperBound: 12, averageTaxableIncome: 6 },
      { decile: 2, lowerBound: 12, upperBound: 24, averageTaxableIncome: 18 },
      { decile: 3, lowerBound: 24, upperBound: 36, averageTaxableIncome: 30 },
      { decile: 4, lowerBound: 36, upperBound: 48, averageTaxableIncome: 42 },
      { decile: 5, lowerBound: 48, upperBound: 60, averageTaxableIncome: 54 },
      { decile: 6, lowerBound: 60, upperBound: 72, averageTaxableIncome: 66 },
      { decile: 7, lowerBound: 72, upperBound: 84, averageTaxableIncome: 78 },
      { decile: 8, lowerBound: 84, upperBound: 120, averageTaxableIncome: 102 },
      { decile: 9, lowerBound: 120, upperBound: 180, averageTaxableIncome: 144 },
      { decile: 10, lowerBound: 180, upperBound: 600, averageTaxableIncome: 336 }
    ]
  },
  
  // Event listeners
  listeners: {},
  
  // Initialize the bridge
  init() {
    // Try to load data from localStorage
    this.loadFromStorage();
    
    // Set up message listener for communication with parent window
    window.addEventListener('message', this.handleMessage.bind(this));
    
    // If we're in an iframe, send a ready message to the parent
    if (window !== window.parent) {
      window.parent.postMessage({ type: 'UBI_CALCULATOR_READY' }, '*');
    }
    
    // Save initial data to localStorage
    this.saveToStorage();
    
    console.log('UBI Data Bridge initialized');
  },
  
  // Load data from localStorage
  loadFromStorage() {
    try {
      const storedData = localStorage.getItem('ubiCalculatorData');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        // Merge with default data to ensure all properties exist
        this.data = { ...this.data, ...parsedData };
        console.log('Loaded data from localStorage');
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    }
  },
  
  // Save data to localStorage
  saveToStorage() {
    try {
      localStorage.setItem('ubiCalculatorData', JSON.stringify(this.data));
    } catch (error) {
      console.error('Error saving data to localStorage:', error);
    }
  },
  
  // Handle messages from parent window
  handleMessage(event) {
    const message = event.data;
    
    // Only process messages with the correct type
    if (message && message.type && message.type.startsWith('UBI_')) {
      console.log('Received message:', message);
      
      switch (message.type) {
        case 'UBI_UPDATE_DATA':
          // Update our data with the received data
          if (message.data) {
            this.data = { ...this.data, ...message.data };
            this.saveToStorage();
            this.notifyListeners('dataUpdated', this.data);
          }
          break;
          
        case 'UBI_REQUEST_DATA':
          // Send our data to the parent window
          window.parent.postMessage({
            type: 'UBI_DATA_RESPONSE',
            data: this.data
          }, '*');
          break;
          
        case 'UBI_SET_LANGUAGE':
          // Update language
          if (message.language) {
            this.data.language = message.language;
            this.saveToStorage();
            this.notifyListeners('languageChanged', message.language);
          }
          break;
      }
    }
  },
  
  // Add event listener
  addEventListener(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
    return () => this.removeEventListener(event, callback);
  },
  
  // Remove event listener
  removeEventListener(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  },
  
  // Notify all listeners of an event
  notifyListeners(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  },
  
  // Get current data
  getData() {
    return this.data;
  },
  
  // Update data
  updateData(newData) {
    this.data = { ...this.data, ...newData };
    this.saveToStorage();
    this.notifyListeners('dataUpdated', this.data);
    
    // If we're in an iframe, send the updated data to the parent
    if (window !== window.parent) {
      window.parent.postMessage({
        type: 'UBI_DATA_UPDATED',
        data: this.data
      }, '*');
    }
  },
  
  // Set language
  setLanguage(language) {
    this.data.language = language;
    this.saveToStorage();
    this.notifyListeners('languageChanged', language);
    
    // If we're in an iframe, send the language update to the parent
    if (window !== window.parent) {
      window.parent.postMessage({
        type: 'UBI_LANGUAGE_CHANGED',
        language: language
      }, '*');
    }
  }
};

// Initialize the bridge when the page loads
window.addEventListener('DOMContentLoaded', () => {
  window.UbiDataBridge = UbiDataBridge;
  UbiDataBridge.init();
});
