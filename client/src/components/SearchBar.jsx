import React from 'react';

const SearchBar = ({ search, category, verdict, onChange }) => {
  const categories = ['', 'Politics', 'Health', 'Science', 'Technology'];
  const verdicts = ['', 'True', 'False', 'Misleading', 'Unverified'];

  return (
    <div className="bg-white shadow p-4 mb-6 rounded flex flex-col md:flex-row md:space-x-4">
      <input
        type="text"
        value={search}
        onChange={(e) => onChange({ search: e.target.value })}
        placeholder="Search..."
        className="border p-2 rounded flex-1 mb-2 md:mb-0"
      />
      <select
        value={category}
        onChange={(e) => onChange({ category: e.target.value })}
        className="border p-2 rounded mb-2 md:mb-0"
      >
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat || 'All Categories'}
          </option>
        ))}
      </select>
      <select
        value={verdict}
        onChange={(e) => onChange({ verdict: e.target.value })}
        className="border p-2 rounded"
      >
        {verdicts.map((ver) => (
          <option key={ver} value={ver}>
            {ver || 'All Verdicts'}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SearchBar;