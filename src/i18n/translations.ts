export type Language = "fr" | "en" | "es" | "de" | "it" | "pt" | "nl";

export interface Translations {
  appName: string;
  appSubtitle: string;
  tabs: {
    profile: string;
    ai?: string;
    jobOffer: string;
    coverLetter: string;
    atsTest: string;
    jobMatch?: string;
    interview?: string;
    guide: string;
    mcp: string;
  };
  theme: {
    toggle: string;
    dark: string;
    light: string;
  };
  actions: {
    save: string;
    saving: string;
    exportPdf: string;
    exportDocx?: string;
    importResume?: string;
    importing?: string;
    resetSample: string;
    addExperience: string;
    addSkillGroup: string;
    addEducation: string;
    addProject: string;
    addBullet: string;
    addKeyword: string;
    applySuggestion: string;
    viewPreview: string;
    generateLetter: string;
    generating: string;
    copy: string;
    copied: string;
    printLetter: string;
    launchAudit: string;
    analyzing: string;
  };
  form: {
    contact: string;
    experiences: string;
    skills: string;
    education: string;
    projects: string;
    languages: string;
    interests: string;
    fullName: string;
    jobTitle: string;
    email: string;
    phone: string;
    city: string;
    linkedin: string;
    photoUrl: string;
    summary: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    roleSummary: string;
    starBullets: string;
    category: string;
    level: string;
    keywords: string;
    school: string;
    degree: string;
    area: string;
    dateYear: string;
    projectName: string;
    projectDesc: string;
    sectionOrder?: string;
    contactSubtitle?: string;
    experiencesSubtitle?: string;
    educationSubtitle?: string;
    skillsSubtitle?: string;
    addHighlight?: string;
    domainName?: string;
    noExperience?: string;
    noEducation?: string;
    noSkills?: string;
    photoOn?: string;
    photoOff?: string;
    changePhoto?: string;
    addPhoto?: string;
    removePhoto?: string;
    photoNote?: string;
    summaryPlaceholder?: string;
    present?: string;
    in?: string;
    zoomIn?: string;
    zoomOut?: string;
  };
  ats: {
    overallScore: string;
    matchedKeywords: string;
    missingKeywords: string;
    starRecommendations: string;
    sectionBreakdown: string;
    currentVague: string;
    starOptimized: string;
    readyForSubmission: string;
    goodMatch: string;
    moderateMatch: string;
    poorMatch: string;
  };
  templates: {
    label: string;
    minimal: string;
    corporate: string;
    serif: string;
    darkMinimal: string;
  };
  atsTest: {
    title: string;
    subtitle: string;
    notepadTitle: string;
    notepadDesc: string;
    copyText: string;
    copiedText: string;
    checklistTitle: string;
    checkSingleColumn: string;
    checkStandardHeaders: string;
    checkBodyContact: string;
    checkDateConsistency: string;
    checkNoIcons: string;
    checkKeywordsInBullets: string;
    checkNoKeywordStuffing: string;
    checkJobTitleMatch: string;
    jobTitleMatchSuccess: string;
    jobTitleMatchWarning: string;
    summaryScore: string;
  };
  guide: {
    title: string;
    subtitle: string;
    mythTitle: string;
    mythText: string;
    realityTitle: string;
    realityText: string;
    fiveMinTitle: string;
    fiveMinText: string;
    prompt1Title: string;
    prompt1Text: string;
    prompt2Title: string;
    prompt2Text: string;
    prompt3Title: string;
    prompt3Text: string;
    goldenRulesTitle: string;
    close: string;
  };
  settings: {
    title: string;
    subtitle?: string;
    generalTab?: string;
    aiTab?: string;
    mcpTab?: string;
    provider: string;
    apiKey: string;
    model: string;
    endpoint: string;
    language: string;
    theme: string;
    cancel: string;
    save: string;
    removeKey?: string;
    savedKey?: string;
    themeLabel?: string;
    languageLabel?: string;
    localNote: string;
    securityTab?: string;
    vaultTitle?: string;
    vaultDesc?: string;
    promptInjectionTitle?: string;
    promptInjectionDesc?: string;
    docSanitizationTitle?: string;
    docSanitizationDesc?: string;
    strictValidationTitle?: string;
    strictValidationDesc?: string;
    devAlertsTitle?: string;
    devAlertsDesc?: string;
    usageLimitsTitle?: string;
    strictProfile?: string;
    balancedProfile?: string;
    customProfile?: string;
    privacyTitle?: string;
    retentionLabel?: string;
    retentionDesc?: string;
    clearCacheBtn?: string;
    clearTempBtn?: string;
    wipeAllBtn?: string;
    wipeConfirmTitle?: string;
    wipeConfirmDesc?: string;
    testConnectionBtn?: string;
    testingStatus?: string;
    saveSecurityBtn?: string;
    resetDefaultsBtn?: string;
  };
  interviewSim?: {
    title: string;
    subtitle: string;
    newSession: string;
    targetRoleLabel: string;
    targetRolePlaceholder: string;
    formatLabel: string;
    mixedLabel: string;
    mixedDesc: string;
    techLabel: string;
    techDesc: string;
    behavLabel: string;
    behavDesc: string;
    generalLabel: string;
    generalDesc: string;
    startBtn: string;
    generatingTitle: string;
    generatingDesc: string;
    questionOf: string;
    interviewerQuestion: string;
    contextLabel: string;
    yourAnswerLabel: string;
    answerPlaceholder: string;
    submitBtn: string;
    evaluatingTitle: string;
    evaluatingDesc: string;
    evalTitle: string;
    strengthsTitle: string;
    improvementsTitle: string;
    starTitle: string;
    nextBtn: string;
    finishBtn: string;
    summaryTitle: string;
    overallScore: string;
    restartBtn: string;
  };
  jobMatchPanel?: {
    title: string;
    subtitle: string;
    editOffers: string;
    offerPrefix: string;
    deleteOffer: string;
    jobTitleLabel: string;
    companyLabel: string;
    descLabel: string;
    descPlaceholder: string;
    addOfferBtn: string;
    compareBtn: string;
    comparingTitle: string;
    globalSummaryTitle: string;
    bestMatchBadge: string;
    atsMatchLabel: string;
    matchedSkills: string;
    missingSkills: string;
    strengthsTitle: string;
    recommendationsTitle: string;
    errorNeedDesc: string;
  };
  aiAssistant?: {
    title: string;
    generateResume: string;
    generateLetter: string;
    resumeParams: string;
    resumeSubtitle: string;
    targetRole: string;
    targetRolePlaceholder: string;
    experienceLevel: string;
    levelJunior: string;
    levelMid: string;
    levelSenior: string;
    levelLead: string;
    skillsKeywords: string;
    skillsPlaceholder: string;
    notes: string;
    notesPlaceholder: string;
    generatingResume: string;
    generateResumeBtn: string;
    letterParams: string;
    letterSubtitle: string;
    jobDescription: string;
    jobDescriptionPlaceholder: string;
    letterTone: string;
    toneProfessional: string;
    toneDirect: string;
    tonePassionate: string;
    letterInstructions: string;
    generatingLetter: string;
    generateLetterBtn: string;
    previewTitle: string;
    previewEmptyResume: string;
    previewEmptyLetter: string;
    applyResume: string;
    applyLetter: string;
    applied: string;
    requiresKey: string;
    configureAiBtn: string;
    fillRoleWarning: string;
    fillOfferWarning: string;
  };
}

