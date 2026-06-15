'use client'
export default function MobileShareButton({ handleShare }) {
    return (
        <button 
            onClick={handleShare}
            aria-label="Share Frog"
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded 
                      hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700
                      flex items-center justify-center gap-2"
        >
            Share Frog
        </button>
    )
}