import { useState, useEffect } from 'react';
import Lobby from './components/Lobby.jsx';
import Library from './components/Library.jsx';
import Collections from './components/Collections.jsx';
import RoomNav from './components/RoomNav.jsx';
import './App.css';

const copy = {
  zh: {
    brand: '阅读档案馆',
    rooms: {
      lobby: '首页',
      library: '藏书',
      collections: '分类',
    },
    icons: {
      library: '书',
      collections: '架',
    },
    languageLabel: '语言',
    langPrimary: '中文',
    langSecondary: 'EN',
  },
  en: {
    brand: 'Reading Archive',
    rooms: {
      lobby: 'Lobby',
      library: 'Library',
      collections: 'Shelves',
    },
    icons: {
      library: 'LIB',
      collections: 'TAG',
    },
    languageLabel: 'Language',
    langPrimary: '中文',
    langSecondary: 'EN',
  },
};

function App() {
  const [room, setRoom] = useState('lobby');
  const [books, setBooks] = useState([]);
  const [lang, setLang] = useState('zh');

  useEffect(() => {
    fetch('/api/books')
      .then((r) => r.json())
      .then(setBooks)
      .catch(() => {});
  }, []);

  function enterRoom(id) {
    setRoom(id);
    window.scrollTo({ top: 0 });
  }

  const t = copy[lang];
  const rooms = [
    { id: 'lobby', label: t.rooms.lobby },
    { id: 'library', label: t.rooms.library },
    { id: 'collections', label: t.rooms.collections },
  ];

  return (
    <div className="museum">
      <RoomNav
        rooms={rooms}
        active={room}
        onNavigate={enterRoom}
        brand={t.brand}
        lang={lang}
        setLang={setLang}
        languageLabel={t.languageLabel}
        primaryLabel={t.langPrimary}
        secondaryLabel={t.langSecondary}
      />

      <div className="room-container" key={`${room}-${lang}`}>
        {room === 'lobby' && <Lobby onEnter={enterRoom} bookCount={books.length} lang={lang} brand={t.brand} />}
        {room === 'library' && <Library books={books} lang={lang} />}
        {room === 'collections' && <Collections books={books} lang={lang} />}
      </div>
    </div>
  );
}

export default App;
