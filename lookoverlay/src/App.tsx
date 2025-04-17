import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

function App() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const takeScreenshot = async (): Promise<string | undefined> => {
    try {
      // Hide the input container before taking screenshot
      const inputContainer = document.querySelector('.input-container');
      if (inputContainer) {
        inputContainer.classList.add('hidden');
      }
      
      // Small delay to ensure UI updates
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const response: { base64_image: string } = await invoke('take_screenshot');
      
      // Show the input container again
      if (inputContainer) {
        inputContainer.classList.remove('hidden');
      }
      
      return response.base64_image;
    } catch (error) {
      console.error('Failed to take screenshot:', error);
      return undefined;
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    setIsLoading(true);
    const screenshot = await takeScreenshot();
    
    // TODO: Send to GPT-4 Vision API
    console.log('Screenshot taken:', screenshot?.slice(0, 50) + '...');
    
    setInput('');
    setIsLoading(false);
  };

  return (
    <div className="app">
      <div className="transparent-area"></div>
      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about the screenshot..."
          disabled={isLoading}
        />
        <button onClick={sendMessage} disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
}

export default App;
