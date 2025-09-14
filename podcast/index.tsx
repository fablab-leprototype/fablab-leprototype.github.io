/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { GoogleGenAI, Type } from '@google/genai';
import { useState } from 'react';
import ReactDOM from 'react-dom/client';

const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

function App() {
  const [topic, setTopic] = useState('');
  const [language, setLanguage] = useState('French');
  const [podcast, setPodcast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generatePodcast = async (e) => {
    e.preventDefault();
    if (!topic) {
      setError('Please enter a topic.');
      return;
    }

    setLoading(true);
    setPodcast(null);
    setError(null);

    const schema = {
      type: Type.OBJECT,
      properties: {
        title: {
          type: Type.STRING,
          description: "The title of the podcast episode."
        },
        introduction: {
          type: Type.STRING,
          description: "A brief introduction to the topic."
        },
        segments: {
          type: Type.ARRAY,
          description: "An array of strings, where each string is a talking point or segment of the podcast.",
          items: {
            type: Type.STRING
          }
        },
        outro: {
          type: Type.STRING,
          description: "A concluding paragraph for the podcast."
        }
      },
      required: ["title", "introduction", "segments", "outro"]
    };


    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Generate a short podcast script about "${topic}" in ${language}.`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: schema,
        }
      });
      
      const podcastData = JSON.parse(response.text);
      setPodcast(podcastData);
    } catch (e) {
      setError('Failed to generate podcast. Please try again.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container">
      <header>
        <h1>AI Podcast Script Generator</h1>
        <p>Enter a topic and get a podcast script in your chosen language.</p>
      </header>
      <form onSubmit={generatePodcast} className="generator-form">
        <div className="form-group">
          <label htmlFor="topic">Topic</label>
          <input
            id="topic"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., The history of coffee"
            aria-label="Podcast topic"
          />
        </div>
        <div className="form-group">
          <label htmlFor="language">Language</label>
          <select id="language" value={language} onChange={(e) => setLanguage(e.target.value)} aria-label="Select language">
            <option value="French">French</option>
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="German">German</option>
          </select>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Podcast'}
        </button>
      </form>

      {error && <div className="error-message" role="alert">{error}</div>}

      {loading && <div className="loading-indicator" aria-live="polite">Creating your podcast script...</div>}

      {podcast && (
        <article className="podcast-script" aria-labelledby="podcast-title">
          <h2 id="podcast-title">{podcast.title}</h2>
          <section>
            <h3>Introduction</h3>
            <p>{podcast.introduction}</p>
          </section>
          <section>
            <h3>Segments</h3>
            <ul>
              {podcast.segments.map((segment, index) => (
                <li key={index}>{segment}</li>
              ))}
            </ul>
          </section>
          <section>
            <h3>Outro</h3>
            <p>{podcast.outro}</p>
          </section>
        </article>
      )}
    </main>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
