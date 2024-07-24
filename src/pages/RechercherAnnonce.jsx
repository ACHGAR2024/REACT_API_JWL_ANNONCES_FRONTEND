import { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate, Link } from 'react-router-dom';

const RechercherAnnonce = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get('category') || '';

  const [announcements, setAnnouncements] = useState([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [sortOrder, setSortOrder] = useState('');

  // Fetching announcements
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const url = category
          ? `http://127.0.0.1:8000/api/announcements/category/${category}`
          : 'http://127.0.0.1:8000/api/announcements';
        
        const response = await axios.get(url, {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        });

        setAnnouncements(response.data.announcements || []);
        setFilteredAnnouncements(response.data.announcements || []);
      } catch (error) {
        console.error('Erreur lors de la récupération des annonces', error);
      }
    };

    fetchAnnouncements();
  }, [category]);

  // Filtering and sorting announcements
  useEffect(() => {
    let result = announcements;

    if (searchTerm) {
      result = result.filter(announcement =>
        announcement.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortOrder) {
      result = result.sort((a, b) =>
        sortOrder === 'asc' ? a.price - b.price : b.price - a.price
      );
    }

    setFilteredAnnouncements(result);
  }, [searchTerm, sortOrder, announcements]);

  // Handling category change
  const handleCategoryClick = (cat) => {
    setCategory(cat);
    navigate(`?category=${cat}`);
  };

  return (
    <div className="container mx-auto px-4 pt-24 mb-36">
      <div className="flex-col md:flex-row justify-between my-4 hidden md:block">
        <input
          type="text"
          placeholder="Rechercher..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded mb-4 md:mb-0 mr-2"
        />
        <select
          value={category}
          onChange={(e) => handleCategoryClick(e.target.value)}
          className="p-2 border rounded mb-4 md:mb-0 mr-2"
        >
          <option value="">Toutes les catégories</option>
          <option value="1">Logement</option>
          <option value="2">Véhicules</option>
          <option value="4">Emploi</option>
          <option value="5">Divers</option>
          <option value="6">Services</option>
          <option value="7">Formation</option>
        </select>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="p-2 border rounded mr-2"
        >
          <option value="">Trier par</option>
          <option value="asc">Prix croissant</option>
          <option value="desc">Prix décroissant</option>
        </select> <a href="/carte-annonces" ><button className="bg-slate-400 hover:bg-slate-800 text-white p-2 rounded" >
        Rechercher par carte
      </button></a> <a href="/lieux-annonces" ><button className="bg-slate-400 hover:bg-slate-800 text-white p-2 rounded m-2" >
        Rechercher par lieu
      </button></a>
      </div>
     
      <section className="py-15 mb-5 animate-slideIn mt-3">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {['1', '2', '4', '5', '6', '7'].map(cat => (
              <div
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow duration-300 cursor-pointer ${category === cat ? 'bg-gray-200' : ''}`}
              >
                <i className={`fa fa-${cat === '1' ? 'home' : cat === '2' ? 'car' : cat === '4' ? 'briefcase' : cat === '5' ? 'shopping-cart' : cat === '6' ? 'cog' : 'laptop'} mb-4 text-accent text-3xl`}></i>
                <h3 className="font-semibold">
                  {cat === '1' ? 'Logement' : cat === '2' ? 'Véhicules' : cat === '4' ? 'Emploi' : cat === '5' ? 'Divers' : cat === '6' ? 'Services' : 'Formation'}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredAnnouncements.map(announcement => (
          <Link key={announcement.id} to={`/fiche-annonce/${announcement.id}`}>
            <div className="bg-white rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:transform hover:-translate-y-2">
              <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(http://127.0.0.1:8000${announcement.photo})` }}></div>
              <div className="p-4">
                <div className="font-semibold mb-2">{announcement.title}</div>
                <div className="text-accent font-bold">{announcement.price} €</div>
              </div>
            </div>
          </Link>
        ))}
      </section>
      
    </div>
  );
};

export default RechercherAnnonce;
