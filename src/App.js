import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_KEY = 'patEimoMULapKUkwS.d52f3f7434b13efd1bbae793bf84590976d31529c1f561fa40f7c5cd56d2eeb8'; // Company 1 API key
  const BASE_ID = 'appjM0331R2gxUPeC'; // Company 1 base ID
  const TABLE_NAME = 'tbljveyyXwa2YDhsr'; // Company 1 table name

  const handleSearch = async () => {
    setLoading(true);
    setResult(null);
    try {
      const response = await axios.get(
        `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}?filterByFormula=SEARCH("${query.toLowerCase()}", LOWER({batchnumber}))`,
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
          },
        }
      );
      const records = response.data.records;
      if (records.length > 0) {
        setResult(records[0].fields);
      } else {
        setResult({ error: 'No record found for this Batch Number' });
      }
    } catch (error) {
      console.log(error.response);
      setResult({ error: 'Error fetching data from Airtable' });
    }
    setLoading(false);
  };

  return (
    <div className="App">
      <img src="/Trip-Logo.jpg" alt="Trip Logo" className="logo" />
      <h1>Trip Testing Lookup</h1>
      <div className="search-container">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter Batch Number (e.g., 0220gr11cbz)"
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>
      {result && (
        <div className="result">
          {result.error ? (
            <p>{result.error}</p>
          ) : (
            <>
              <ul className="details">
                <li><strong>Batch Number:</strong> {result['batchnumber']}</li>
                <li>
                  <strong>Public Notes:</strong> {result['publicnotes'] || 'N/A'}
                  <br />
                  <a
                    href="https://drive.google.com/drive/folders/1WB86KIZGmO-gvZyUlI2gmgilUrRbrA8e?usp=sharing" // Company 1 Google Doc
                    target="_blank"
                    rel="noopener noreferrer"
                    className="dist-link"
                  >
                    Distribution Chain
                  </a>
                </li>
              </ul>
              <div className="pdf-container">
                <div className="pdf-item">
                  {result['PDF1'] && (
                    <>
                      <img
                        src={result['PDF1'][0].thumbnails?.large?.url || result['PDF1'][0].url}
                        alt="Cover Page Preview"
                        className="pdf-preview"
                      />
                      <a href={result['PDF1'][0].url} target="_blank" rel="noopener noreferrer">
                        View Cover Page
                      </a>
                    </>
                  )}
                  {!result['PDF1'] && <p>No Cover Page Available</p>}
                </div>
                <div className="pdf-item">
                  {result['PDF2'] && (
                    <>
                      <img
                        src={result['PDF2'][0].thumbnails?.large?.url || result['PDF2'][0].url}
                        alt="Test Results Preview"
                        className="pdf-preview"
                      />
                      <a href={result['PDF2'][0].url} target="_blank" rel="noopener noreferrer">
                        View Test Results
                      </a>
                    </>
                  )}
                  {!result['PDF2'] && <p>No Test Results Available</p>}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;