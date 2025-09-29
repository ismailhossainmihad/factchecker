import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';

const EditFact = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    verdict: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = ['Politics', 'Health', 'Science', 'Technology'];
  const verdicts = ['True', 'False', 'Misleading', 'Unverified'];

  useEffect(() => {
    const fetchFact = async () => {
      try {
        const res = await api.get(`/api/facts/${id}`);
        const { title, description, category, verdict } = res.data;
        setFormData({ title, description, category, verdict });
      } catch (err) {
        console.error(err);
      }
    };
    fetchFact();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.put(`/api/facts/${id}`, formData);
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
      <h2 className="text-2xl font-semibold mb-4">Edit Fact</h2>
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
          {loading ? 'Saving...' : 'Update'}
        </button>
      </form>
    </div>
  );
};

export default EditFact;