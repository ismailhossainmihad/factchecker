import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const ViewFact = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [fact, setFact] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFact = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/facts/${id}`);
        setFact(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFact();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!fact) return <p>Fact not found.</p>;

  const isOwner = user && fact.createdBy && fact.createdBy._id === user.id;
  const verdictClass =
    fact.verdict === 'True'
      ? 'bg-green-100 text-green-800'
      : fact.verdict === 'False'
      ? 'bg-red-100 text-red-800'
      : fact.verdict === 'Misleading'
      ? 'bg-yellow-100 text-yellow-800'
      : 'bg-gray-100 text-gray-800';

  return (
    <div className="bg-white shadow rounded p-6">
      <h2 className="text-2xl font-semibold mb-2">{fact.title}</h2>
      <div className="flex items-center space-x-2 mb-2 text-sm">
        <span className={`px-2 py-1 rounded ${verdictClass}`}>{fact.verdict}</span>
        <span className="text-gray-600">Category: {fact.category}</span>
      </div>
      <p className="text-gray-700 mb-4">{fact.description}</p>
      {isOwner && (
        <div className="flex space-x-2 text-sm">
          <Link to={`/edit/${fact._id}`} className="text-blue-600 hover:underline">
            Edit
          </Link>
          <Link to="/dashboard" className="text-green-600 hover:underline">
            Back to Dashboard
          </Link>
        </div>
      )}
    </div>
  );
};

export default ViewFact;