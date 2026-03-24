import './RoomNav.css';

function RoomNav({ rooms, active, onNavigate }) {
  return (
    <nav className="room-nav">
      {rooms.map((room) => (
        <button
          key={room.id}
          className={`room-tab ${active === room.id ? 'active' : ''}`}
          onClick={() => onNavigate(room.id)}
        >
          {room.icon && <span className="room-icon">{room.icon}</span>}
          <span className="room-label">{room.label}</span>
        </button>
      ))}
    </nav>
  );
}

export default RoomNav;
