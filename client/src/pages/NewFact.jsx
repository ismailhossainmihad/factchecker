import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const NewFact = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    verdict: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const categories = ['Politics', 'Health', 'Science', 'Technology'];
  const verdicts = ['True', 'False', 'Misleading', 'Unverified'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/api/facts', formData);
      navigate('/dashboard');
    } catch (err) {
      const msg =
        err.response?.data?.errors?.[0]?.msg ||
        err.response?.data?.message ||
        'An error occurred';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow p-6 rounded">
      <h2 className="text-2xl font-semibold mb-4">New Fact</h2>
      {error && <p className="text-red-600 mb-3">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label className="block mb-2">
          Title
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="border p-2 rounded w-full mt-1"
            required
          />
        </label>
        <label className="block mb-2">
          Description
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="border p-2 rounded w-full mt-1"
            rows="4"
            required
          />
        </label>
        <label className="block mb-2">
          Category
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="border p-2 rounded w-full mt-1"
            required
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </label>
        <label className="block mb-4">
          Verdict
          <select
            name="verdict"
            value={formData.verdict}
            onChange={handleChange}
            className="border p-2 rounded w-full mt-1"
            required
          >
            <option value="">Select verdict</option>
            {verdicts.map((ver) => (
              <option key={ver} value={ver}>
                {ver}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Create'}
        </button>
      </form>
    </div>
  );
};

export default NewFact;