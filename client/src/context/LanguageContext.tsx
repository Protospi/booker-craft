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
    examples: string;
    numChapters: string;
    numImages: string;
    apiKeyRequired: string;
    apiKeyRequiredDescription: string;
    error: string;
    errorDescription: string;
    themePlaceholder: string;
    languageEnglish: string;
    languageSpanish: string;
    languageFrench: string;
    languageGerman: string;
    languageItalian: string;
    languagePortuguese: string;
    languageJapanese: string;
    languageChinese: string;
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
  help: {
    title: string;
    subtitle: string;
    needMoreHelp: string;
    helpText: string;
    technicalIssues: string;
    gettingStarted: {
      title: string;
      content1: string;
      content2: string;
    };
    creatingBook: {
      title: string;
      intro: string;
      step1: string;
      step2: string;
      step3: string;
      step4: string;
      step5: string;
      tip: string;
    };
    managingBooks: {
      title: string;
      intro: string;
      action1: string;
      action2: string;
      action3: string;
    };
    generationProcess: {
      title: string;
      intro: string;
      phase1: string;
      phase2: string;
      phase3: string;
      phase4: string;
    };
    languageSettings: {
      title: string;
      content: string;
    };
  };
  about: {
    title: string;
    aiPowered: {
      title: string;
      content1: string;
      content2: string;
    };
    howItWorks: {
      title: string;
      content: string;
    };
    future: {
      title: string;
      content: string;
    };
    mission: {
      title: string;
      content: string;
    };
  };
  settings: {
    title: string;
    description: string;
    apiKey: {
      tabName: string;
      title: string;
      description: string;
      label: string;
      securityNote: string;
    };
    language: {
      tabName: string;
      english: string;
      portuguese: string;
      spanish: string;
    };
  };
  myBooks: {
    introWithBooks: string;
    introNoBooks: string;
    noBookTitle: string;
    noBookDescription: string;
    createFirstBook: string;
    backToList: string;
    bookDetails: {
      genre: string;
      chapters: string;
      pages: string;
      createdOn: string;
    };
    actions: {
      view: string;
      download: string;
      delete: string;
    };
    deleteDialog: {
      title: string;
      description: string;
      cancel: string;
      confirm: string;
    };
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
      length: 'Number of pages',
      ageGroup: 'Age Group',
      createButton: 'Create Book',
      backButton: 'Back',
      examples: 'Example books you can create:',
      numChapters: 'Number of Chapters',
      numImages: 'Number of Images',
      apiKeyRequired: 'API Key Required',
      apiKeyRequiredDescription: 'To generate a book, please provide an OpenAI API key in the settings.',
      error: 'Error',
      errorDescription: 'Failed to generate book. Please try again.',
      themePlaceholder: 'e.g., Cooking recipes, Science fiction, Travel guide...',
      languageEnglish: 'English',
      languageSpanish: 'Spanish',
      languageFrench: 'French',
      languageGerman: 'German',
      languageItalian: 'Italian',
      languagePortuguese: 'Portuguese',
      languageJapanese: 'Japanese',
      languageChinese: 'Chinese',
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
    help: {
      title: 'How to Use Booker',
      subtitle: 'Welcome to Booker! Here\'s a quick guide to help you create and manage your AI-generated books.',
      needMoreHelp: 'Need More Help?',
      helpText: 'We\'re constantly improving Booker to make book creation as seamless as possible. If you have any questions or suggestions, please don\'t hesitate to reach out!',
      technicalIssues: 'For technical issues, ensure your OpenAI API key is valid and has sufficient credits available. The quality of generated content depends on the specificity of your inputs and the capabilities of the underlying AI models.',
      gettingStarted: {
        title: 'Getting Started',
        content1: 'To begin creating books with Booker, you\'ll need to set up your OpenAI API key. Click the settings icon in the top-right corner and enter your API key in the provided field.',
        content2: 'Once your API key is set, you\'re ready to create your first book! Navigate to the home page and fill out the book creation form to get started.'
      },
      creatingBook: {
        title: 'Creating a Book',
        intro: 'To create a new book:',
        step1: 'Go to the Home page',
        step2: 'Fill out the book creation form with your desired settings',
        step3: 'Click "Create Book" to begin the generation process',
        step4: 'Wait for the AI to generate your book (this may take a few minutes)',
        step5: 'Once completed, you\'ll be redirected to view your new book',
        tip: 'The more specific you are with your inputs, the better the results will be!'
      },
      managingBooks: {
        title: 'Managing Your Books',
        intro: 'All your created books are saved in the "My Books" section. From there, you can:',
        action1: 'View any of your books',
        action2: 'Download books as PDF files for printing or sharing',
        action3: 'Delete books you no longer need'
      },
      generationProcess: {
        title: 'Book Generation Process',
        intro: 'Our AI follows a structured process to create your book:',
        phase1: 'Planning: The AI develops the overall structure, including title, subtitle, and chapter outline',
        phase2: 'Writing: Each chapter is written with engaging, coherent content based on your specifications',
        phase3: 'Illustrating: Images are generated to complement the text and enhance the visual appeal',
        phase4: 'Formatting: Everything is assembled into a professionally formatted book with proper layout'
      },
      languageSettings: {
        title: 'Language Settings',
        content: 'Booker supports multiple languages for the application interface. To change the language, click the settings icon in the top-right corner and select your preferred language from the options. You can also specify the language of your book content during the creation process.'
      }
    },
    about: {
      title: 'About Booker',
      aiPowered: {
        title: 'AI-Powered Book Creation',
        content1: 'Booker is a revolutionary platform that harnesses the power of artificial intelligence to create personalized, illustrated books tailored to your specifications. Our AI intelligent agents transform your ideas into fully realized literary works, complete with engaging narratives and beautiful illustrations.',
        content2: 'Whether you\'re looking to create educational material, children\'s stories, or creative fiction, our platform provides a seamless way to generate professional-quality books without the need for traditional publishing processes.'
      },
      howItWorks: {
        title: 'How It Works',
        content: 'Our AI technology combines advanced language models with state-of-the-art image generation capabilities to create cohesive, engaging books. You provide the theme, genre, and general direction, and our AI handles the rest – from crafting compelling narratives to generating illustrations that complement the text.'
      },
      future: {
        title: 'The Future of Book Creation',
        content: 'Booker represents the frontier of AI-assisted creativity. By democratizing the book creation process, we\'re opening new possibilities for storytelling, education, and creative expression. Our vision is to empower anyone to become an author and bring their unique ideas to life through the power of artificial intelligence.'
      },
      mission: {
        title: 'Our Mission',
        content: 'We believe that everyone has stories worth telling. Our mission is to break down the barriers to book creation and publishing, making it accessible to all. By leveraging AI technology, we\'re empowering individuals to express their creativity and share their knowledge with the world through beautifully crafted books.'
      }
    },
    settings: {
      title: 'Application Settings',
      description: 'Configure your application preferences',
      apiKey: {
        tabName: 'API Key',
        title: 'OpenAI API Key',
        description: 'Enter your OpenAI API key to use the application\'s AI features',
        label: 'API Key',
        securityNote: 'Your API key is stored securely in your browser and is only used for requests to OpenAI.'
      },
      language: {
        tabName: 'Language',
        english: 'English',
        portuguese: 'Portuguese',
        spanish: 'Spanish'
      }
    },
    myBooks: {
      introWithBooks: 'Here are all your created books. Click on any book to view it.',
      introNoBooks: 'You haven\'t created any books yet. Go to the home page to create your first book!',
      noBookTitle: 'No books found',
      noBookDescription: 'Start creating your first AI-powered book now',
      createFirstBook: 'Create Your First Book',
      backToList: 'Back to All Books',
      bookDetails: {
        genre: 'Genre',
        chapters: 'Chapters',
        pages: 'Pages',
        createdOn: 'Created on'
      },
      actions: {
        view: 'View',
        download: 'Download',
        delete: 'Delete'
      },
      deleteDialog: {
        title: 'Delete Book',
        description: 'Are you sure you want to delete "{title}"? This action cannot be undone.',
        cancel: 'Cancel',
        confirm: 'Delete'
      }
    }
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
      length: 'Número de páginas',
      ageGroup: 'Faixa Etária',
      createButton: 'Criar Livro',
      backButton: 'Voltar',
      examples: 'Exemplos de livros que você pode criar:',
      numChapters: 'Número de Capítulos',
      numImages: 'Número de Imagens',
      apiKeyRequired: 'Chave API Necessária',
      apiKeyRequiredDescription: 'Para gerar um livro, por favor forneça uma chave de API do OpenAI nas configurações.',
      error: 'Erro',
      errorDescription: 'Falha ao gerar livro. Por favor, tente novamente.',
      themePlaceholder: 'e.g., Receitas de cozinha, Ficção científica, Guia de viagens...',
      languageEnglish: 'Inglês',
      languageSpanish: 'Espanhol',
      languageFrench: 'Francês',
      languageGerman: 'Alemão',
      languageItalian: 'Italiano',
      languagePortuguese: 'Português',
      languageJapanese: 'Japonês',
      languageChinese: 'Chinês',
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
    help: {
      title: 'Como Usar o Booker',
      subtitle: 'Bem-vindo ao Booker! Aqui está um guia rápido para ajudá-lo a criar e gerenciar seus livros gerados por IA.',
      needMoreHelp: 'Precisa de Mais Ajuda?',
      helpText: 'Estamos constantemente melhorando o Booker para tornar a criação de livros o mais simples possível. Se você tiver alguma dúvida ou sugestão, não hesite em entrar em contato!',
      technicalIssues: 'Para problemas técnicos, verifique se sua chave de API OpenAI é válida e possui créditos suficientes disponíveis. A qualidade do conteúdo gerado depende da especificidade de suas entradas e das capacidades dos modelos de IA subjacentes.',
      gettingStarted: {
        title: 'Primeiros Passos',
        content1: 'Para começar a criar livros com o Booker, você precisará configurar sua chave de API OpenAI. Clique no ícone de configurações no canto superior direito e insira sua chave de API no campo fornecido.',
        content2: 'Depois que sua chave de API estiver configurada, você estará pronto para criar seu primeiro livro! Navegue até a página inicial e preencha o formulário de criação de livro para começar.'
      },
      creatingBook: {
        title: 'Criando um Livro',
        intro: 'Para criar um novo livro:',
        step1: 'Vá para a página Inicial',
        step2: 'Preencha o formulário de criação de livro com as configurações desejadas',
        step3: 'Clique em "Criar Livro" para iniciar o processo de geração',
        step4: 'Aguarde a IA gerar seu livro (isso pode levar alguns minutos)',
        step5: 'Após concluído, você será redirecionado para visualizar seu novo livro',
        tip: 'Quanto mais específico você for com suas entradas, melhores serão os resultados!'
      },
      managingBooks: {
        title: 'Gerenciando Seus Livros',
        intro: 'Todos os seus livros criados são salvos na seção "Meus Livros". A partir daí, você pode:',
        action1: 'Visualizar qualquer um de seus livros',
        action2: 'Baixar livros como arquivos PDF para impressão ou compartilhamento',
        action3: 'Excluir livros que você não precisa mais'
      },
      generationProcess: {
        title: 'Processo de Geração de Livros',
        intro: 'Nossa IA segue um processo estruturado para criar seu livro:',
        phase1: 'Planejamento: A IA desenvolve a estrutura geral, incluindo título, subtítulo e esboço de capítulos',
        phase2: 'Escrita: Cada capítulo é escrito com conteúdo envolvente e coerente com base em suas especificações',
        phase3: 'Ilustração: Imagens são geradas para complementar o texto e aprimorar o apelo visual',
        phase4: 'Formatação: Tudo é montado em um livro profissionalmente formatado com layout adequado'
      },
      languageSettings: {
        title: 'Configurações de Idioma',
        content: 'O Booker suporta vários idiomas para a interface do aplicativo. Para alterar o idioma, clique no ícone de configurações no canto superior direito e selecione seu idioma preferido nas opções. Você também pode especificar o idioma do conteúdo do seu livro durante o processo de criação.'
      }
    },
    about: {
      title: 'Sobre o Booker',
      aiPowered: {
        title: 'Criação de Livros com IA',
        content1: 'Booker é uma plataforma revolucionária que utiliza o poder da inteligência artificial para criar livros personalizados e ilustrados adaptados às suas especificações. Nossos agentes inteligentes de IA transformam suas ideias em obras literárias completas, com narrativas envolventes e belas ilustrações.',
        content2: 'Se você deseja criar material educativo, histórias infantis ou ficção criativa, nossa plataforma fornece uma maneira simples de gerar livros de qualidade profissional sem a necessidade de processos tradicionais de publicação.'
      },
      howItWorks: {
        title: 'Como Funciona',
        content: 'Nossa tecnologia de IA combina modelos avançados de linguagem com recursos de geração de imagens de última geração para criar livros coesos e envolventes. Você fornece o tema, gênero e direção geral, e nossa IA cuida do resto – desde a elaboração de narrativas envolventes até a geração de ilustrações que complementam o texto.'
      },
      future: {
        title: 'O Futuro da Criação de Livros',
        content: 'Booker representa a fronteira da criatividade assistida por IA. Ao democratizar o processo de criação de livros, estamos abrindo novas possibilidades para narração de histórias, educação e expressão criativa. Nossa visão é capacitar qualquer pessoa a se tornar um autor e dar vida às suas ideias únicas através do poder da inteligência artificial.'
      },
      mission: {
        title: 'Nossa Missão',
        content: 'Acreditamos que todos têm histórias que valem a pena contar. Nossa missão é derrubar as barreiras para a criação e publicação de livros, tornando-as acessíveis a todos. Ao aproveitar a tecnologia de IA, estamos capacitando indivíduos a expressar sua criatividade e compartilhar seu conhecimento com o mundo através de livros lindamente elaborados.'
      }
    },
    settings: {
      title: 'Configurações do Aplicativo',
      description: 'Configure suas preferências do aplicativo',
      apiKey: {
        tabName: 'Chave API',
        title: 'Chave API OpenAI',
        description: 'Insira sua chave API OpenAI para usar os recursos de IA do aplicativo',
        label: 'Chave API',
        securityNote: 'Sua chave API é armazenada com segurança em seu navegador e é usada apenas para solicitações à OpenAI.'
      },
      language: {
        tabName: 'Idioma',
        english: 'Inglês',
        portuguese: 'Português',
        spanish: 'Espanhol'
      }
    },
    myBooks: {
      introWithBooks: 'Aqui estão todos os seus livros criados. Clique em qualquer livro para visualizá-lo.',
      introNoBooks: 'Você ainda não criou nenhum livro. Vá para a página inicial para criar seu primeiro livro!',
      noBookTitle: 'Nenhum livro encontrado',
      noBookDescription: 'Comece a criar seu primeiro livro com IA agora',
      createFirstBook: 'Criar Seu Primeiro Livro',
      backToList: 'Voltar para Todos os Livros',
      bookDetails: {
        genre: 'Gênero',
        chapters: 'Capítulos',
        pages: 'Páginas',
        createdOn: 'Criado em'
      },
      actions: {
        view: 'Visualizar',
        download: 'Baixar',
        delete: 'Excluir'
      },
      deleteDialog: {
        title: 'Excluir Livro',
        description: 'Tem certeza que deseja excluir "{title}"? Esta ação não pode ser desfeita.',
        cancel: 'Cancelar',
        confirm: 'Excluir'
      }
    }
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
      length: 'Número de páginas',
      ageGroup: 'Grupo de Edad',
      createButton: 'Crear Libro',
      backButton: 'Volver',
      examples: 'Ejemplos de libros que puedes crear:',
      numChapters: 'Número de Capítulos',
      numImages: 'Número de Imágenes',
      apiKeyRequired: 'Clave API Requerida',
      apiKeyRequiredDescription: 'Para generar un libro, por favor proporciona una clave de API de OpenAI en las configuraciones.',
      error: 'Error',
      errorDescription: 'Error al generar libro. Por favor, inténtelo de nuevo.',
      themePlaceholder: 'e.g., Cocina, Ciencia ficción, Guía de viajes...',
      languageEnglish: 'Inglés',
      languageSpanish: 'Español',
      languageFrench: 'Francés',
      languageGerman: 'Alemán',
      languageItalian: 'Italiano',
      languagePortuguese: 'Portugués',
      languageJapanese: 'Japonés',
      languageChinese: 'Chino',
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
    help: {
      title: 'Cómo Usar Booker',
      subtitle: '¡Bienvenido a Booker! Aquí hay una guía rápida para ayudarte a crear y gestionar tus libros generados por IA.',
      needMoreHelp: '¿Necesitas Más Ayuda?',
      helpText: 'Estamos mejorando constantemente Booker para hacer que la creación de libros sea lo más fluida posible. Si tienes alguna pregunta o sugerencia, ¡no dudes en contactarnos!',
      technicalIssues: 'Para problemas técnicos, asegúrate de que tu clave API de OpenAI sea válida y tenga suficientes créditos disponibles. La calidad del contenido generado depende de la especificidad de tus entradas y las capacidades de los modelos de IA subyacentes.',
      gettingStarted: {
        title: 'Primeros Pasos',
        content1: 'Para comenzar a crear libros con Booker, necesitarás configurar tu clave API de OpenAI. Haz clic en el ícono de configuración en la esquina superior derecha e ingresa tu clave API en el campo proporcionado.',
        content2: 'Una vez que tu clave API esté configurada, ¡estarás listo para crear tu primer libro! Navega a la página de inicio y completa el formulario de creación de libros para comenzar.'
      },
      creatingBook: {
        title: 'Creando un Libro',
        intro: 'Para crear un nuevo libro:',
        step1: 'Ve a la página de Inicio',
        step2: 'Completa el formulario de creación de libros con la configuración deseada',
        step3: 'Haz clic en "Crear Libro" para comenzar el proceso de generación',
        step4: 'Espera a que la IA genere tu libro (esto puede tomar unos minutos)',
        step5: 'Una vez completado, serás redirigido para ver tu nuevo libro',
        tip: '¡Cuanto más específico seas con tus entradas, mejores serán los resultados!'
      },
      managingBooks: {
        title: 'Gestionando Tus Libros',
        intro: 'Todos tus libros creados se guardan en la sección "Mis Libros". Desde allí, puedes:',
        action1: 'Ver cualquiera de tus libros',
        action2: 'Descargar libros como archivos PDF para imprimir o compartir',
        action3: 'Eliminar libros que ya no necesitas'
      },
      generationProcess: {
        title: 'Proceso de Generación de Libros',
        intro: 'Nuestra IA sigue un proceso estructurado para crear tu libro:',
        phase1: 'Planificación: La IA desarrolla la estructura general, incluyendo título, subtítulo y esquema de capítulos',
        phase2: 'Escritura: Cada capítulo se escribe con contenido atractivo y coherente basado en tus especificaciones',
        phase3: 'Ilustración: Se generan imágenes para complementar el texto y mejorar el atractivo visual',
        phase4: 'Formateo: Todo se ensambla en un libro con formato profesional con un diseño adecuado'
      },
      languageSettings: {
        title: 'Configuración de Idioma',
        content: 'Booker admite varios idiomas para la interfaz de la aplicación. Para cambiar el idioma, haz clic en el ícono de configuración en la esquina superior derecha y selecciona tu idioma preferido de las opciones. También puedes especificar el idioma del contenido de tu libro durante el proceso de creación.'
      }
    },
    about: {
      title: 'Acerca de Booker',
      aiPowered: {
        title: 'Creación de Libros con IA',
        content1: 'Booker es una plataforma revolucionaria que aprovecha el poder de la inteligencia artificial para crear libros personalizados e ilustrados adaptados a tus especificaciones. Nuestros agentes inteligentes de IA transforman tus ideas en obras literarias completas, con narrativas atractivas y hermosas ilustraciones.',
        content2: 'Ya sea que estés buscando crear material educativo, cuentos infantiles o ficción creativa, nuestra plataforma proporciona una forma sencilla de generar libros de calidad profesional sin necesidad de procesos de publicación tradicionales.'
      },
      howItWorks: {
        title: 'Cómo Funciona',
        content: 'Nuestra tecnología de IA combina modelos de lenguaje avanzados con capacidades de generación de imágenes de vanguardia para crear libros cohesivos y atractivos. Tú proporcionas el tema, género y dirección general, y nuestra IA se encarga del resto – desde la creación de narrativas cautivadoras hasta la generación de ilustraciones que complementan el texto.'
      },
      future: {
        title: 'El Futuro de la Creación de Libros',
        content: 'Booker representa la frontera de la creatividad asistida por IA. Al democratizar el proceso de creación de libros, estamos abriendo nuevas posibilidades para la narración, la educación y la expresión creativa. Nuestra visión es empoderar a cualquier persona para que se convierta en autor y dé vida a sus ideas únicas a través del poder de la inteligencia artificial.'
      },
      mission: {
        title: 'Nuestra Misión',
        content: 'Creemos que todos tienen historias que vale la pena contar. Nuestra misión es derribar las barreras para la creación y publicación de libros, haciéndolas accesibles para todos. Al aprovechar la tecnología de IA, estamos capacitando a las personas para expresar su creatividad y compartir su conocimiento con el mundo a través de libros bellamente elaborados.'
      }
    },
    settings: {
      title: 'Configuración de la Aplicación',
      description: 'Configure sus preferencias de la aplicación',
      apiKey: {
        tabName: 'Clave API',
        title: 'Clave API de OpenAI',
        description: 'Ingrese su clave API de OpenAI para usar las funciones de IA de la aplicación',
        label: 'Clave API',
        securityNote: 'Su clave API se almacena de forma segura en su navegador y solo se utiliza para solicitudes a OpenAI.'
      },
      language: {
        tabName: 'Idioma',
        english: 'Inglés',
        portuguese: 'Portugués',
        spanish: 'Español'
      }
    },
    myBooks: {
      introWithBooks: 'Aquí están todos tus libros creados. Haz clic en cualquier libro para verlo.',
      introNoBooks: '¡Aún no has creado ningún libro. Ve a la página de inicio para crear tu primer libro!',
      noBookTitle: 'No se encontraron libros',
      noBookDescription: 'Comienza a crear tu primer libro con IA ahora',
      createFirstBook: 'Crear Tu Primer Libro',
      backToList: 'Volver a Todos los Libros',
      bookDetails: {
        genre: 'Género',
        chapters: 'Capítulos',
        pages: 'Páginas',
        createdOn: 'Creado el'
      },
      actions: {
        view: 'Ver',
        download: 'Descargar',
        delete: 'Eliminar'
      },
      deleteDialog: {
        title: 'Eliminar Libro',
        description: '¿Estás seguro de que quieres eliminar "{title}"? Esta acción no se puede deshacer.',
        cancel: 'Cancelar',
        confirm: 'Eliminar'
      }
    }
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