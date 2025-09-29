import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import FactCard from '../components/FactCard';
import SearchBar from '../components/SearchBar';

const Home = () => {
  const [facts, setFacts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [verdict, setVerdict] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchFacts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/facts', {
        params: {
          search: search || undefined,
          category: category || undefined,
          verdict: verdict || undefined,
          page,
          limit: 6,
        },
      });
      setFacts(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category, verdict, page]);

  const handleSearchChange = (fields) => {
    if (fields.search !== undefined) setSearch(fields.search);
    if (fields.category !== undefined) setCategory(fields.category);
    if (fields.verdict !== undefined) setVerdict(fields.verdict);
    setPage(1); // reset page when filters change
  };

  return (
    <div>
      <SearchBar
        search={search}
        category={category}
        verdict={verdict}
        onChange={handleSearchChange}
      />
      {loading ? (
        <p>Loading...</p>
      ) : facts.length === 0 ? (
        <p>No facts found.</p>
      ) : (
        facts.map((fact) => <FactCard key={fact._id} fact={fact} />)
      )}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-4">
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1}
            className="px-3 py-1 border rounded"
          >
            Prev
          </button>
          <span className="px-3 py-1">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page === totalPages}
            className="px-3 py-1 border rounded"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;