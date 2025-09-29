import React from 'react';
import { Link } from 'react-router-dom';

const FactCard = ({ fact }) => {
  // Determine badge styling based on verdict
  const verdictClass =
    fact.verdict === 'True'
      ? 'bg-green-100 text-green-800'
      : fact.verdict === 'False'
      ? 'bg-red-100 text-red-800'
      : fact.verdict === 'Misleading'
      ? 'bg-yellow-100 text-yellow-800'
      : 'bg-gray-100 text-gray-800';

  return (
    <div className="bg-white shadow rounded p-4 mb-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">{fact.title}</h3>
        <span className={`px-2 py-1 text-sm rounded ${verdictClass}`}>{fact.verdict}</span>
      </div>
      <p className="text-gray-700 mt-2 mb-4">
        {fact.description.length > 120
          ? `${fact.description.slice(0, 120)}...`
          : fact.description}
      </p>
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-500">Category: {fact.category}</span>
        <Link to={`/facts/${fact._id}`} className="text-blue-600 hover:underline">
          View
        </Link>
      </div>
    </div>
  );
};

export default FactCard;