'use client';

export default function CreateFrog({ message, loading, onMessageChange, onSubmit }) {
  return (
    // Form submit to generate frog 
    <form onSubmit={onSubmit} className="mb-8">
      {/* The div that has the input and the clear button - relative positioning*/}
      <div className="relative">
         {/* Label for screen readers*/}
        <label htmlFor="frogMessage" className="sr-only">
          Message for your frog
        </label>
         {/* Text input field that updates message state on change */}
        <input
          id="frogMessage"
          type="text"
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          placeholder="Your message for the frog to convey"
          className="w-full p-2 border rounded mb-4 
                     bg-white text-gray-900          
                     dark:bg-gray-800 dark:text-white  
                     border-gray-300 dark:border-gray-600
                     placeholder-gray-500 dark:placeholder-gray-400
                     pr-8"
          required
        />
        {/* If there is a message typed, make clear button visible to reset input*/}
        {message && (
          <button
            type="button"
            onClick={() => onMessageChange('')}
            className="absolute right-2 top-2 text-gray-500 hover:text-gray-700 
                       dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="Clear input"
          >
            ×
          </button>
        )}
      </div>
      {/* Submit button to generate frog - disabled if loading*/}
      <button 
        type="submit"
        disabled={loading}
        className="bg-green-500 hover:bg-green-600    
                   dark:bg-green-600 dark:hover:bg-green-700  
                   text-white px-4 py-2 rounded 
                   disabled:opacity-50"
      >
        Create Frog!
      </button>
    </form>
  );
}