export const translations: Record<Language, Translations> = {
  fr: {
    appName: "Open-CV",
    appSubtitle: "Optimiseur de CV ATS & Candidatures IA",
    tabs: {
      profile: "CV",
      ai: "IA",
      jobOffer: "Offre & Audit ATS",
      jobMatch: "Job Match",
      interview: "Entretien",
      coverLetter: "Lettre de Motivation",
      atsTest: "Test ATS",
      guide: "Guide ATS (Reddit)",
      mcp: "Client MCP",
    },
    theme: {
      toggle: "Thème",
      dark: "Sombre",
      light: "Clair",
    },
    actions: {
      save: "Enregistrer",
      saving: "Sauvegarde...",
      exportPdf: "Export PDF ATS",
      exportDocx: "Export Word (.docx)",
      importResume: "Importer un CV",
      importing: "Analyse du CV...",
      resetSample: "Modèle standard",
      addExperience: "Ajouter une expérience",
      addSkillGroup: "Nouveau groupe",
      addEducation: "Ajouter une formation",
      addProject: "Ajouter un projet",
      addBullet: "Ajouter une puce",
      addKeyword: "Ajouter",
      applySuggestion: "Appliquer au CV",
      viewPreview: "Voir CV Optimisé",
      generateLetter: "Générer la Lettre Ciblée",
      generating: "Rédaction IA en cours...",
      copy: "Copier",
      copied: "Copié !",
      printLetter: "Imprimer Lettre",
      launchAudit: "Lancer l'Audit ATS & Scoring IA",
      analyzing: "Analyse ATS & Scoring en cours...",
    },
    form: {
      contact: "Contact",
      experiences: "Expériences",
      skills: "Compétences",
      education: "Formations",
      projects: "Projets",
      languages: "Langues",
      interests: "Centres d'intérêt",
      fullName: "Nom Prénom",
      jobTitle: "Intitulé du poste recherché",
      email: "Adresse e-mail",
      phone: "Numéro de téléphone",
      city: "Ville, Pays",
      linkedin: "LinkedIn / Portfolio",
      photoUrl: "URL Photo (Optionnelle)",
      summary: "Résumé professionnel",
      company: "Entreprise",
      position: "Poste occupé",
      startDate: "Date début (AAAA-MM)",
      endDate: "Date fin (ou En cours)",
      roleSummary: "Missions & Contexte",
      starBullets: "Réalisations chiffrées (STAR)",
      category: "Catégorie",
      level: "Niveau",
      keywords: "Mots-clés (séparés par virgule)",
      school: "Établissement",
      degree: "Diplôme",
      area: "Spécialité",
      dateYear: "Année d'obtention",
      projectName: "Nom du projet",
      projectDesc: "Description & impact",
      sectionOrder: "Ordre des sections sur le CV",
      contactSubtitle: "Coordonnées de contact et synthèse professionnelle",
      experiencesSubtitle: "Missions et réalisations clés par ordre antéchronologique",
      educationSubtitle: "Diplômes universitaires, écoles ou certifications",
      skillsSubtitle: "Technologies, méthodologies et savoir-faire indexables",
      addHighlight: "+ Ajouter un point",
      domainName: "Nom du domaine",
      noExperience: "Aucune expérience ajoutée pour le moment.",
      noEducation: "Aucune formation ajoutée pour le moment.",
      noSkills: "Aucun groupe de compétences pour le moment.",
      photoOn: "Photo ON",
      photoOff: "Sans photo",
      changePhoto: "Changer la photo",
      addPhoto: "Ajouter une photo",
      removePhoto: "Supprimer",
      photoNote: "Optionnel. Les ATS privilégient les CV sans photo.",
      summaryPlaceholder: "Résumez brièvement votre valeur ajoutée, vos technologies maîtresses et vos accomplissements clés...",
      present: "Présent",
      in: "en",
      zoomIn: "Zoom avant",
      zoomOut: "Zoom arrière",
    },
    ats: {
      overallScore: "Score ATS Global",
      matchedKeywords: "Mots-clés Détectés",
      missingKeywords: "Mots-clés Manquants",
      starRecommendations: "Suggestions STAR (Impact)",
      sectionBreakdown: "Détail par Rubrique",
      currentVague: "Formulation actuelle (vague)",
      starOptimized: "Formulation STAR recommandée",
      readyForSubmission: "Excellente conformité ATS",
      goodMatch: "Bonne adéquation",
      moderateMatch: "Adéquation modérée",
      poorMatch: "Faible visibilité ATS",
    },
    templates: {
      label: "Modèle de CV :",
      minimal: "Minimaliste Épuré (Centré)",
      corporate: "Corporate & Analytique",
      serif: "Classique Serif (Exécutif)",
      darkMinimal: "Moderne Contrasté",
    },
    atsTest: {
      title: "Simulateur de Parsing ATS & Contrôle Technique",
      subtitle: "Vérifiez exactement ce que lit la machine (test Bloc-notes Notepad) et inspectez les points critiques identifiés par les recruteurs réels.",
      notepadTitle: "Test du Bloc-notes (Ce que lit réellement l'ATS)",
      notepadDesc: "Les parseurs ATS (Workday, Greenhouse, Lever, Taleo) convertissent votre CV en texte brut séquentiel. Si l'ordre ci-dessous est propre et sans symboles corrompus, votre CV passe 100% des parseurs.",
      copyText: "Copier le texte brut",
      copiedText: "Texte brut copié !",
      checklistTitle: "Checklist Technique Anti-Invisibilité",
      checkSingleColumn: "Mise en page 1 colonne stricte (pas de colonnes mélangées)",
      checkStandardHeaders: "Titres de sections standardisés (Expérience, Formation, Compétences)",
      checkBodyContact: "Coordonnées dans le corps du texte (pas masquées dans un en-tête Word)",
      checkDateConsistency: "Format des dates cohérent (ex: Jan 2022 - Mar 2024)",
      checkNoIcons: "Zéro emoji ou icône fantaisiste (évite les bugs de caractères U+260E)",
      checkKeywordsInBullets: "Mots-clés intégrés dans les puces d'action (pas juste isolés dans Compétences)",
      checkNoKeywordStuffing: "Densité idéale de mots-clés (25 à 35 termes sans bourrage)",
      checkJobTitleMatch: "Alignement de l'intitulé de poste avec l'offre (Boost x10,6)",
      jobTitleMatchSuccess: "L'intitulé de votre CV correspond parfaitement au poste ciblé.",
      jobTitleMatchWarning: "Attention : alignez l'intitulé de votre profil sur le titre exact de l'offre pour être trouvé par les recruteurs.",
      summaryScore: "Indice de conformité technique ATS",
    },
    guide: {
      title: "Guide ATS Réaliste : Ce qui compte vraiment selon les Recruteurs",
      subtitle: "Synthèse sans filtre des retours d'éditeurs d'ATS, de recruteurs de grands groupes et de candidats sur Reddit (r/developpeurs, r/resumes, r/jobsearchhell).",
      mythTitle: "Le Mythe du « Score 75% » des ATS",
      mythText: "Aucun ATS (Workday, Taleo, Greenhouse, Lever, RecrutOr) ne rejette automatiquement un CV sous un score arbitraire. Cette légende vient d'une campagne marketing de 2012 par une startup de CV aujourd'hui fermée. Les seuls vrais rejets automatiques sont les questions éliminatoires de formulaires (visa requis, diplôme légal obligatoire, prétention salariale hors budget).",
      realityTitle: "La Vérité : Le Risque de l'Invisibilité",
      realityText: "Dans 92% des cas, les recruteurs voient les candidatures triées par DATE d'arrivée et s'arrêtent souvent aux 50 premiers candidats. Si le poste est ouvert depuis longtemps ou qu'il y a 500 candidatures, ils tapent des MOTS-CLÉS EXACTS dans la barre de recherche interne de l'ATS. Si vos mots sont mal orthographiés ou synonymes, vous êtes tout simplement invisible au fond de la pile.",
      fiveMinTitle: "La Routine des 5 Minutes pour Postuler Tôt",
      fiveMinText: "Ne passez pas 2 heures à refaire votre CV entier. Adaptez uniquement le tiers supérieur : titre exact, résumé percutant et les 3 premières puces de votre expérience la plus récente. Cela vous permet de postuler dans les 24-48h.",
      prompt1Title: "Prompt 1 : Extraire le vocabulaire exact (1 min)",
      prompt1Text: "« Liste les 10 à 15 compétences, outils et expressions exactes qu'un recruteur taperait dans un ATS pour cette offre. Donne-moi aussi en 2 phrases le problème que cette équipe cherche à résoudre. »",
      prompt2Title: "Prompt 2 : Adapter le tiers supérieur (2 min)",
      prompt2Text: "« Réécris UNIQUEMENT mon titre, résumé et les 3 premières puces de mon dernier poste en utilisant le vocabulaire exact de l'offre avec des résultats chiffrés. N'invente AUCUNE expérience. »",
      prompt3Title: "Prompt 3 : Déterrer l'expérience oubliée (2 min)",
      prompt3Text: "« Compare mon CV et l'offre. Liste les exigences que je ne démontre pas clairement et pose-moi des questions pour faire ressortir une expérience passée que j'ai oubliée. »",
      goldenRulesTitle: "Règle d'or absolue",
      close: "Fermer le guide",
    },
    settings: {
      title: "Paramètres",
      subtitle: "Configuration générale, modèles d'IA et serveurs MCP",
      generalTab: "Général",
      aiTab: "Modèles & Clés IA",
      mcpTab: "Client MCP",
      provider: "Fournisseur d'IA",
      apiKey: "Clé API",
      model: "Modèle LLM",
      endpoint: "URL du serveur (Endpoint)",
      language: "Langue de l'interface",
      theme: "Thème d'affichage",
      cancel: "Annuler",
      save: "Enregistrer",
      removeKey: "Retirer la clé",
      savedKey: "Enregistrée",
      themeLabel: "Thème d'affichage",
      languageLabel: "Langue de l'interface",
      localNote: "100% Local & Hors-ligne. Aucune clé API requise pour Ollama ou LM Studio.",
      securityTab: "Sécurité & Confidentialité",
      vaultTitle: "Coffre-fort local chiffré (AES-256-GCM)",
      vaultDesc: "Vos secrets et clés d'API sont stockés de manière isolée dans un fichier cryptographique matériellement lié à votre session utilisateur. Aucune clé n'est enregistrée en clair sur le disque.",
      promptInjectionTitle: "Détection des attaques par injection de prompt",
      promptInjectionDesc: "Analyse et bloque les tentatives de détournement de directives dans les offres ou CV.",
      docSanitizationTitle: "Assainissement des documents importés",
      docSanitizationDesc: "Nettoie les caractères invisibles, balises de script et espaces de largeur nulle.",
      strictValidationTitle: "Validation stricte de la structure des réponses",
      strictValidationDesc: "Vérifie la conformité rigoureuse des structures JSON générées avant traitement.",
      devAlertsTitle: "Mode développeur pour alertes techniques de sécurité",
      devAlertsDesc: "Affiche le détail des règles et fragments suspects identifiés lors des scans.",
      usageLimitsTitle: "Limites d'usage & Contrôle IA",
      strictProfile: "Strict",
      balancedProfile: "Équilibré",
      customProfile: "Personnalisé",
      privacyTitle: "Confidentialité & Gestion des Fichiers",
      retentionLabel: "Durée de conservation de l'historique",
      retentionDesc: "Période après laquelle l'historique d'audit est purgé.",
      clearCacheBtn: "Nettoyer le cache",
      clearTempBtn: "Supprimer fichiers temporaires",
      wipeAllBtn: "Effacer toutes les données locales",
      wipeConfirmTitle: "Confirmation de suppression complète",
      wipeConfirmDesc: "Cette action réinitialise intégralement l'application Open-CV : vos profils enregistrés, le coffre-fort de clés d'API et les paramètres seront définitivement effacés.",
      testConnectionBtn: "Tester la connexion",
      testingStatus: "Test en cours...",
      saveSecurityBtn: "Sauvegarder la sécurité",
      resetDefaultsBtn: "Restaurer les valeurs sécurisées par défaut",
    },
    interviewSim: {
      title: "Simulateur d'Entretien",
      subtitle: "Entraînez-vous aux entretiens ciblés avec évaluation pédagogique STAR et axes d'amélioration.",
      newSession: "Nouvelle session",
      targetRoleLabel: "Poste ou Métier ciblé",
      targetRolePlaceholder: "Ex: Lead Développeur IA, Product Manager...",
      formatLabel: "Format d'entretien",
      mixedLabel: "Mixte",
      mixedDesc: "Technique & comportemental",
      techLabel: "Technique",
      techDesc: "Architecture, code & stacks",
      behavLabel: "Comportemental",
      behavDesc: "Méthode STAR & soft skills",
      generalLabel: "Général",
      generalDesc: "Motivation, parcours & vision",
      startBtn: "Démarrer l'entraînement",
      generatingTitle: "Génération des questions d'entretien sur-mesure...",
      generatingDesc: "Analyse de votre CV et personnalisation des questions.",
      questionOf: "Question {current} sur {total}",
      interviewerQuestion: "Question du recruteur",
      contextLabel: "Contexte :",
      yourAnswerLabel: "Votre réponse orale ou rédigée",
      answerPlaceholder: "Formulez votre réponse avec la méthode STAR (Situation, Tâche, Action, Résultat)...",
      submitBtn: "Soumettre la réponse",
      evaluatingTitle: "Évaluation pédagogique en cours...",
      evaluatingDesc: "Analyse de la clarté, de l'impact STAR et de la concordance avec votre profil.",
      evalTitle: "Évaluation Question",
      strengthsTitle: "Points forts",
      improvementsTitle: "Axes d'amélioration",
      starTitle: "Reformulation recommandée (Format STAR)",
      nextBtn: "Question suivante",
      finishBtn: "Voir le bilan final",
      summaryTitle: "Bilan de l'Entretien",
      overallScore: "Score Global :",
      restartBtn: "Recommencer un nouvel entraînement",
    },
    jobMatchPanel: {
      title: "Job Match — Comparateur Multi-Offres",
      subtitle: "Comparez votre CV avec 2 à 5 offres d'emploi simultanément pour cibler la candidature la plus prometteuse.",
      editOffers: "Modifier les offres",
      offerPrefix: "Offre #",
      deleteOffer: "Supprimer cette offre",
      jobTitleLabel: "Intitulé du poste",
      companyLabel: "Entreprise",
      descLabel: "Description de l'offre & prérequis",
      descPlaceholder: "Collez ici l'intégralité du texte de l'offre d'emploi...",
      addOfferBtn: "Ajouter une offre ({count}/5)",
      compareBtn: "Lancer le comparateur ({count} offres)",
      comparingTitle: "Analyse comparative en cours...",
      globalSummaryTitle: "Synthèse comparative globale",
      bestMatchBadge: "Meilleur match",
      atsMatchLabel: "Compatibilité ATS",
      matchedSkills: "Compétences validées ({count})",
      missingSkills: "Compétences manquantes ({count})",
      strengthsTitle: "Points forts pour ce poste :",
      recommendationsTitle: "Recommandations d'ajustement :",
      errorNeedDesc: "Toutes les offres d'emploi doivent comporter une description détaillée.",
    },
    aiAssistant: {
      title: "Génération Intelligente par IA",
      generateResume: "Générer un CV",
      generateLetter: "Générer une Lettre",
      resumeParams: "Paramètres du CV à générer",
      resumeSubtitle: "L'IA va composer un profil complet avec expériences STAR et compétences adaptées.",
      targetRole: "Intitulé du poste recherché *",
      targetRolePlaceholder: "Ex: Lead AI Engineer, Full Stack Architect...",
      experienceLevel: "Niveau d'expérience",
      levelJunior: "Junior (0 - 2 ans)",
      levelMid: "Intermédiaire (3 - 5 ans)",
      levelSenior: "Senior (6 - 10 ans)",
      levelLead: "Lead / Manager / Exécutif (10+ ans)",
      skillsKeywords: "Compétences & Mots-clés souhaités",
      skillsPlaceholder: "Ex: PyTorch, CUDA, Kubernetes, Rust...",
      notes: "Notes de parcours & Réalisations (Optionnel)",
      notesPlaceholder: "Collez ici des éléments de votre historique, entreprises précédentes, projets clés ou chiffres marquants...",
      generatingResume: "Génération du CV par l'IA en cours...",
      generateResumeBtn: "Générer le CV optimisé",
      letterParams: "Paramètres de la Lettre",
      letterSubtitle: "Directe, personnalisée et chiffrée selon le poste visé.",
      jobDescription: "Description de l'offre d'emploi *",
      jobDescriptionPlaceholder: "Collez ici le texte de l'offre d'emploi...",
      letterTone: "Tonalité de la lettre",
      toneProfessional: "Professionnel & Impact",
      toneDirect: "Direct & Concis",
      tonePassionate: "Enthousiaste & Ambitieux",
      letterInstructions: "Directives spécifiques (Optionnel)",
      generatingLetter: "Rédaction de la lettre en cours...",
      generateLetterBtn: "Générer la Lettre",
      previewTitle: "Aperçu du résultat généré",
      previewEmptyResume: "Configurez vos paramètres à gauche et cliquez sur 'Générer le CV'.",
      previewEmptyLetter: "Renseignez l'offre d'emploi et cliquez sur 'Générer la Lettre'.",
      applyResume: "Charger dans l'éditeur",
      applyLetter: "Ouvrir dans l'éditeur de lettre",
      applied: "Chargé !",
      requiresKey: "Clé API Requise",
      configureAiBtn: "Configurer le moteur IA",
      fillRoleWarning: "Veuillez renseigner l'intitulé du poste.",
      fillOfferWarning: "Veuillez renseigner la description du poste.",
    },
  },
  en: {
    appName: "Open-CV",
    appSubtitle: "ATS Resume Optimizer & AI Cover Letter Generator",
    tabs: {
      profile: "Resume",
      ai: "AI",
      jobOffer: "Job & ATS Audit",
      jobMatch: "Job Match",
      interview: "Interview",
      coverLetter: "Cover Letter",
      atsTest: "ATS Test",
      guide: "ATS Guide (Reddit)",
      mcp: "MCP Client",
    },
    theme: {
      toggle: "Theme",
      dark: "Dark",
      light: "Light",
    },
    actions: {
      save: "Save",
      saving: "Saving...",
      exportPdf: "Export ATS PDF",
      exportDocx: "Export Word (.docx)",
      importResume: "Import Resume",
      importing: "Importing resume...",
      resetSample: "Standard template",
      addExperience: "Add experience",
      addSkillGroup: "New group",
      addEducation: "Add education",
      addProject: "Add project",
      addBullet: "Add bullet",
      addKeyword: "Add",
      applySuggestion: "Apply to Resume",
      viewPreview: "View Optimized CV",
      generateLetter: "Generate Targeted Letter",
      generating: "AI Writing in progress...",
      copy: "Copy",
      copied: "Copied!",
      printLetter: "Print Letter",
      launchAudit: "Run ATS Audit & AI Scoring",
      analyzing: "ATS Analysis in progress...",
    },
    form: {
      contact: "Contact",
      experiences: "Experience",
      skills: "Skills",
      education: "Education",
      projects: "Projects",
      languages: "Languages",
      interests: "Interests",
      fullName: "Full Name",
      jobTitle: "Target Job Title",
      email: "Email Address",
      phone: "Phone Number",
      city: "City, Country",
      linkedin: "LinkedIn / Portfolio",
      photoUrl: "Photo URL (Optional)",
      summary: "Professional Summary",
      company: "Company",
      position: "Position",
      startDate: "Start Date (YYYY-MM)",
      endDate: "End Date (or Present)",
      roleSummary: "Missions & Context",
      starBullets: "STAR Achievements (Metrics)",
      category: "Category",
      level: "Level",
      keywords: "Keywords (comma separated)",
      school: "School / University",
      degree: "Degree",
      area: "Area of Study",
      dateYear: "Graduation Year",
      projectName: "Project Name",
      projectDesc: "Description & impact",
      sectionOrder: "Section order on resume",
      contactSubtitle: "Contact details and professional summary",
      experiencesSubtitle: "Work history and key achievements in reverse chronological order",
      educationSubtitle: "Degrees, universities and certifications",
      skillsSubtitle: "Technical skills, tools and keywords",
      addHighlight: "+ Add bullet",
      domainName: "Domain name",
      noExperience: "No experience added yet.",
      noEducation: "No education added yet.",
      noSkills: "No skill groups added yet.",
      photoOn: "Photo ON",
      photoOff: "No photo",
      changePhoto: "Change photo",
      addPhoto: "Add photo",
      removePhoto: "Remove",
      photoNote: "Optional. ATS systems favor resumes without photo.",
      summaryPlaceholder: "Briefly summarize your key competencies, tech stack, and quantified achievements...",
      present: "Present",
      in: "in",
      zoomIn: "Zoom in",
      zoomOut: "Zoom out",
    },
    ats: {
      overallScore: "Overall ATS Score",
      matchedKeywords: "Matched Keywords",
      missingKeywords: "Missing Keywords",
      starRecommendations: "STAR Impact Recommendations",
      sectionBreakdown: "Section Breakdown",
      currentVague: "Current phrasing (vague)",
      starOptimized: "Recommended STAR phrasing",
      readyForSubmission: "Excellent ATS compliance",
      goodMatch: "Good match",
      moderateMatch: "Moderate match",
      poorMatch: "Low ATS visibility",
    },
    templates: {
      label: "Resume Template:",
      minimal: "Clean Minimalist (Centered)",
      corporate: "Corporate & Analytical",
      serif: "Classic Serif (Executive)",
      darkMinimal: "Modern High Contrast",
    },
    atsTest: {
      title: "ATS Parser Simulator & Technical Inspection",
      subtitle: "See exactly how parsing algorithms parse your resume (Notepad plain text test) and verify crucial criteria reported by real recruiters.",
      notepadTitle: "The Notepad Test (What the ATS actually reads)",
      notepadDesc: "ATS engines (Workday, Greenhouse, Lever, Taleo) extract plain text in sequential order. If the text below is readable and without scrambled symbols, your resume passes 100% of parsers.",
      copyText: "Copy raw plain text",
      copiedText: "Raw text copied!",
      checklistTitle: "Anti-Invisibility Technical Checklist",
      checkSingleColumn: "Strict 1-column layout (no interleaved multi-column chaos)",
      checkStandardHeaders: "Standard section headings (Experience, Education, Skills)",
      checkBodyContact: "Contact info in document body (not hidden in Word headers/footers)",
      checkDateConsistency: "Uniform date formats (e.g. Jan 2022 - Mar 2024)",
      checkNoIcons: "Zero decorative icons/emojis (prevents U+260E character corruption)",
      checkKeywordsInBullets: "Keywords embedded in action bullets (not just in skills lists)",
      checkNoKeywordStuffing: "Ideal keyword density (25 to 35 exact terms without stuffing)",
      checkJobTitleMatch: "Target job title matches job description (10.6x boost)",
      jobTitleMatchSuccess: "Your resume job title matches the targeted opening.",
      jobTitleMatchWarning: "Align your profile job title with the exact posting title to be found by recruiters.",
      summaryScore: "Technical ATS Compliance Rating",
    },
    guide: {
      title: "Realistic ATS Guide: What Recruiters Actually Care About",
      subtitle: "Unfiltered truths gathered from ATS software engineers, enterprise recruiters, and successful candidates across Reddit (r/developpeurs, r/resumes, r/jobsearchhell).",
      mythTitle: "The Myth of the 75% ATS Auto-Rejection",
      mythText: "No major ATS (Workday, Taleo, Greenhouse, Lever, RecrutOr) automatically tosses a resume based on an arbitrary score. That statistic originated from a 2012 sales pitch by Preptel (a defunct resume company). The only true auto-rejections come from knock-out questions (visas, licenses, salary expectations).",
      realityTitle: "The Real Danger: Invisibility",
      realityText: "92% of recruiters review candidates sorted by submission date and review only the first 40-50 applications. If a job receives 500 applicants, they search by EXACT KEYWORDS in their ATS database. If your keywords don't match exactly, you are simply invisible.",
      fiveMinTitle: "The 5-Minute Customization Routine",
      fiveMinText: "Don't spend hours rewriting your resume. Only tailor the top third: title, summary, and the top 3 bullet points of your latest role. This allows you to apply within the first 24-48 hours.",
      prompt1Title: "Prompt 1: Extract exact search terms (1 min)",
      prompt1Text: "“List the 10-15 exact skills, tools, and phrases a recruiter would search in an ATS for this role. In 2 sentences, explain the core problem this team is trying to solve.”",
      prompt2Title: "Prompt 2: Tailor the top third (2 min)",
      prompt2Text: "“Rewrite ONLY my title, summary, and top 3 bullets of my latest role using the exact terminology from this job description with quantified metrics. Do not fabricate experience.”",
      prompt3Title: "Prompt 3: Uncover hidden experience (2 min)",
      prompt3Text: "“Compare my resume to this job description. List the requirements I do not demonstrate and ask me questions to uncover past experience I forgot to mention.”",
      goldenRulesTitle: "Golden Rule",
      close: "Close Guide",
    },
    settings: {
      title: "Settings",
      subtitle: "General preferences, AI models & MCP servers",
      generalTab: "General",
      aiTab: "AI Models & Keys",
      mcpTab: "MCP Client",
      provider: "AI Provider",
      apiKey: "API Key",
      model: "LLM Model",
      endpoint: "Endpoint URL",
      language: "Interface Language",
      theme: "Display Theme",
      cancel: "Cancel",
      save: "Save",
      removeKey: "Remove Key",
      savedKey: "Saved",
      themeLabel: "Display Theme",
      languageLabel: "Interface Language",
      localNote: "100% Local & Offline. No API key needed for Ollama or LM Studio.",
      securityTab: "Security & Privacy",
      vaultTitle: "Local Encrypted Vault (AES-256-GCM)",
      vaultDesc: "Your secrets and API keys are stored in an isolated, hardware/machine-derived cryptographic vault. No keys are ever stored in plain text.",
      promptInjectionTitle: "Prompt Injection Attack Detection",
      promptInjectionDesc: "Inspects and blocks attempts to override instructions inside resumes or job offers.",
      docSanitizationTitle: "Document Sanitization",
      docSanitizationDesc: "Automatically strips invisible zero-width characters, malicious scripts, and payload delimiters.",
      strictValidationTitle: "Strict Response Structure Validation",
      strictValidationDesc: "Enforces rigorous JSON schema checks before any model output is accepted.",
      devAlertsTitle: "Developer Mode for Security Alerts",
      devAlertsDesc: "Displays granular rule names and suspicious excerpts detected during analysis.",
      usageLimitsTitle: "AI Usage Limits & Throttling",
      strictProfile: "Strict",
      balancedProfile: "Balanced",
      customProfile: "Custom",
      privacyTitle: "Privacy & File Management",
      retentionLabel: "Audit History Retention Duration",
      retentionDesc: "Time after which audit records and ATS evaluations are purged.",
      clearCacheBtn: "Clear Cache",
      clearTempBtn: "Purge Temporary Files",
      wipeAllBtn: "Wipe All Local Data",
      wipeConfirmTitle: "Confirm Full Data Wipe",
      wipeConfirmDesc: "This permanently resets Open-CV: all saved profiles, encrypted vault keys, and configurations will be completely erased.",
      testConnectionBtn: "Test Connection",
      testingStatus: "Testing connection...",
      saveSecurityBtn: "Save Security Settings",
      resetDefaultsBtn: "Restore Secure Defaults",
    },
    interviewSim: {
      title: "Interview Simulator",
      subtitle: "Practice tailored interviews with pedagogical STAR evaluations and constructive feedback.",
      newSession: "New session",
      targetRoleLabel: "Target Role or Job Title",
      targetRolePlaceholder: "e.g. Lead AI Engineer, Product Manager...",
      formatLabel: "Interview Format",
      mixedLabel: "Mixed",
      mixedDesc: "Technical & behavioral",
      techLabel: "Technical",
      techDesc: "Architecture, code & tech stack",
      behavLabel: "Behavioral",
      behavDesc: "STAR framework & soft skills",
      generalLabel: "General",
      generalDesc: "Motivation, background & vision",
      startBtn: "Start Interview Session",
      generatingTitle: "Generating tailored interview questions...",
      generatingDesc: "Analyzing your resume and customizing scenarios.",
      questionOf: "Question {current} of {total}",
      interviewerQuestion: "Interviewer Question",
      contextLabel: "Context:",
      yourAnswerLabel: "Your Spoken or Written Response",
      answerPlaceholder: "Draft your response using the STAR method (Situation, Task, Action, Result)...",
      submitBtn: "Submit Response",
      evaluatingTitle: "Evaluating response...",
      evaluatingDesc: "Assessing clarity, STAR structure, and relevance to your profile.",
      evalTitle: "Question Evaluation",
      strengthsTitle: "Key Strengths",
      improvementsTitle: "Areas for Improvement",
      starTitle: "Recommended STAR Phrasing",
      nextBtn: "Next Question",
      finishBtn: "View Final Report",
      summaryTitle: "Interview Session Summary",
      overallScore: "Overall Score:",
      restartBtn: "Start New Session",
    },
    jobMatchPanel: {
      title: "Job Match — Multi-Job Comparator",
      subtitle: "Compare your resume against 2 to 5 job offers simultaneously to find your highest-probability application.",
      editOffers: "Edit Offers",
      offerPrefix: "Offer #",
      deleteOffer: "Remove offer",
      jobTitleLabel: "Job Title",
      companyLabel: "Company",
      descLabel: "Job Description & Requirements",
      descPlaceholder: "Paste the complete job description text here...",
      addOfferBtn: "Add Job Offer ({count}/5)",
      compareBtn: "Run Job Comparator ({count} offers)",
      comparingTitle: "Analyzing & comparing job matches...",
      globalSummaryTitle: "Global Comparative Summary",
      bestMatchBadge: "Best Match",
      atsMatchLabel: "ATS Compatibility",
      matchedSkills: "Matched Skills ({count})",
      missingSkills: "Missing Skills ({count})",
      strengthsTitle: "Strengths for this role:",
      recommendationsTitle: "Strategic Recommendations:",
      errorNeedDesc: "All job offers must have a non-empty description.",
    },
    aiAssistant: {
      title: "Smart AI Generation",
      generateResume: "Generate Resume",
      generateLetter: "Generate Cover Letter",
      resumeParams: "Resume Generation Parameters",
      resumeSubtitle: "AI will compose a full ATS-optimized profile with STAR achievements and matching skills.",
      targetRole: "Target Job Title *",
      targetRolePlaceholder: "e.g. Lead AI Engineer, Full Stack Architect...",
      experienceLevel: "Experience Level",
      levelJunior: "Junior (0 - 2 years)",
      levelMid: "Mid-Level (3 - 5 years)",
      levelSenior: "Senior (6 - 10 years)",
      levelLead: "Lead / Executive (10+ years)",
      skillsKeywords: "Desired Skills & Keywords",
      skillsPlaceholder: "e.g. PyTorch, CUDA, Kubernetes, Rust...",
      notes: "Career Notes & Key Achievements (Optional)",
      notesPlaceholder: "Paste background details, previous companies, key projects or metrics...",
      generatingResume: "Generating resume with AI...",
      generateResumeBtn: "Generate ATS Resume",
      letterParams: "Cover Letter Parameters",
      letterSubtitle: "Direct, tailored and quantified for your target role.",
      jobDescription: "Job Description / Requirements *",
      jobDescriptionPlaceholder: "Paste the target job description here...",
      letterTone: "Tone of Letter",
      toneProfessional: "Professional & High Impact",
      toneDirect: "Direct & Concise",
      tonePassionate: "Enthusiastic & Ambitious",
      letterInstructions: "Specific Instructions (Optional)",
      generatingLetter: "Drafting cover letter with AI...",
      generateLetterBtn: "Generate Cover Letter",
      previewTitle: "Generated Result Preview",
      previewEmptyResume: "Configure parameters on the left and click 'Generate ATS Resume'.",
      previewEmptyLetter: "Fill in the job description and click 'Generate Cover Letter'.",
      applyResume: "Load into Editor",
      applyLetter: "Open in Letter Editor",
      applied: "Loaded!",
      requiresKey: "API Key Required",
      configureAiBtn: "Configure AI Provider",
      fillRoleWarning: "Please provide the target job title.",
      fillOfferWarning: "Please provide the job description.",
    },
  },
  es: {
    appName: "Open-CV",
    appSubtitle: "Optimizador de CV para ATS y Cartas de Presentación IA",
    tabs: {
      profile: "CV",
      jobOffer: "Oferta y Auditoría ATS",
      coverLetter: "Carta de Presentación",
      atsTest: "Prueba ATS",
      guide: "Guía ATS (Reddit)",
      mcp: "Cliente MCP",
    },
    theme: {
      toggle: "Tema",
      dark: "Oscuro",
      light: "Claro",
    },
    actions: {
      save: "Guardar",
      saving: "Guardando...",
      exportPdf: "Exportar PDF ATS",
      resetSample: "Plantilla estándar",
      addExperience: "Añadir experiencia",
      addSkillGroup: "Nuevo grupo",
      addEducation: "Añadir educación",
      addProject: "Añadir proyecto",
      addBullet: "Añadir viñeta",
      addKeyword: "Añadir",
      applySuggestion: "Aplicar al CV",
      viewPreview: "Ver CV Optimizado",
      generateLetter: "Generar Carta Dirigida",
      generating: "Redacción IA en curso...",
      copy: "Copiar",
      copied: "¡Copiado!",
      printLetter: "Imprimir Carta",
      launchAudit: "Iniciar Auditoría ATS",
      analyzing: "Analizando ATS...",
    },
    form: {
      contact: "Contacto",
      experiences: "Experiencia",
      skills: "Habilidades",
      education: "Educación",
      projects: "Proyectos",
      languages: "Idiomas",
      interests: "Intereses",
      fullName: "Nombre y Apellido",
      jobTitle: "Título profesional deseado",
      email: "Correo electrónico",
      phone: "Teléfono",
      city: "Ciudad, País",
      linkedin: "LinkedIn / Portafolio",
      photoUrl: "URL Foto (Opcional)",
      summary: "Perfil profesional",
      company: "Empresa",
      position: "Puesto",
      startDate: "Fecha inicio (AAAA-MM)",
      endDate: "Fecha fin (o Presente)",
      roleSummary: "Misiones y responsabilidades",
      starBullets: "Logros cuantificados (STAR)",
      category: "Categoría",
      level: "Nivel",
      keywords: "Palabras clave",
      school: "Institución",
      degree: "Título",
      area: "Especialidad",
      dateYear: "Año de graduación",
      projectName: "Nombre del proyecto",
      projectDesc: "Descripción e impacto",
    },
    ats: {
      overallScore: "Puntaje General ATS",
      matchedKeywords: "Palabras Clave Encontradas",
      missingKeywords: "Palabras Clave Faltantes",
      starRecommendations: "Mejoras STAR (Impacto)",
      sectionBreakdown: "Desglose por Sección",
      currentVague: "Frase actual (vaga)",
      starOptimized: "Frase recomendada STAR",
      readyForSubmission: "Excelente compatibilidad ATS",
      goodMatch: "Buena correspondencia",
      moderateMatch: "Correspondencia moderada",
      poorMatch: "Baja visibilidad ATS",
    },
    templates: {
      label: "Plantilla de CV:",
      minimal: "Minimalista Limpio (Centrado)",
      corporate: "Corporativo y Analítico",
      serif: "Clásico Serif (Ejecutivo)",
      darkMinimal: "Contraste Moderno",
    },
    atsTest: {
      title: "Simulador de Parser ATS e Inspección Técnica",
      subtitle: "Compruebe exactamente cómo lee su CV el sistema (prueba del Bloc de Notas) e inspeccione los puntos críticos según los reclutadores reales.",
      notepadTitle: "Prueba del Bloc de Notas (Lo que lee el ATS)",
      notepadDesc: "Los motores ATS (Workday, Greenhouse, Lever, Taleo) extraen texto plano en orden secuencial. Si el orden es coherente y sin caracteres corruptos, su CV pasa el 100% de los filtros.",
      copyText: "Copiar texto plano",
      copiedText: "¡Texto copiado!",
      checklistTitle: "Lista de Verificación Anti-Invisibilidad",
      checkSingleColumn: "Diseño estricto en 1 columna (sin columnas mezcladas)",
      checkStandardHeaders: "Encabezados estándar (Experiencia, Educación, Habilidades)",
      checkBodyContact: "Contacto en el cuerpo del texto (no en encabezados de Word)",
      checkDateConsistency: "Formato de fechas uniforme (ej. Ene 2022 - Mar 2024)",
      checkNoIcons: "Cero iconos o emojis (evita caracteres corruptos U+260E)",
      checkKeywordsInBullets: "Palabras clave dentro de las viñetas de logros",
      checkNoKeywordStuffing: "Densidad ideal de palabras clave (25 a 35 términos exactos)",
      checkJobTitleMatch: "Alineación del título con la vacante (Aumento x10,6)",
      jobTitleMatchSuccess: "El título de su CV coincide con la vacante.",
      jobTitleMatchWarning: "Alinee el título de su CV con el título exacto de la vacante para ser encontrado.",
      summaryScore: "Índice de conformidad técnica ATS",
    },
    guide: {
      title: "Guía ATS Realista: Lo que realmente importa",
      subtitle: "Consejos sin filtros basados en ingenieros de ATS y reclutadores en Reddit.",
      mythTitle: "El Mito del Rechazo Automático al 75%",
      mythText: "Ningún ATS descarta un CV solo por un puntaje bajo. El mito proviene de una empresa de CV de 2012. Los únicos rechazos automáticos provienen de preguntas de descarte (visas, sueldos).",
      realityTitle: "La Verdad: El Riesgo de la Invisibilidad",
      realityText: "Los reclutadores revisan por fecha de postulación y buscan palabras clave exactas en su base de datos. Si no tiene las palabras exactas, simplemente no aparece.",
      fiveMinTitle: "La Rutina de los 5 Minutos",
      fiveMinText: "Adapte solo el tercio superior: título exacto, resumen y las 3 viñetas principales de su último puesto.",
      prompt1Title: "Prompt 1: Extraer términos exactos (1 min)",
      prompt1Text: "«Lista las 10-15 habilidades y palabras exactas que un reclutador buscaría en un ATS para esta oferta.»",
      prompt2Title: "Prompt 2: Adaptar el tercio superior (2 min)",
      prompt2Text: "«Reescribe SOLO mi título, resumen y las 3 primeras viñetas con la terminología exacta de la oferta y logros medibles.»",
      prompt3Title: "Prompt 3: Descubrir experiencia olvidada (2 min)",
      prompt3Text: "«Compara mi CV y la oferta. Dime qué requisitos no demuestro y hazme preguntas para recordar proyectos pasados.»",
      goldenRulesTitle: "Regla de Oro",
      close: "Cerrar guía",
    },
    settings: {
      title: "Configuración y Motor IA",
      provider: "Proveedor de IA",
      apiKey: "Clave de API",
      model: "Modelo LLM",
      endpoint: "URL del servidor",
      language: "Idioma de la interfaz",
      theme: "Tema de interfaz",
      cancel: "Cancelar",
      save: "Guardar",
      localNote: "100% Local y Gratuito. No requiere clave para Ollama o LM Studio.",
    },
  },
  de: {
    appName: "Open-CV",
    appSubtitle: "ATS-Lebenslauf-Optimierer & KI-Anschreiben",
    tabs: {
      profile: "CV",
      jobOffer: "Stelle & ATS-Audit",
      coverLetter: "Anschreiben",
      atsTest: "ATS-Test",
      guide: "ATS-Leitfaden (Reddit)",
      mcp: "MCP-Client",
    },
    theme: {
      toggle: "Design",
      dark: "Dunkel",
      light: "Hell",
    },
    actions: {
      save: "Speichern",
      saving: "Speichern...",
      exportPdf: "ATS-PDF exportieren",
      resetSample: "Standardvorlage",
      addExperience: "Erfahrung hinzufügen",
      addSkillGroup: "Neue Gruppe",
      addEducation: "Ausbildung hinzufügen",
      addProject: "Projekt hinzufügen",
      addBullet: "Punkt hinzufügen",
      addKeyword: "Hinzufügen",
      applySuggestion: "Im Lebenslauf anwenden",
      viewPreview: "Optimierten Lebenslauf anzeigen",
      generateLetter: "Anschreiben generieren",
      generating: "KI-Generierung läuft...",
      copy: "Kopieren",
      copied: "Kopiert!",
      printLetter: "Anschreiben drucken",
      launchAudit: "ATS-Audit starten",
      analyzing: "ATS-Analyse läuft...",
    },
    form: {
      contact: "Kontakt",
      experiences: "Berufserfahrung",
      skills: "Fähigkeiten",
      education: "Ausbildung",
      projects: "Projekte",
      languages: "Sprachen",
      interests: "Interessen",
      fullName: "Vor- und Nachname",
      jobTitle: "Angestrebte Position",
      email: "E-Mail-Adresse",
      phone: "Telefonnummer",
      city: "Stadt, Land",
      linkedin: "LinkedIn / Portfolio",
      photoUrl: "Foto-URL (Optional)",
      summary: "Berufliches Profil",
      company: "Unternehmen",
      position: "Position",
      startDate: "Startdatum (JJJJ-MM)",
      endDate: "Enddatum (oder Heute)",
      roleSummary: "Aufgaben & Verantwortung",
      starBullets: "Erfolge (STAR-Methode)",
      category: "Kategorie",
      level: "Niveau",
      keywords: "Schlüsselwörter",
      school: "Schule / Hochschule",
      degree: "Abschluss",
      area: "Fachbereich",
      dateYear: "Abschlussjahr",
      projectName: "Projektname",
      projectDesc: "Kurzbeschreibung",
    },
    ats: {
      overallScore: "ATS-Gesamtpunktzahl",
      matchedKeywords: "Gefundene Schlüsselwörter",
      missingKeywords: "Fehlende Schlüsselwörter",
      starRecommendations: "STAR-Verbesserungen",
      sectionBreakdown: "Detaillierte Sektionsbewertung",
      currentVague: "Aktuelle Formulierung",
      starOptimized: "STAR-Optimierung",
      readyForSubmission: "Hervorragende Übereinstimmung",
      goodMatch: "Gute Übereinstimmung",
      moderateMatch: "Mittlere Übereinstimmung",
      poorMatch: "Geringe Übereinstimmung",
    },
    templates: {
      label: "Lebenslauf-Vorlage:",
      minimal: "Modern Clean (Zentriert)",
      corporate: "Analytisch & Corporate",
      serif: "Klassisches Serif",
      darkMinimal: "Schwarz-Weiß Kontrast",
    },
    atsTest: {
      title: "ATS-Parser Simulator & Technische Prüfung",
      subtitle: "Sehen Sie genau, wie Parsing-Algorithmen Ihren Lebenslauf erfassen (Notepad-Klartext-Test) und prüfen Sie Kriterien echter Personalverantwortlicher.",
      notepadTitle: "Der Notepad-Test (Was das ATS wirklich liest)",
      notepadDesc: "ATS-Systeme wandeln Ihren Lebenslauf in sequentiellen Klartext um. Wenn dieser Text sauber und ohne verdrehte Zeichen lesbar ist, besteht er 100% der Parser.",
      copyText: "Klartext kopieren",
      copiedText: "Klartext kopiert!",
      checklistTitle: "Technische Anti-Unsichtbarkeits-Checkliste",
      checkSingleColumn: "Strikte 1-Spalten-Struktur (keine verwirrten Spalten)",
      checkStandardHeaders: "Standard-Abschnittsüberschriften (Erfahrung, Bildung, Skills)",
      checkBodyContact: "Kontaktdaten im Haupttext (nicht in Word-Kopfzeilen versteckt)",
      checkDateConsistency: "Einheitliches Datumsformat (z.B. Jan 2022 - Mär 2024)",
      checkNoIcons: "Keine Emojis oder Sonderzeichen (vermeidet U+260E Fehler)",
      checkKeywordsInBullets: "Schlüsselwörter direkt in den Erfolgsstichpunkten integriert",
      checkNoKeywordStuffing: "Optimale Keyword-Dichte (25-35 exakte Begriffe ohne Spam)",
      checkJobTitleMatch: "Positionsbezeichnung entspricht Stellenanzeige (10,6-facher Boost)",
      jobTitleMatchSuccess: "Positionsbezeichnung stimmt mit der Stellenanzeige überein.",
      jobTitleMatchWarning: "Passen Sie den Titel exakt an die Stellenanzeige an, um gefunden zu werden.",
      summaryScore: "ATS-Konformitätsbewertung",
    },
    guide: {
      title: "Realistischer ATS-Leitfaden: Was wirklich zählt",
      subtitle: "Erkenntnisse von ATS-Entwicklern und Recruitern auf Reddit (r/developpeurs, r/resumes).",
      mythTitle: "Der Mythos der 75%-Automatischen Ablehnung",
      mythText: "Kein großes ATS wirft einen Lebenslauf wegen eines KI-Scores weg. Diese Statistik stammt aus einer Werbekampagne von 2012. Echte Ablehnungen kommen nur durch K.o.-Fragen (Visa, Gehalt, Zeugnisse).",
      realityTitle: "Die Wahrheit: Das Risiko der Unsichtbarkeit",
      realityText: "Recruiter sortieren Bewerbungen nach Eingangsdatum und durchsuchen Bewerberpools mit exakten Schlüsselwörtern. Fehlen diese Begriffe, taucht Ihre Bewerbung einfach nicht auf.",
      fiveMinTitle: "Die 5-Minuten-Anpassungsroutine",
      fiveMinText: "Passen Sie nur das obere Drittel an: exakter Titel, Profiltext und die ersten 3 Punkte Ihrer aktuellen Position.",
      prompt1Title: "Prompt 1: Exakte Suchbegriffe ermitteln",
      prompt1Text: "„Liste die 10-15 exakten Begriffe auf, die ein Recruiter im ATS für diese Stelle suchen würde.“",
      prompt2Title: "Prompt 2: Oberes Drittel anpassen",
      prompt2Text: "„Schreibe NUR meinen Titel, mein Profil und die ersten 3 Punkte mit der exakten Terminologie und messbaren Zahlen um.“",
      prompt3Title: "Prompt 3: Versteckte Erfahrungen finden",
      prompt3Text: "„Vergleiche meinen Lebenslauf mit der Anzeige. Stelle mir Fragen zu Anforderungen, die noch fehlen.“",
      goldenRulesTitle: "Goldene Regel",
      close: "Schließen",
    },
    settings: {
      title: "Einstellungen & KI-Engine",
      provider: "KI-Anbieter",
      apiKey: "API-Schlüssel",
      model: "LLM-Modell",
      endpoint: "Endpunkt-URL",
      language: "Sprache",
      theme: "Erscheinungsbild",
      cancel: "Abbrechen",
      save: "Speichern",
      localNote: "100% Lokal & Kostenlos. Kein API-Schlüssel nötig.",
    },
  },
  it: {
    appName: "Open-CV",
    appSubtitle: "Ottimizzatore CV per ATS & Lettere di Presentazione IA",
    tabs: {
      profile: "CV",
      jobOffer: "Offerta & Audit ATS",
      coverLetter: "Lettera di Presentazione",
      atsTest: "Test ATS",
      guide: "Guida ATS (Reddit)",
      mcp: "Client MCP",
    },
    theme: {
      toggle: "Tema",
      dark: "Scuro",
      light: "Chiaro",
    },
    actions: {
      save: "Salva",
      saving: "Salvataggio...",
      exportPdf: "Esporta PDF ATS",
      resetSample: "Modello predefinito",
      addExperience: "Aggiungi esperienza",
      addSkillGroup: "Nuovo gruppo",
      addEducation: "Aggiungi istruzione",
      addProject: "Aggiungi progetto",
      addBullet: "Aggiungi punto",
      addKeyword: "Aggiungi",
      applySuggestion: "Applica al CV",
      viewPreview: "Visualizza CV Ottimizzato",
      generateLetter: "Genera Lettera Mirata",
      generating: "Scrittura IA in corso...",
      copy: "Copia",
      copied: "Copiato!",
      printLetter: "Stampa Lettera",
      launchAudit: "Avvia Audit ATS & Scoring",
      analyzing: "Analisi ATS in corso...",
    },
    form: {
      contact: "Contatto",
      experiences: "Esperienza Professionale",
      skills: "Competenze",
      education: "Formazione",
      projects: "Progetti",
      languages: "Lingue",
      interests: "Interessi",
      fullName: "Nome e Cognome",
      jobTitle: "Ruolo ricercato",
      email: "Indirizzo Email",
      phone: "Telefono",
      city: "Città, Paese",
      linkedin: "LinkedIn / Portfolio",
      photoUrl: "URL Foto (Opzionale)",
      summary: "Profilo Professionale",
      company: "Azienda",
      position: "Ruolo",
      startDate: "Data inizio (AAAA-MM)",
      endDate: "Data fine (o Attuale)",
      roleSummary: "Mansioni & Responsabilità",
      starBullets: "Risultati quantificati (STAR)",
      category: "Categoria",
      level: "Livello",
      keywords: "Parole chiave",
      school: "Istituto / Università",
      degree: "Titolo di studio",
      area: "Specializzazione",
      dateYear: "Anno di conseguimento",
      projectName: "Nome Progetto",
      projectDesc: "Descrizione & impatto",
    },
    ats: {
      overallScore: "Punteggio ATS Globale",
      matchedKeywords: "Parole Chiave Rilevate",
      missingKeywords: "Parole Chiave Mancanti",
      starRecommendations: "Suggerimenti Metodo STAR",
      sectionBreakdown: "Dettaglio per Sezione",
      currentVague: "Formulazione attuale (vaga)",
      starOptimized: "Formulazione STAR consigliata",
      readyForSubmission: "Ottima conformità ATS",
      goodMatch: "Buona corrispondenza",
      moderateMatch: "Corrispondenza moderata",
      poorMatch: "Bassa visibilità ATS",
    },
    templates: {
      label: "Modello CV:",
      minimal: "Minimalista Pulito (Centrato)",
      corporate: "Corporate & Analitico",
      serif: "Classico Serif (Executive)",
      darkMinimal: "Moderno a Contrasto",
    },
    atsTest: {
      title: "Simulatore di Parsing ATS & Verifica Tecnica",
      subtitle: "Scopri esattamente cosa legge l'algoritmo (test del Blocco Note) e verifica i punti critici evidenziati dai veri recruiter.",
      notepadTitle: "Il Test del Blocco Note (Cosa legge davvero l'ATS)",
      notepadDesc: "I software ATS estraggono testo semplice in ordine sequenziale. Se il testo sottostante è fluido e leggibile, il tuo CV supera il 100% dei parser.",
      copyText: "Copia testo semplice",
      copiedText: "Testo copiato!",
      checklistTitle: "Checklist Tecnica Anti-Invisibilità",
      checkSingleColumn: "Layout rigoroso a 1 colonna (nessuna colonna mescolata)",
      checkStandardHeaders: "Titoli di sezione standard (Esperienza, Formazione, Competenze)",
      checkBodyContact: "Contatti nel corpo del documento (non nelle intestazioni Word)",
      checkDateConsistency: "Formato date uniforme (es. Gen 2022 - Mar 2024)",
      checkNoIcons: "Zero icone o emoji (evita caratteri illeggibili U+260E)",
      checkKeywordsInBullets: "Parole chiave inserite nei punti elenco delle mansioni",
      checkNoKeywordStuffing: "Densità ideale (25-35 termini esatti senza forzature)",
      checkJobTitleMatch: "Titolo allineato all'offerta di lavoro (Boost x10,6)",
      jobTitleMatchSuccess: "Il titolo del tuo CV corrisponde esattamente all'offerta.",
      jobTitleMatchWarning: "Allinea il titolo del tuo CV con quello dell'offerta per apparire nelle ricerche.",
      summaryScore: "Valutazione di Conformità ATS",
    },
    guide: {
      title: "Guida ATS Realistica: Cosa conta veramente per i Recruiter",
      subtitle: "Verità senza filtri raccolte da sviluppatori di ATS e recruiter su Reddit (r/developpeurs, r/resumes).",
      mythTitle: "Il Mito dello Scarto Automatico al 75%",
      mythText: "Nessun software ATS elimina un CV unicamente per un punteggio inventato. La statistica deriva da uno slogan promozionale del 2012. I soli scarti automatici derivano da requisiti vincolanti (visti, stipendio, qualifiche obbligatorie).",
      realityTitle: "La Realtà: Il Rischio dell'Invisibilità",
      realityText: "I recruiter ordinano le candidature per data di arrivo e cercano parole chiave esatte. Se mancano i termini precisi dell'annuncio, la tua candidatura rimane invisibile in fondo alla pila.",
      fiveMinTitle: "La Routine di 5 Minuti",
      fiveMinText: "Modifica solo il terzo superiore: titolo esatto, breve riassunto e i primi 3 punti elenco del tuo ruolo più recente.",
      prompt1Title: "Prompt 1: Trova le parole chiave esatte (1 min)",
      prompt1Text: "«Elenca le 10-15 competenze ed espressioni esatte che un recruiter cercherebbe nell'ATS per questa offerta.»",
      prompt2Title: "Prompt 2: Adatta il terzo superiore (2 min)",
      prompt2Text: "«Riscrivi SOLO il mio titolo, riassunto e i primi 3 punti elenco del mio ultimo ruolo usando i termini esatti e parametri quantificabili.»",
      prompt3Title: "Prompt 3: Scopri le competenze dimenticate (2 min)",
      prompt3Text: "«Confronta il mio CV e l'offerta. Dimmi quali requisiti mancano e fammi domande per ricordare progetti passati.»",
      goldenRulesTitle: "Regola Aurea",
      close: "Chiudi guida",
    },
    settings: {
      title: "Impostazioni & Motore IA",
      provider: "Fornitore IA",
      apiKey: "Chiave API",
      model: "Modello LLM",
      endpoint: "URL Endpoint",
      language: "Lingua Interfaccia",
      theme: "Tema",
      cancel: "Annulla",
      save: "Salva",
      localNote: "100% Locale e Gratuito. Nessuna chiave API per Ollama o LM Studio.",
    },
  },
  pt: {
    appName: "Open-CV",
    appSubtitle: "Otimizador de Currículo ATS & Cartas de Apresentação com IA",
    tabs: {
      profile: "CV",
      jobOffer: "Vaga & Auditoria ATS",
      coverLetter: "Carta de Apresentação",
      atsTest: "Teste ATS",
      guide: "Guia ATS (Reddit)",
      mcp: "Cliente MCP",
    },
    theme: {
      toggle: "Tema",
      dark: "Escuro",
      light: "Claro",
    },
    actions: {
      save: "Salvar",
      saving: "Salvando...",
      exportPdf: "Exportar PDF ATS",
      resetSample: "Modelo padrão",
      addExperience: "Adicionar experiência",
      addSkillGroup: "Novo grupo",
      addEducation: "Adicionar formação",
      addProject: "Adicionar projeto",
      addBullet: "Adicionar item",
      addKeyword: "Adicionar",
      applySuggestion: "Aplicar ao CV",
      viewPreview: "Ver CV Otimizado",
      generateLetter: "Gerar Carta Direcionada",
      generating: "IA escrevendo...",
      copy: "Copiar",
      copied: "Copiado!",
      printLetter: "Imprimir Carta",
      launchAudit: "Iniciar Auditoria ATS",
      analyzing: "Analisando ATS...",
    },
    form: {
      contact: "Contato",
      experiences: "Experiência Profissional",
      skills: "Competências",
      education: "Formação",
      projects: "Projetos",
      languages: "Idiomas",
      interests: "Interesses",
      fullName: "Nome Completo",
      jobTitle: "Cargo Alvo",
      email: "E-mail",
      phone: "Telefone",
      city: "Cidade, País",
      linkedin: "LinkedIn / Portfólio",
      photoUrl: "URL Foto (Opcional)",
      summary: "Resumo Profissional",
      company: "Empresa",
      position: "Cargo",
      startDate: "Data início (AAAA-MM)",
      endDate: "Data término (ou Atual)",
      roleSummary: "Atribuições & Contexto",
      starBullets: "Conquistas quantificadas (STAR)",
      category: "Categoria",
      level: "Nível",
      keywords: "Palavras-chave",
      school: "Instituição de Ensino",
      degree: "Grau",
      area: "Área de Estudo",
      dateYear: "Ano de Conclusão",
      projectName: "Nome do Projeto",
      projectDesc: "Descrição & impacto",
    },
    ats: {
      overallScore: "Pontuação ATS Global",
      matchedKeywords: "Palavras-Chave Encontradas",
      missingKeywords: "Palavras-Chave Ausentes",
      starRecommendations: "Recomendações STAR",
      sectionBreakdown: "Detalhamento por Seção",
      currentVague: "Frase atual (vaga)",
      starOptimized: "Frase recomendada STAR",
      readyForSubmission: "Excelente conformidade ATS",
      goodMatch: "Boa correspondência",
      moderateMatch: "Correspondência moderada",
      poorMatch: "Baixa visibilidade ATS",
    },
    templates: {
      label: "Modelo de CV:",
      minimal: "Minimalista Limpo (Centralizado)",
      corporate: "Corporativo & Analítico",
      serif: "Clássico Serif (Executivo)",
      darkMinimal: "Moderno com Contraste",
    },
    atsTest: {
      title: "Simulador de Parser ATS & Inspeção Técnica",
      subtitle: "Veja exatamente como os algoritmos leem seu currículo (teste do Bloco de Notas) e verifique os critérios críticos relatados por recrutadores reais.",
      notepadTitle: "O Teste do Bloco de Notas (O que o ATS realmente lê)",
      notepadDesc: "Os sistemas ATS extraem texto puro em ordem sequencial. Se o texto estiver claro e sem símbolos corrompidos, seu currículo passa por 100% dos parsers.",
      copyText: "Copiar texto puro",
      copiedText: "Texto copiado!",
      checklistTitle: "Lista de Verificação Anti-Invisibilidade",
      checkSingleColumn: "Layout estritamente em 1 coluna (sem colunas misturadas)",
      checkStandardHeaders: "Títulos de seção padronizados (Experiência, Educação, Habilidades)",
      checkBodyContact: "Contato no corpo do documento (não escondido no cabeçalho Word)",
      checkDateConsistency: "Formato de datas uniforme (ex: Jan 2022 - Mar 2024)",
      checkNoIcons: "Sem emojis ou ícones (evita corrupção de caracteres U+260E)",
      checkKeywordsInBullets: "Palavras-chave inseridas diretamente nos tópicos de conquistas",
      checkNoKeywordStuffing: "Densidade ideal (25 a 35 termos exatos sem repetição artificial)",
      checkJobTitleMatch: "Cargo alinhado exatamente com a vaga (Aumento de 10,6x)",
      jobTitleMatchSuccess: "O cargo do seu currículo corresponde exatamente à vaga.",
      jobTitleMatchWarning: "Alinhe o cargo do seu currículo com o título da vaga para ser localizado.",
      summaryScore: "Índice de Conformidade Técnica ATS",
    },
    guide: {
      title: "Guia ATS Realista: O que Realmente Importa",
      subtitle: "Verdades diretas obtidas de desenvolvedores de ATS e recrutadores no Reddit.",
      mythTitle: "O Mito da Rejeição Automática de 75%",
      mythText: "Nenhum sistema ATS descarta candidatos apenas por uma pontuação mágica. Esse mito veio de um anúncio de 2012. Rejeições automáticas reais ocorrem apenas por perguntas eliminatórias (vistos, salário, requisitos legais).",
      realityTitle: "A Realidade: O Risco da Invisibilidade",
      realityText: "Os recrutadores ordenam por data de inscrição e filtram por palavras-chave exatas. Se você não tem as palavras exatas, você simplesmente não é exibido.",
      fiveMinTitle: "A Rotina dos 5 Minutos",
      fiveMinText: "Personalize apenas o terço superior: título exato, resumo profissional e os 3 primeiros tópicos da sua experiência mais recente.",
      prompt1Title: "Prompt 1: Identificar termos exatos (1 min)",
      prompt1Text: "«Liste as 10 a 15 habilidades e expressões exatas que um recrutador buscaria no ATS para esta vaga.»",
      prompt2Title: "Prompt 2: Ajustar o terço superior (2 min)",
      prompt2Text: "«Reescreva APENAS meu título, resumo e os 3 primeiros tópicos com a terminologia exata da vaga e dados quantificados.»",
      prompt3Title: "Prompt 3: Revelar experiências esquecidas (2 min)",
      prompt3Text: "«Compare meu CV com a vaga. Liste os requisitos ausentes e faça-me perguntas para lembrar experiências passadas.»",
      goldenRulesTitle: "Regra de Ouro",
      close: "Fechar guia",
    },
    settings: {
      title: "Configurações & Motor IA",
      provider: "Provedor de IA",
      apiKey: "Chave de API",
      model: "Modelo LLM",
      endpoint: "URL do Endpoint",
      language: "Idioma da Interface",
      theme: "Tema",
      cancel: "Cancelar",
      save: "Salvar",
      localNote: "100% Local e Gratuito. Nenhuma chave necessária para Ollama ou LM Studio.",
    },
  },
  nl: {
    appName: "Open-CV",
    appSubtitle: "ATS CV-Optimalisatie & AI Sollicitatiebrieven",
    tabs: {
      profile: "CV",
      jobOffer: "Vacature & ATS-Audit",
      coverLetter: "Sollicitatiebrief",
      atsTest: "ATS-Test",
      guide: "ATS-Gids (Reddit)",
      mcp: "MCP-Client",
    },
    theme: {
      toggle: "Thema",
      dark: "Donker",
      light: "Licht",
    },
    actions: {
      save: "Opslaan",
      saving: "Opslaan...",
      exportPdf: "Exporteer ATS-PDF",
      resetSample: "Standaard sjabloon",
      addExperience: "Ervaring toevoegen",
      addSkillGroup: "Nieuwe groep",
      addEducation: "Opleiding toevoegen",
      addProject: "Project toevoegen",
      addBullet: "Punt toevoegen",
      addKeyword: "Toevoegen",
      applySuggestion: "Toepassen op CV",
      viewPreview: "Bekijk Geoptimaliseerd CV",
      generateLetter: "Genereer Gerichte Brief",
      generating: "AI aan het schrijven...",
      copy: "Kopiëren",
      copied: "Gekopieerd!",
      printLetter: "Brief Afdrukken",
      launchAudit: "Start ATS-Audit & Scoring",
      analyzing: "ATS-Analyse bezig...",
    },
    form: {
      contact: "Contact",
      experiences: "Werkervaring",
      skills: "Vaardigheden",
      education: "Opleiding",
      projects: "Projecten",
      languages: "Talen",
      interests: "Interesses",
      fullName: "Volledige Naam",
      jobTitle: "Gewenste Functietitel",
      email: "E-mailadres",
      phone: "Telefoonnummer",
      city: "Woonplaats, Land",
      linkedin: "LinkedIn / Portfolio",
      photoUrl: "Foto-URL (Optioneel)",
      summary: "Professioneel Profiel",
      company: "Bedrijf",
      position: "Functie",
      startDate: "Startdatum (JJJJ-MM)",
      endDate: "Einddatum (of Heden)",
      roleSummary: "Verantwoordelijkheden",
      starBullets: "STAR-Resultaten (Statistieken)",
      category: "Categorie",
      level: "Niveau",
      keywords: "Trefwoorden",
      school: "Onderwijsinstelling",
      degree: "Diploma",
      area: "Studierichting",
      dateYear: "Afstudeerjaar",
      projectName: "Projectnaam",
      projectDesc: "Beschrijving & impact",
    },
    ats: {
      overallScore: "Totale ATS-Score",
      matchedKeywords: "Gevonden Trefwoorden",
      missingKeywords: "Ontbrekende Trefwoorden",
      starRecommendations: "STAR-Aanbevelingen",
      sectionBreakdown: "Uitsplitsing per Sectie",
      currentVague: "Huidige vage formulering",
      starOptimized: "Aanbevolen STAR-formulering",
      readyForSubmission: "Uitstekende ATS-conformiteit",
      goodMatch: "Goede match",
      moderateMatch: "Gemiddelde match",
      poorMatch: "Lage ATS-zichtbaarheid",
    },
    templates: {
      label: "CV-Sjabloon:",
      minimal: "Modern Minimalistisch (Gecentreerd)",
      corporate: "Zakelijk & Analytisch",
      serif: "Klassiek Serif (Directie)",
      darkMinimal: "Modern Contrastrijk",
    },
    atsTest: {
      title: "ATS-Parser Simulator & Technische Controle",
      subtitle: "Zie precies hoe ATS-algoritmen uw CV lezen (Kladblok-test) en controleer de essentiële criteria volgens echte recruiters.",
      notepadTitle: "De Kladblok-test (Wat het ATS werkelijk leest)",
      notepadDesc: "ATS-systemen zetten uw CV om in opeenvolgende platte tekst. Als de onderstaande tekst logisch geordend en leesbaar is, passeert uw CV 100% van de parsers.",
      copyText: "Kopieer platte tekst",
      copiedText: "Tekst gekopieerd!",
      checklistTitle: "Technische Anti-Onzichtbaarheids Checklist",
      checkSingleColumn: "Strikte 1-koloms lay-out (geen door elkaar lopende kolommen)",
      checkStandardHeaders: "Standaard sectietitels (Ervaring, Opleiding, Vaardigheden)",
      checkBodyContact: "Contactgegevens in het document (niet verborgen in Word-kopteksten)",
      checkDateConsistency: "Uniform datumformaat (bijv. Jan 2022 - Mrt 2024)",
      checkNoIcons: "Geen emoji's of pictogrammen (voorkomt U+260E karakterfouten)",
      checkKeywordsInBullets: "Trefwoorden verwerkt in uw resultaatgerichte punten",
      checkNoKeywordStuffing: "Optimale trefwoorddichtheid (25 tot 35 exacte termen)",
      checkJobTitleMatch: "Functietitel komt overeen met vacature (10,6x hogere vindbaarheid)",
      jobTitleMatchSuccess: "Uw functietitel komt overeen met de vacature.",
      jobTitleMatchWarning: "Pas uw functietitel aan op de exacte vacaturetekst om gevonden te worden.",
      summaryScore: "ATS-Conformiteitsscore",
    },
    guide: {
      title: "Realistische ATS-Gids: Wat Recruiters Echt Zoeken",
      subtitle: "Ongefilterde inzichten van ATS-ontwikkelaars en recruiters op Reddit (r/developpeurs, r/resumes).",
      mythTitle: "De Mythe van de 75% Automatische Afwijzing",
      mythText: "Geen enkel groot ATS wijst kandidaten automatisch af op basis van een willekeurige AI-score. Deze mythe stamt uit 2012. Echte automatische afwijzingen gebeuren alleen door knock-out vragen (werkvergunning, salaris, diploma's).",
      realityTitle: "De Werkelijkheid: Het Gevaar van Onzichtbaarheid",
      realityText: "Recruiters sorteren op datum van binnenkomst en zoeken op exacte trefwoorden in hun database. Als de exacte termen ontbreken, blijft u simpelweg onzichtbaar.",
      fiveMinTitle: "De 5-Minuten Routine",
      fiveMinText: "Pas alleen het bovenste derde deel aan: exacte titel, samenvatting en de bovenste 3 punten van uw meest recente functie.",
      prompt1Title: "Prompt 1: Vind de exacte zoektermen (1 min)",
      prompt1Text: "„Geef de 10-15 exacte vaardigheden en termen die een recruiter in een ATS zou intypen voor deze vacature.“",
      prompt2Title: "Prompt 2: Pas het bovenste deel aan (2 min)",
      prompt2Text: "„Herschrijf ALLEEN mijn titel, samenvatting en de bovenste 3 punten met de exacte termen en meetbare resultaten.“",
      prompt3Title: "Prompt 3: Ontdek vergeten ervaring (2 min)",
      prompt3Text: "„Vergelijk mijn CV met de vacature. Welke vereisten ontbreken en stel mij vragen om eerdere ervaringen naar boven te halen.“",
      goldenRulesTitle: "Gouden Regel",
      close: "Sluiten",
    },
    settings: {
      title: "Instellingen & AI-Engine",
      provider: "AI-Leverancier",
      apiKey: "API-Sleutel",
      model: "LLM-Model",
      endpoint: "Server-URL (Endpoint)",
      language: "Taal",
      theme: "Thema",
      cancel: "Annuleren",
      save: "Opslaan",
      localNote: "100% Lokaal & Gratis. Geen API-sleutel nodig voor Ollama of LM Studio.",
    },
  },
};
