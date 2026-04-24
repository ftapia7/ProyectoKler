import klerLogo from '../assets/kler.png'
import { User } from 'lucide-react'
import { Avatar, AvatarFallback } from './ui/avatar.tsx'

const navItems = [
  {
    id: 'home',
    label: 'Inicio',
  },
  {
    id: 'horarios',
    label: 'Matricula',
  },
  {
    id: 'mi-horario',
    label: 'Mi Horario',
  },
]

function Navbar({ currentPage, onNavigate }) {
  return (
    <header className="navbar">
      <button
        type="button"
        className="navbar__brand"
        onClick={() => onNavigate('home')}
        aria-label="Ir a inicio"
      >
        <img src={klerLogo} alt="Logo de Kler" className="navbar__logo" />
      </button>

      <div className="navbar__right">
        <nav className="navbar__actions" aria-label="Navegacion principal">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`navbar__button ${currentPage === item.id ? 'active' : ''}`}
              onClick={() => onNavigate(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <Avatar className="navbar__avatar" size="lg">
          <AvatarFallback className="navbar__avatar-fallback">
            <User className="navbar__avatar-icon" />
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}

export default Navbar
