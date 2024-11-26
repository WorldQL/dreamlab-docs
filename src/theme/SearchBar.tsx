import React, { useState } from 'react';

export default function SearchBar(): JSX.Element {
  const [query, setQuery] = useState('');

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && query.trim()) {
      const searchUrl = `https://www.google.com/search?q=site:docs.dreamlab.gg+${encodeURIComponent(query)}`;
      window.open(searchUrl, '_blank');
    }
  };

  return (
    <input
      type="text"
      placeholder="Search"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      onKeyPress={handleKeyPress}
      style={{
        maxWidth: '150px',
        padding: '0.4rem 0.5rem',
        borderRadius: '0.5rem',
        border: '1px solid gray',
      }}
    />
  );
}
