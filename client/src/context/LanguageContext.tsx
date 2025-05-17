import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define available languages
export type Language = 'en' | 'pt' | 'es';

// Define translation structure
export type Translations = {
  header: {
    home: string;
    myBooks: string;
    about: string;
    help: string;
  };
  languageSelection: {
    title: string;
    description: string;
    save: string;
    cancel: string;
  };
  home: {
    title: string;
    subtitle: string;
    createButton: string;
  };
  bookForm: {
    title: string;
    subtitle: string;
    genre: string;
    setting: string;
    theme: string;
    language: string;
    length: string;
    ageGroup: string;
    createButton: string;
    backButton: string;
  };
  bookViewer: {
    createNew: string;
    downloadPdf: string;
    nextPage: string;
    previousPage: string;
    tableOfContents: string;
  };
  generationProgress: {
    generating: string;
    step: string;
    planning: string;
    writing: string;
    illustrating: string;
    formatting: string;
  };
  notFound: {
    title: string;
    message: string;
  };
  footer: {
    copyright: string;
    terms: string;
    privacy: string;
  };
};

// Define the translation content
const translations: Record<Language, Translations> = {
  en: {
    header: {
      home: 'Home',
      myBooks: 'My Books',
      about: 'About',
      help: 'Help',
    },
    languageSelection: {
      title: 'Language Settings',
      description: 'Select your preferred language for the application interface',
      save: 'Save',
      cancel: 'Cancel',
    },
    home: {
      title: 'Create your AI-powered book',
      subtitle: 'Turn your ideas into beautifully illustrated stories in seconds',
      createButton: 'Create a Book',
    },
    bookForm: {
      title: 'Book Title',
      subtitle: 'Book Subtitle',
      genre: 'Genre',
      setting: 'Setting',
      theme: 'Theme',
      language: 'Language',
      length: 'Length',
      ageGroup: 'Age Group',
      createButton: 'Create Book',
      backButton: 'Back',
    },
    bookViewer: {
      createNew: 'Create New Book',
      downloadPdf: 'Download PDF',
      nextPage: 'Next Page',
      previousPage: 'Previous Page',
      tableOfContents: 'Table of Contents',
    },
    generationProgress: {
      generating: 'Generating your book',
      step: 'Step',
      planning: 'Planning your story',
      writing: 'Writing content',
      illustrating: 'Creating illustrations',
      formatting: 'Formatting book',
    },
    notFound: {
      title: '404 Page Not Found',
      message: 'The page you are looking for does not exist.',
    },
    footer: {
      copyright: '© 2025 Booker. All rights reserved.',
      terms: 'Terms of Service',
      privacy: 'Privacy Policy',
    },
  },
  pt: {
    header: {
      home: 'Início',
      myBooks: 'Meus Livros',
      about: 'Sobre',
      help: 'Ajuda',
    },
    languageSelection: {
      title: 'Configurações de Idioma',
      description: 'Selecione seu idioma preferido para a interface do aplicativo',
      save: 'Salvar',
      cancel: 'Cancelar',
    },
    home: {
      title: 'Crie seu livro com IA',
      subtitle: 'Transforme suas ideias em histórias lindamente ilustradas em segundos',
      createButton: 'Criar um Livro',
    },
    bookForm: {
      title: 'Título do Livro',
      subtitle: 'Subtítulo do Livro',
      genre: 'Gênero',
      setting: 'Cenário',
      theme: 'Tema',
      language: 'Idioma',
      length: 'Comprimento',
      ageGroup: 'Faixa Etária',
      createButton: 'Criar Livro',
      backButton: 'Voltar',
    },
    bookViewer: {
      createNew: 'Criar Novo Livro',
      downloadPdf: 'Baixar PDF',
      nextPage: 'Próxima Página',
      previousPage: 'Página Anterior',
      tableOfContents: 'Índice',
    },
    generationProgress: {
      generating: 'Gerando seu livro',
      step: 'Etapa',
      planning: 'Planejando sua história',
      writing: 'Escrevendo conteúdo',
      illustrating: 'Criando ilustrações',
      formatting: 'Formatando livro',
    },
    notFound: {
      title: '404 Página Não Encontrada',
      message: 'A página que você está procurando não existe.',
    },
    footer: {
      copyright: '© 2025 Booker. Todos os direitos reservados.',
      terms: 'Termos de Serviço',
      privacy: 'Política de Privacidade',
    },
  },
  es: {
    header: {
      home: 'Inicio',
      myBooks: 'Mis Libros',
      about: 'Acerca de',
      help: 'Ayuda',
    },
    languageSelection: {
      title: 'Configuración de Idioma',
      description: 'Seleccione su idioma preferido para la interfaz de la aplicación',
      save: 'Guardar',
      cancel: 'Cancelar',
    },
    home: {
      title: 'Crea tu libro con IA',
      subtitle: 'Convierte tus ideas en historias bellamente ilustradas en segundos',
      createButton: 'Crear un Libro',
    },
    bookForm: {
      title: 'Título del Libro',
      subtitle: 'Subtítulo del Libro',
      genre: 'Género',
      setting: 'Escenario',
      theme: 'Tema',
      language: 'Idioma',
      length: 'Longitud',
      ageGroup: 'Grupo de Edad',
      createButton: 'Crear Libro',
      backButton: 'Volver',
    },
    bookViewer: {
      createNew: 'Crear Nuevo Libro',
      downloadPdf: 'Descargar PDF',
      nextPage: 'Página Siguiente',
      previousPage: 'Página Anterior',
      tableOfContents: 'Índice',
    },
    generationProgress: {
      generating: 'Generando tu libro',
      step: 'Paso',
      planning: 'Planificando tu historia',
      writing: 'Escribiendo contenido',
      illustrating: 'Creando ilustraciones',
      formatting: 'Formateando libro',
    },
    notFound: {
      title: '404 Página No Encontrada',
      message: 'La página que estás buscando no existe.',
    },
    footer: {
      copyright: '© 2025 Booker. Todos los derechos reservados.',
      terms: 'Términos de Servicio',
      privacy: 'Política de Privacidad',
    },
  },
};

// Type for the language context
type LanguageContextType = {
  language: Language;
  t: Translations;
  changeLanguage: (lang: Language) => void;
};

// Create the context with a default value
const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  t: translations.en,
  changeLanguage: () => {},
});

// Custom hook to use the language context
export const useLanguage = () => useContext(LanguageContext);

// Provider component for the language context
type LanguageProviderProps = {
  children: ReactNode;
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Try to get language from localStorage, default to 'en'
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('app-language');
    return (savedLanguage as Language) || 'en';
  });

  // Update translations when language changes
  const t = translations[language];
  
  // Function to change the language
  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('app-language', lang);
  };
  
  // The context value
  const value = {
    language,
    t,
    changeLanguage,
  };
  
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};