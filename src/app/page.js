'use client'
import { useState, useEffect } from 'react';
import CreateFrog from './components/CreateFrog';
import FrogImage from './components/FrogImage';
import DownloadButton from './components/DownloadButton';
import MobileShareButton from './components/MobileShareButton';
import LoadingSpinner from './components/LoadingSpinner';
import Head from 'next/head';


export default function Home() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [frogImage, setFrogImage] = useState(null);
  const [error, setError] = useState('');
  const [isDownloadProcessing, setIsDownloadProcessing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Reset entry 
  const resetState = () => {
    setMessage('');
    console.log('setMessage worked')
    setFrogImage(null);
    setError('');
    localStorage.removeItem('frogImage');
  };

  // Helper function to check if the device is mobile - and if should show share button to user
  const isMobileDevice = () => {
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  };

  useEffect(() => {
    // Check for saved frog image in localStorage
    const savedFrogImage = localStorage.getItem('frogImage');
    if (savedFrogImage) {
      setFrogImage(JSON.parse(savedFrogImage));
    }
  }, []);

  useEffect(() => {
    // Check if navigator is available
    if (typeof navigator !== 'undefined') {
      setIsMobile(/Android|iPhone|iPad|iPod/i.test(navigator.userAgent));
    }
  }, []);

   // Handler for message changing 
   const handleMessageChange = (newMessage) => {
    setMessage(newMessage);
  };

  // Submmit message for generating frog 
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim() || message.trim().length < 2) {
      setError('Please enter a meaningful message (at least 2 characters)');
      return;
    }
    
    setLoading(true);

    try {
      const response = await fetch('/api/generate-frog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        let errorMessage;
        if (data.error?.includes('content policy')) {
          errorMessage = 'Message contains inappropriate content. Please modify your message and try again.';
        } else if (response.status === 504) {
          errorMessage = 'The request took too long. Please try again.';
        } else if (data.error?.includes('billing')) {
          errorMessage = 'API quota exceeded. Please try again later.';
        } else if (data.error?.includes('API key')) {
          errorMessage = 'Server configuration error. Please contact support.';
        } else {
          errorMessage = "Sorry, couldn't create your frog. Please try again.";
        }
        setError(errorMessage);
        setLoading(false);  // Make sure to set loading false on error
        return;
      }

      if (!data.imageUrl || !data.imageUrl.startsWith('http')) {
        throw new Error('Invalid image URL received from server');
      }
      
      // Create proxy url to avoid cors issue
      const proxyUrl = `/api/image-proxy?url=${encodeURIComponent(data.imageUrl)}`;
      setFrogImage({
        url: proxyUrl,
        blob: null
      });
      
      // Save to localStorage
      localStorage.setItem('frogImage', JSON.stringify({
        url: proxyUrl,
        blob: null
      }));
      
      setLoading(false);

      fetch(proxyUrl)
        .then(response => response.blob())
        .then(imageBlob => {
          const img = new Image();
          img.onload = () => {
              setFrogImage(current => ({
                ...current,
                blob: imageBlob
              }));
            };
          img.src = URL.createObjectURL(imageBlob);
        })
        .catch(error => {
          setLoading(false);
          setError('Failed to load image. Please try again.');
        });

    } catch (error) {
      setError(error.message);
    }
  };

  // Handle copy or download of frog image 
  const handleCopyOrDownload = async () => {
    if (!frogImage) {
      alert("Please wait for your frog to finish loading before downloading.");
      return;
    }
    
    setIsDownloadProcessing(true);  // Start processing
    
    try {
      // If we don't have the blob yet, fetch it now
      const blob = frogImage.blob || await (await fetch(frogImage.url)).blob();
      
      // Download
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'frog.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Try clipboard copy
      try {
        await navigator.clipboard.write([
          new ClipboardItem({
            [blob.type]: blob
          })
        ]);
        alert('Image downloaded and copied to clipboard!');
      } catch (clipboardError) {
        // Download successful but copy to clipboard failed
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
        alert(
            isMobile  // if user is on mobile
            ? 'Your frog was downloaded but cannot be copied to clipboard. You can find it in your downloads folder :)'  // mobile message
            : 'Your frog was downloaded but cannot be copied to clipboard. You can try right-clicking the image to copy it, or find it in your downloads folder :)'  // desktop message bc can right click on desktop
        );
      }

    } catch (error) {
      console.error('Error handling image:', error);
      alert('Sorry, there was an error downloading your frog.');
    } finally {
      setIsDownloadProcessing(false);  // Stop processing whether it worked or failed
      console.log('Loading set to FALSE because: copy or download');
    }
  };


