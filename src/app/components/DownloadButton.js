'use client'
export default function DownloadButton({ onClick, isProcessing, disabled }) {
  return (
    <button 
      onClick={onClick}
      disabled={isProcessing || disabled} // Disable if processing or disabled 
      className="mt-4 bg-gray-500 text-white px-4 py-2 rounded 
                 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700
                 flex items-center justify-center gap-2
                 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isProcessing ? 'Processing...' : 'Copy/Download'} {/* Text if processing is processing */}
    </button>
  );
}
