import { useEffect } from 'react';

const Aide = () => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fadeIn');
        }
      });
    }, { threshold: 0.1 });

    setTimeout(() => {
      document.querySelectorAll('.animate-fadeIn').forEach(el => observer.observe(el));
    }, 100);

    return () => observer.disconnect();
  }, []);

  const sections = [
    {
      title: "Bienvenue sur AnnoncesExpress !",
      content: "Nous sommes ravis de vous avoir parmi nous. Ce guide vous aidera à tirer le meilleur parti de notre plateforme pour vendre vos articles rapidement et efficacement.",
      imageUrl: "https://images.unsplash.com/photo-1556155092-490a1ba16284?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80"
    },
    {
      title: "1. Créer votre compte",
      content: "La première étape pour devenir vendeur sur AnnoncesExpress est de créer votre compte. C'est simple et rapide !",
      imageUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
      listItems: [
        "Cliquez sur \"S'inscrire\" en haut à droite",
        "Remplissez le formulaire",
        "Vérifiez votre adresse e-mail",
        "Complétez votre profil"
      ]
    },
    {
      title: "2. Poster une annonce",
      content: "Une fois votre compte créé, vous pouvez commencer à poster des annonces :",
      imageUrl: "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
      listItems: [
        "Cliquez sur \"Déposer une annonce\"",
        "Choisissez la catégorie",
        "Ajoutez titre et description",
        "Fixez un prix compétitif",
        "Ajoutez des photos de qualité",
        "Vérifiez et publiez"
      ]
    },
    {
      title: "3. Optimiser votre annonce",
      content: "Pour maximiser vos chances de vente, suivez ces conseils :",
      imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
      listItems: [
        "Utilisez des mots-clés pertinents",
        "Soyez honnête sur l'état de l'article",
        "Prenez des photos de qualité",
        "Répondez rapidement aux questions",
        "Mettez à jour vos annonces régulièrement"
      ]
    },
    {
      title: "4. Gérer vos messages",
      content: "Une communication efficace est essentielle pour réussir vos ventes :",
      imageUrl: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
      listItems: [
        "Consultez régulièrement votre boîte de réception",
        "Répondez poliment et en détail",
        "Soyez ouvert à la négociation",
        "Proposez des horaires flexibles"
      ]
    },
    {
      title: "5. Finaliser une vente",
      content: "Lorsque vous avez trouvé un acheteur, suivez ces étapes :",
      imageUrl: "https://images.unsplash.com/photo-1582281171754-405cb2a75fb1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
      listItems: [
        "Convenez d'un lieu de rencontre sûr",
        "Vérifiez le paiement",
        "Fournissez un reçu si nécessaire",
        "Marquez l'annonce comme \"vendue\"",
        "Demandez un avis positif"
      ]
    }
  ];
  return (
    <div className="container mx-auto px-4 py-8 mb-32">
      <h1 className="text-3xl font-bold mb-6 text-center">Guide du Vendeur sur AnnoncesExpress</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sections.map((section, index) => (
          <div key={index} className="bg-white shadow-md rounded-lg overflow-hidden p-6 animate-fadeIn">
            <h2 className="text-2xl font-semibold mb-4">{section.title}</h2>
            <p className="mb-4">{section.content}</p>
            {section.listItems && (
              <ul className="list-disc list-inside mb-4">
                {section.listItems.map((item, itemIndex) => (
                  <li key={itemIndex}>{item}</li>
                ))}
              </ul>
            )}
            <img src={section.imageUrl} alt={section.title} className="w-full rounded-lg" width="300" height="200" />
          </div>
        ))}
        <div className="bg-white shadow-md rounded-lg overflow-hidden p-6 animate-fadeIn">
          <h2 className="text-2xl font-semibold mb-4">Besoin d aide supplémentaire ?</h2>
          <p className="mb-4">Si vous avez d autres questions ou si vous rencontrez des difficultés, n hésitez pas à contacter notre service client. Nous sommes là pour vous aider à réussir sur AnnoncesExpress !</p>
        <img src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80" alt="Support client" className="w-full rounded-lg mt-4" width="300" height="200" />
        </div>
      </div>
    </div>
  );
};

export default Aide;