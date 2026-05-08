export type Language = 'en' | 'fr' | 'ar'

export const translations = {
  en: {
    // Navigation
    nav: {
      work: 'Work',
      about: 'About',
      services: 'Services',
      team: 'Team',
      contact: 'Contact',
      startProject: 'Start Project',
    },
    // Hero Section
    hero: {
      slides: [
        {
          label: '01 — Introduction',
          headline: ['logo', 'Advertising', 'Agency'],
          description: 'We craft bold stories and creative campaigns that elevate brands and drive real results.',
          accent: 'Your Vision, Our Expertise',
        },
        {
          label: '02 — Digital Marketing',
          headline: ['Digital', 'Marketing', 'Campaigns'],
          description: 'Strategic campaigns across social media, search, and display that target the right audience at the right time.',
          accent: 'Reach. Engage. Convert.',
        },
        {
          label: '03 — Graphic Design',
          headline: ['Graphic', 'Design', 'Excellence'],
          description: 'From brand identity to print materials, we create visuals that captivate and communicate your message.',
          accent: 'Visual Storytelling',
        },
        {
          label: '04 — Video Ads',
          headline: ['Video', 'Advertising', 'Production'],
          description: 'Compelling video content that tells your story and drives engagement across all platforms.',
          accent: 'Motion That Moves',
        },
        {
          label: '05 — Web Development',
          headline: ['Website', 'Development', 'Solutions'],
          description: 'Custom websites and web applications built for performance, aesthetics, and user experience.',
          accent: 'Digital Experiences',
        },
      ],
    },
    // About Section
    about: {
      profileLabel: 'Personal Profile',
      code: '(OZS — 05)',
      title: 'Visual Thinker',
      description1: 'Blending design and code with functional clarity and creative precision. Delivering thoughtful digital systems with structure, flow, and expressive interaction.',
      description2: 'We bridge creative direction with real-world execution, combining design and development into one seamless workflow to deliver digital experiences that are thoughtful, fast, and built to perform.',
      seeWorks: 'SEE WORKS',
      stats: {
        years: 'Years of Excellence',
        projects: 'Projects Delivered',
        clients: 'Global Clients',
      },
    },
    // Services Section
    services: {
      capabilitiesLabel: 'Capabilities',
      code: '(OZS — 04)',
      title: 'Digital Execution',
      servicesTitle: 'Services',
      items: [
        {
          number: '01',
          title: 'Art Direction',
          description: 'We guide every visual decision from start to finish, ensuring clarity, emotion, and impact across every touchpoint.',
          tags: ['Precise', 'Structured', 'Focused', 'Visual Language'],
        },
        {
          number: '02',
          title: 'Brand Identity',
          description: 'From strategy to execution, we shape consistent brand systems that speak clearly and feel uniquely ownable.',
          tags: ['Strategy', 'Visual Systems', 'Guidelines', 'Assets'],
        },
        {
          number: '03',
          title: 'Motion Direction',
          description: 'We use motion as a design tool — adding clarity, rhythm, and energy to digital experiences with intention.',
          tags: ['Animation', 'Transitions', 'Interaction', 'Flow'],
        },
        {
          number: '04',
          title: 'Web Development',
          description: 'Design meets execution with real-time, scalable websites — all crafted with modern frameworks for speed and precision.',
          tags: ['Next.js', 'React', 'Performance', 'Responsive'],
        },
        {
          number: '05',
          title: 'Social Media Marketing',
          description: 'Strategic presence across platforms. We create content that sparks conversations and builds communities.',
          tags: ['Content', 'Strategy', 'Growth', 'Engagement'],
        },
        {
          number: '06',
          title: 'Video Production',
          description: 'Cinematic storytelling that captures attention and hearts. We produce films that transform viewers into believers.',
          tags: ['Commercials', 'Documentaries', 'Reels', 'Production'],
        },
      ],
    },
    // Contact Section
    contact: {
      label: 'Contact',
      code: '(OZS — 11)',
      getInTouch: 'Get in Touch',
      headline: "Let's create something extraordinary together.",
      email: 'EMAIL',
      phone: 'PHONE',
      location: 'LOCATION',
      form: {
        name: 'Name',
        email: 'Email',
        company: 'Company',
        budget: 'Select Budget',
        message: 'Tell us about your project...',
        send: 'Send Message',
        sending: 'Sending...',
      },
    },
    // Footer
    footer: {
      tagline: 'Crafting digital experiences that inspire.',
      newsletter: 'Subscribe to our newsletter',
      emailPlaceholder: 'Enter your email',
      subscribe: 'Subscribe',
      quickLinks: 'Quick Links',
      followUs: 'Follow Us',
      rights: 'All rights reserved.',
    },
  },
  fr: {
    // Navigation
    nav: {
      work: 'Travaux',
      about: 'A Propos',
      services: 'Services',
      team: 'Equipe',
      contact: 'Contact',
      startProject: 'Demarrer un Projet',
    },
    // Hero Section
    hero: {
      slides: [
        {
          label: '01 — Introduction',
          headline: ['logo', 'Agence', 'Publicitaire'],
          description: 'Nous creons des histoires audacieuses et des campagnes creatives qui elevent les marques et generent des resultats reels.',
          accent: 'Votre Vision, Notre Expertise',
        },
        {
          label: '02 — Marketing Digital',
          headline: ['Campagnes', 'Marketing', 'Digital'],
          description: 'Des campagnes strategiques sur les reseaux sociaux, la recherche et l\'affichage qui ciblent le bon public au bon moment.',
          accent: 'Atteindre. Engager. Convertir.',
        },
        {
          label: '03 — Design Graphique',
          headline: ['Excellence', 'en Design', 'Graphique'],
          description: 'De l\'identite de marque aux supports imprimes, nous creons des visuels qui captivent et communiquent votre message.',
          accent: 'Narration Visuelle',
        },
        {
          label: '04 — Publicites Video',
          headline: ['Production', 'Publicitaire', 'Video'],
          description: 'Du contenu video captivant qui raconte votre histoire et stimule l\'engagement sur toutes les plateformes.',
          accent: 'Le Mouvement qui Inspire',
        },
        {
          label: '05 — Developpement Web',
          headline: ['Solutions', 'Developpement', 'Web'],
          description: 'Sites web et applications sur mesure construits pour la performance, l\'esthetique et l\'experience utilisateur.',
          accent: 'Experiences Digitales',
        },
      ],
    },
    // About Section
    about: {
      profileLabel: 'Profil Personnel',
      code: '(OZS — 05)',
      title: 'Penseur Visuel',
      description1: 'Melanger design et code avec clarte fonctionnelle et precision creative. Livrer des systemes digitaux reflechis avec structure, fluidite et interaction expressive.',
      description2: 'Nous relions la direction creative a l\'execution concrete, combinant design et developpement en un flux de travail fluide pour offrir des experiences digitales reflechies, rapides et performantes.',
      seeWorks: 'VOIR LES TRAVAUX',
      stats: {
        years: 'Annees d\'Excellence',
        projects: 'Projets Livres',
        clients: 'Clients Internationaux',
      },
    },
    // Services Section
    services: {
      capabilitiesLabel: 'Competences',
      code: '(OZS — 04)',
      title: 'Execution Digitale',
      servicesTitle: 'Services',
      items: [
        {
          number: '01',
          title: 'Direction Artistique',
          description: 'Nous guidons chaque decision visuelle du debut a la fin, assurant clarte, emotion et impact a chaque point de contact.',
          tags: ['Precis', 'Structure', 'Concentre', 'Langage Visuel'],
        },
        {
          number: '02',
          title: 'Identite de Marque',
          description: 'De la strategie a l\'execution, nous faconnons des systemes de marque coherents qui parlent clairement et sont uniques.',
          tags: ['Strategie', 'Systemes Visuels', 'Directives', 'Assets'],
        },
        {
          number: '03',
          title: 'Direction Motion',
          description: 'Nous utilisons le mouvement comme outil de design — ajoutant clarte, rythme et energie aux experiences digitales.',
          tags: ['Animation', 'Transitions', 'Interaction', 'Fluidite'],
        },
        {
          number: '04',
          title: 'Developpement Web',
          description: 'Le design rencontre l\'execution avec des sites web evolutifs — tous crees avec des frameworks modernes pour la vitesse et la precision.',
          tags: ['Next.js', 'React', 'Performance', 'Responsive'],
        },
        {
          number: '05',
          title: 'Marketing Reseaux Sociaux',
          description: 'Presence strategique sur toutes les plateformes. Nous creons du contenu qui suscite des conversations et construit des communautes.',
          tags: ['Contenu', 'Strategie', 'Croissance', 'Engagement'],
        },
        {
          number: '06',
          title: 'Production Video',
          description: 'Narration cinematographique qui capte l\'attention et les coeurs. Nous produisons des films qui transforment les spectateurs en croyants.',
          tags: ['Publicites', 'Documentaires', 'Reels', 'Production'],
        },
      ],
    },
    // Contact Section
    contact: {
      label: 'Contact',
      code: '(OZS — 11)',
      getInTouch: 'Contactez-nous',
      headline: 'Creons ensemble quelque chose d\'extraordinaire.',
      email: 'EMAIL',
      phone: 'TELEPHONE',
      location: 'ADRESSE',
      form: {
        name: 'Nom',
        email: 'Email',
        company: 'Entreprise',
        budget: 'Selectionnez le Budget',
        message: 'Parlez-nous de votre projet...',
        send: 'Envoyer le Message',
        sending: 'Envoi en cours...',
      },
    },
    // Footer
    footer: {
      tagline: 'Creer des experiences digitales qui inspirent.',
      newsletter: 'Abonnez-vous a notre newsletter',
      emailPlaceholder: 'Entrez votre email',
      subscribe: 'S\'abonner',
      quickLinks: 'Liens Rapides',
      followUs: 'Suivez-nous',
      rights: 'Tous droits reserves.',
    },
  },
  ar: {
    // Navigation
    nav: {
      work: 'اعمالنا',
      about: 'من نحن',
      services: 'خدماتنا',
      team: 'فريقنا',
      contact: 'اتصل بنا',
      startProject: 'ابدا مشروعك',
    },
    // Hero Section
    hero: {
      slides: [
        {
          label: '01 — مقدمة',
          headline: ['logo', 'وكالة', 'اعلانية'],
          description: 'نصنع قصصا جريئة وحملات ابداعية ترتقي بالعلامات التجارية وتحقق نتائج حقيقية.',
          accent: 'رؤيتك، خبرتنا',
        },
        {
          label: '02 — التسويق الرقمي',
          headline: ['حملات', 'التسويق', 'الرقمي'],
          description: 'حملات استراتيجية عبر وسائل التواصل الاجتماعي والبحث والعرض تستهدف الجمهور المناسب في الوقت المناسب.',
          accent: 'الوصول. التفاعل. التحويل.',
        },
        {
          label: '03 — التصميم الجرافيكي',
          headline: ['التميز', 'في التصميم', 'الجرافيكي'],
          description: 'من هوية العلامة التجارية الى المواد المطبوعة، نخلق صورا تاسر وتوصل رسالتك.',
          accent: 'السرد البصري',
        },
        {
          label: '04 — اعلانات الفيديو',
          headline: ['انتاج', 'الاعلانات', 'المرئية'],
          description: 'محتوى فيديو مقنع يروي قصتك ويحفز التفاعل عبر جميع المنصات.',
          accent: 'حركة تلهم',
        },
        {
          label: '05 — تطوير المواقع',
          headline: ['حلول', 'تطوير', 'المواقع'],
          description: 'مواقع وتطبيقات ويب مخصصة مبنية للاداء والجماليات وتجربة المستخدم.',
          accent: 'تجارب رقمية',
        },
      ],
    },
    // About Section
    about: {
      profileLabel: 'الملف الشخصي',
      code: '(OZS — 05)',
      title: 'مفكر بصري',
      description1: 'نمزج التصميم والبرمجة بوضوح وظيفي ودقة ابداعية. نقدم انظمة رقمية مدروسة بهيكل وتدفق وتفاعل معبر.',
      description2: 'نربط التوجيه الابداعي بالتنفيذ الواقعي، نجمع بين التصميم والتطوير في سير عمل سلس لتقديم تجارب رقمية مدروسة وسريعة ومبنية للاداء.',
      seeWorks: 'شاهد اعمالنا',
      stats: {
        years: 'سنوات من التميز',
        projects: 'مشروع منجز',
        clients: 'عميل دولي',
      },
    },
    // Services Section
    services: {
      capabilitiesLabel: 'القدرات',
      code: '(OZS — 04)',
      title: 'التنفيذ الرقمي',
      servicesTitle: 'الخدمات',
      items: [
        {
          number: '01',
          title: 'التوجيه الفني',
          description: 'نوجه كل قرار بصري من البداية الى النهاية، نضمن الوضوح والعاطفة والتاثير في كل نقطة اتصال.',
          tags: ['دقيق', 'منظم', 'مركز', 'لغة بصرية'],
        },
        {
          number: '02',
          title: 'هوية العلامة التجارية',
          description: 'من الاستراتيجية الى التنفيذ، نشكل انظمة علامات تجارية متسقة تتحدث بوضوح وتشعر بالتفرد.',
          tags: ['استراتيجية', 'انظمة بصرية', 'ارشادات', 'اصول'],
        },
        {
          number: '03',
          title: 'توجيه الحركة',
          description: 'نستخدم الحركة كاداة تصميم — نضيف الوضوح والايقاع والطاقة للتجارب الرقمية بقصد.',
          tags: ['رسوم متحركة', 'انتقالات', 'تفاعل', 'تدفق'],
        },
        {
          number: '04',
          title: 'تطوير الويب',
          description: 'التصميم يلتقي بالتنفيذ مع مواقع قابلة للتطوير — كلها مصنوعة بأطر عمل حديثة للسرعة والدقة.',
          tags: ['Next.js', 'React', 'اداء', 'متجاوب'],
        },
        {
          number: '05',
          title: 'تسويق وسائل التواصل',
          description: 'حضور استراتيجي عبر المنصات. نخلق محتوى يشعل المحادثات ويبني المجتمعات.',
          tags: ['محتوى', 'استراتيجية', 'نمو', 'تفاعل'],
        },
        {
          number: '06',
          title: 'انتاج الفيديو',
          description: 'سرد سينمائي يجذب الانتباه والقلوب. ننتج افلاما تحول المشاهدين الى مؤمنين.',
          tags: ['اعلانات', 'وثائقيات', 'ريلز', 'انتاج'],
        },
      ],
    },
    // Contact Section
    contact: {
      label: 'اتصل بنا',
      code: '(OZS — 11)',
      getInTouch: 'تواصل معنا',
      headline: 'لنصنع معا شيئا استثنائيا.',
      email: 'البريد الالكتروني',
      phone: 'الهاتف',
      location: 'العنوان',
      form: {
        name: 'الاسم',
        email: 'البريد الالكتروني',
        company: 'الشركة',
        budget: 'اختر الميزانية',
        message: 'اخبرنا عن مشروعك...',
        send: 'ارسال الرسالة',
        sending: 'جاري الارسال...',
      },
    },
    // Footer
    footer: {
      tagline: 'نصنع تجارب رقمية تلهم.',
      newsletter: 'اشترك في نشرتنا الاخبارية',
      emailPlaceholder: 'ادخل بريدك الالكتروني',
      subscribe: 'اشتراك',
      quickLinks: 'روابط سريعة',
      followUs: 'تابعنا',
      rights: 'جميع الحقوق محفوظة.',
    },
  },
} as const

export type Translations = typeof translations.en
