import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Dashboard = () => {
  const [facts, setFacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchMyFacts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/facts/mine');
      setFacts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyFacts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this fact?')) return;
    try {
      await api.delete(`/api/facts/${id}`);
      setFacts(facts.filter((f) => f._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">My Facts</h2>
      {loading ? (
        <p>Loading...</p>
      ) : facts.length === 0 ? (
        <p>You have no facts yet.</p>
      ) : (
        facts.map((fact) => (
          <div key={fact._id} className="bg-white shadow rounded p-4 mb-4">
            <h3 className="text-xl font-semibold">{fact.title}</h3>
            <p className="text-gray-700 mt-2 mb-2">
              {fact.description.length > 150
                ? `${fact.description.slice(0, 150)}...`
                : fact.description}
            </p>
            <div className="flex space-x-2 text-sm">
              <Link to={`/edit/${fact._id}`} className="text-blue-600 hover:underline">
                Edit
              </Link>
              <button
                onClick={() => handleDelete(fact._id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
              <Link to={`/facts/${fact._id}`} className="text-green-600 hover:underline">
                View
              </Link>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Dashboard;