// Share is only on mobile 
  const handleShare = async () => {
    if (!frogImage) {
      alert('Please wait for your frog to finish loading before sharing.');
      return;
    }
    
    try {
        // Get the blob either from state or fetch it
        const blob = frogImage.blob || await (await fetch(frogImage.url)).blob();

        // Create files array for sharing 
        const filesArray = [
            new File([blob], 'frog.png', { type: blob.type })
        ];

        await navigator.share({
            files: filesArray,
            text: message
        });
    } catch (error) {
        console.error('Error sharing:', error);
        
        if (error.name === 'AbortError') {
            // User cancelled the share - no need for message
            return;
        }
        
        // Either permissions aren't granted or the browser's share feature is blocked
        if (error.name === 'NotAllowedError') {
            alert('Please allow sharing in your browser settings to share your frog.');
            return;
        }
        
        // Other errors are likely related to the image itself (blob creation, file issues, etc)
        alert('There was a problem preparing your frog for sharing. Please try again.');
    }
  };

  // Conditional rendering for the share button
  const showShareButton = isMobile && navigator.share;

  return (
    <>
      <Head>
        <title>Diego&apos;s Frogs</title>
        <meta name="description" content="Create a frog to send with your text. Inspired by Diego Rivera&apos;s frog drawings sent to Frida Kahlo." />
        <meta name="keywords" content="frogs, Inspired by Diego Rivera&apos;s frog drawings sent to Frida Kahlo" />
        <meta name="author" content="Alden" />


        <meta property="og:title" content="Diego's Frogs" />
        <meta property="og:description" content="Create a frog to send with your text. Inspired by Diego Rivera&apos;s frog drawings sent to Frida Kahlo." />
        <meta property="og:url" content="https://www.diegos-frogs.com" />
        <meta property="og:type" content="website" />
      </Head>
      <main className="min-h-screen p-8 bg-white dark:bg-gray-900">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
            Diego&apos;s Frogs
          </h1>

          {/* Loading state */}
          {loading && (
            <div 
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[9999]" 
              aria-live="polite" 
              role="status"
            >
              <LoadingSpinner />
            </div>
          )}

          {/* Creation state components */}
          {!frogImage && (
            <CreateFrog 
              message={message}
              loading={loading}
              onMessageChange={handleMessageChange}
              onSubmit={handleSubmit}
            />
          )}

          {/* Error state with softer colors */}
          {!frogImage && error && (
            <div 
              className="mt-4 p-4 text-red-600 bg-red-50 dark:bg-red-950 dark:text-red-200 rounded-lg"
              aria-live="assertive"
              role="alert"
            >
              {error}
            </div>
          )}

          {/* Display state components */}
          {frogImage && (
          <div className="rounded p-4 bg-gray-100 dark:bg-gray-800 mb-4 relative">
            <button 
              onClick={resetState}
              className="absolute -top-2 -right-2 w-10 h-10 bg-gray-500 text-white hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 rounded-full flex items-center justify-center text-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 z-10"
              aria-label="Reset"
            >
              &times;
            </button>
            <FrogImage frogImage={frogImage} />
          </div>
          )}
          
          {/* Action buttons on display */}
          {frogImage && (
            <div className="flex flex-col gap-4">
              <DownloadButton 
              onClick={handleCopyOrDownload} 
              disabled={!frogImage}
              isProcessing={isDownloadProcessing}
            />
             {/* Conditional buttons */}
            {showShareButton && (
              <MobileShareButton handleShare={handleShare} />
            )}
          </div>
        )}
      </div>
    </main>
  </>
)
}