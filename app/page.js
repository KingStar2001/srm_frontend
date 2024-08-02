'use client';

import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [jsonInput, setJsonInput] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);

  // Function to validate JSON input
  const isValidJson = (str) => {
    try {
      const obj = JSON.parse(str);
      return obj && typeof obj === 'object' && obj.hasOwnProperty('data') && Array.isArray(obj.data);
    } catch (e) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!isValidJson(jsonInput)) {
      setError('Invalid JSON input');
      return;
    }
    
    try {
      const parsedData = JSON.parse(jsonInput);
      const res = await axios.post('http://127.0.0.1:8000/api/srm', { data: parsedData.data }, {
        headers: { 'Content-Type': 'application/json' }
      });
      setResponse(res.data);
    } catch (err) {
      console.error('Error details:', err.response ? err.response.data : err.message);
      setError('An error occurred while fetching data');
    }
  };

  const handleOptionChange = (e) => {
    const { value, checked } = e.target;
    setSelectedOptions((prevOptions) => {
      if (checked) {
        return [...prevOptions, value];
      } else {
        return prevOptions.filter((option) => option !== value);
      }
    });
  };

  const renderResponse = () => {
    if (!response) return null;

    const { numbers, alphabets, highest_alphabet } = response;

    return (
      <div>
        {selectedOptions.includes('Numbers') && (
          <div>
            <h3>Numbers:</h3>
            <pre>{JSON.stringify(numbers, null, 2)}</pre>
          </div>
        )}
        {selectedOptions.includes('Alphabets') && (
          <div>
            <h3>Alphabets:</h3>
            <pre>{JSON.stringify(alphabets, null, 2)}</pre>
          </div>
        )}
        {selectedOptions.includes('Highest Alphabet') && (
          <div>
            <h3>Highest Alphabet:</h3>
            <pre>{JSON.stringify(highest_alphabet, null, 2)}</pre>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <h1>SRM Frontend</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          rows="4"
          cols="50"
          placeholder='Enter JSON like {"data": ["A", "B", "1", "2"]}'
        />
        <button type="submit">Submit</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {response && (
        <div>
          <h2>Response</h2>
          <div>
            <label>
              <input
                type="checkbox"
                value="Numbers"
                checked={selectedOptions.includes('Numbers')}
                onChange={handleOptionChange}
              />
              Numbers
            </label>
            <label>
              <input
                type="checkbox"
                value="Alphabets"
                checked={selectedOptions.includes('Alphabets')}
                onChange={handleOptionChange}
              />
              Alphabets
            </label>
            <label>
              <input
                type="checkbox"
                value="Highest Alphabet"
                checked={selectedOptions.includes('Highest Alphabet')}
                onChange={handleOptionChange}
              />
              Highest Alphabet
            </label>
          </div>
          {renderResponse()}
        </div>
      )}
    </div>
  );
}
