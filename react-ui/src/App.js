import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css';

function App() {
  const [urlConfig, setUrlConfig] = useState([]);
  const [pollInterval, setPollInterval] = useState(60);
  const [newUrl, setNewUrl] = useState('');
  const [newName, setNewName] = useState('');
  const [newKey, setNewKey] = useState('');

  useEffect(() => {
    axios.get('/api/config')
      .then(response => {
        setUrlConfig(response.data.urlConfig);
        setPollInterval(response.data.pollInterval / 1000);
      })
      .catch(error => console.error('Error fetching config:', error));
  }, []);

  const handleRefresh = (e) => {
    e.preventDefault();
    axios.post('/api/refresh', {  })
    .catch(error => console.error('Error updating config:', error));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('/api/config', {
      url: newUrl,
      name: newName,
      key: newKey,
      pollInterval: pollInterval * 1000
    })
    .then(response => {
      setUrlConfig(response.data.urlConfig);
      setNewUrl('');
      setNewName('');
      setNewKey('');
    })
    .catch(error => console.error('Error updating config:', error));
  };

  const handleDelete = (url) => {
    axios.delete('/api/config', { data: { url } })
      .then(response => {
        setUrlConfig(response.data.urlConfig);
      })
      .catch(error => console.error('Error deleting URL:', error));
  };

  return (
    <div className="container">
      <form>
        <button onClick={(e) => handleRefresh(e)}>Refresh</button>
      </form>

      <h2>Configured Elections</h2>
      <ul>
        {urlConfig.map((entry, index) => (
          <li key={index}>
            <strong>Name:</strong> {entry.name} <br />
            <button onClick={() => handleDelete(entry.url)}>Delete</button>
          </li>
        ))}
      </ul>

      <br />

      <h2>Configure New Google Sheet</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            New URL:
            <input
              type="url"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Name:
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Google API Key:
            <input
              type="text"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Refresh Time (seconds):
            <input
              type="number"
              value={pollInterval}
              onChange={(e) => setPollInterval(e.target.value)}
              required
            />
          </label>
        </div>
        <button type="submit">Add</button>
      </form>
    </div>
  );
}

export default App;