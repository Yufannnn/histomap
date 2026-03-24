import { useState, useEffect } from 'react';
import Lobby from './components/Lobby.jsx';
import Library from './components/Library.jsx';
import Timeline from './components/Timeline.jsx';
import Collections from './components/Collections.jsx';
import RoomNav from './components/RoomNav.jsx';
import './App.css';

const ROOMS = [
  { id: 'lobby', label: 'Lobby' },
  { id: 'library', label: 'The Library', icon: '📖' },
  { id: 'timeline', label: 'The Timeline', icon: '⏳' },
  { id: 'collections', label: 'Collections', icon: '🗂' },
];

function App() {
  const [room, setRoom] = useState('lobby');
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetch('/api/articles')
      .then((r) => r.json())
      .then(setArticles)
      .catch(() => {});
  }, []);

  function enterRoom(id) {
    setRoom(id);
    window.scrollTo({ top: 0 });
  }

  return (
    <div className="museum">
      {room !== 'lobby' && (
        <RoomNav rooms={ROOMS} active={room} onNavigate={enterRoom} />
      )}

      <div className="room-container" key={room}>
        {room === 'lobby' && (
          <Lobby onEnter={enterRoom} articleCount={articles.length} />
        )}
        {room === 'library' && (
          <Library articles={articles} />
        )}
        {room === 'timeline' && (
          <Timeline articles={articles} />
        )}
        {room === 'collections' && (
          <Collections articles={articles} />
        )}
      </div>
    </div>
  );
}

export default App;
