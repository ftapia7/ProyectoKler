import uniIcon from '../assets/uni.png'
import cuatriIcon from '../assets/cuatri.png'
import userIcon from '../assets/user.png'

const homeCards = [
  {
    id: 'career',
    icon: uniIcon,
    alt: 'Icono de carrera universitaria',
    title: 'Ingenieria',
    subtitle: 'Informatica',
  },
  {
    id: 'term',
    icon: cuatriIcon,
    alt: 'Icono de calendario academico',
    title: 'Cuatrimestre',
    subtitle: 'VIII',
  },
  {
    id: 'student',
    icon: userIcon,
    alt: 'Icono del estudiante',
    title: 'Jimena',
    subtitle: 'Rojas',
  },
]

function Home({ onNavigate }) {
  return (
    <section className="hero-section">
      <h1>Bienvenido al sistema de matricula</h1>

      <div className="hero-cards">
        {homeCards.map((card) => (
          <article key={card.id} className="hero-card">
            <div className="hero-card__icon-wrap">
              <img src={card.icon} alt={card.alt} className="hero-card__icon" />
            </div>

            <div className="hero-card__text">
              <p>{card.title}</p>
              <p>{card.subtitle}</p>
            </div>
          </article>
        ))}
      </div>

      <p className="hero-section__description">
        Ingresa al sistema de matricula y revisa las materias disponibles para
        este cuatrimestre.
      </p>

      <button
        type="button"
        className="primary-button"
        onClick={() => onNavigate('horarios')}
      >
        Ir a matricula
      </button>
    </section>
  )
}

export default Home
