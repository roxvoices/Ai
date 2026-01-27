

import { VoiceName, VoiceDefinition, Plan, TTSSettings } from './types';

export const APP_NAME = "Rox Studio";
export const ADMIN_EMAILS = ['markwell244@gmail.com'];

// ROX_STUDIO_LOGO_BASE64 has been removed from here permanently to prevent syntax errors.
// The logo is now rendered using an inline SVG component directly in Layout, TopBar, and Landing.

export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'es', name: 'Español' },
  { code: 'de', name: 'Deutsch' },
  { code: 'pt', name: 'Português' },
  { code: 'zh', name: '中文' }
];

export const TRANSLATIONS: Record<string, any> = {
  en: {
    // General
    home: "Home",
    settings: "Settings",
    login: "Login",
    register: "Register",
    logout: "Logout",
    tryIt: "Try It",
    comingSoon: "Coming Soon!",
    underConstruction: "This tool is currently under construction. Check back soon!",
    uploadFile: "Upload File",
    process: "Process",
    download: "Download",
    play: "Play",
    pause: "Pause",
    stop: "Stop",
    loading: "Loading...",
    error: "Error",
    clear: "Clear",
    preview: "Preview", 
    previewing: "Previewing...", 
    terms: "Terms",
    privacy: "Privacy",

    // Categories
    dashboard: "Dashboard",
    audioSuite: "Audio Suite",
    fileVault: "File Vault",
    mediaLab: "Media Lab",
    playground: "Playground",
    archives: "Archives", // Renamed for clarity
    system: "System",
    legal: "Legal", // New Category

    // Specific Tools
    ttsStudio: "TTS Studio", // Renamed from 'studio' / 'generate'
    ttsStudioDescription: "Unleash hyper-realistic voices for any text! Our advanced neural engine synthesizes human-like speech with incredible emotional depth, perfect for narratives, audiobooks, or marketing. Create engaging audio content effortlessly.",
    projects: "Projects",
    vault: "Vault", // Renamed from 'library' / 'history'
    voiceLab: "Voice Lab",
    
    // Audio Tools
    mergeAudio: "Merge Audio",
    mergeAudioDescription: "Seamlessly combine multiple audio files into a single, cohesive track. Perfect for stitching together voiceovers, music, or sound effects without complex editing software. Your audio projects, unified.",
    uploadedFiles: "Uploaded Files", 
    mergedAudio: "Merged Audio", 
    trimAudio: "Trim Audio",
    trimAudioDescription: "Precisely cut unwanted sections from the beginning or end of your audio clips. Achieve professional-grade edits with intuitive controls, ensuring your sound bites are clean and to the point. Focus on what matters.",
    loopAudio: "Loop Audio",
    loopAudioDescription: "Create continuous, seamless audio loops from your sound clips. Perfect for background music, ambient soundscapes, or rhythmic patterns in game development and media projects. Craft endlessly flowing audio.", // NEW Description
    volumeBooster: "Volume Booster",
    volumeBoosterDescription: "Amplify your audio tracks to enhance clarity and presence without distortion. Boost quiet recordings, increase vocal prominence, or ensure your sound meets industry loudness standards for any platform.",
    addFade: "Add Fade In/Out",
    addFadeDescription: "Apply smooth fade-in and fade-out effects to your audio clips. Create professional transitions, eliminate abrupt starts or ends, and polish your sound for a seamless listening experience. Control the dynamics of your tracks.",
    voiceRecorder: "Voice Recorder",
    voiceRecorderDescription: "Capture high-quality audio directly from your microphone. Ideal for recording voiceovers, podcasts, or musical ideas. Features real-time monitoring and easy saving for immediate use in your projects.",
    convertAudioFormat: "Convert Audio Format",
    convertAudioFormatDescription: "Transform audio files between various formats (e.g., WAV to MP3, OGG to FLAC). Ensure compatibility across different devices and platforms while maintaining optimal sound quality. Simple, fast, and versatile conversions.",
    startTime: "Start Time (s)",
    endTime: "End Time (s)",
    trimmedAudio: "Trimmed Audio",
    uploadAudioPrompt: "Upload an audio file (.mp3, .wav) to trim.",
    trimmingAudio: "Trimming Audio...",
    speed: "Speed",
    pitch: "Pitch", // NEW
    processingSpeed: "Processing Speed...",
    speedChangedAudio: "Speed-Changed Audio",

    // File Tools
    pdfToText: "PDF → Text",
    pdfToTextDescription: "Effortlessly extract all text content directly from your PDF documents in seconds. Convert complex PDFs into editable, searchable plain text, streamlining your data recovery and content repurposing workflows.",
    uploadPdfPrompt: "Upload a PDF file to extract text.",
    extractingText: "Extracted Text...",
    extractedText: "Extracted Text",
    textToPdf: "Text → PDF",
    textToPdfDescription: "Transform plain text or .txt files into polished, professional PDF documents. Ideal for creating reports, sharing notes, or archiving written content in a universally accessible and print-ready format.", // New description
    generatePdf: "Generate PDF", // New
    uploadTxtPrompt: "Upload a plain text file (.txt)", // New
    zipExtractor: "ZIP Extractor",
    zipExtractorDescription: "Quickly unpack compressed .zip archives with ease. Access your bundled files and folders instantly without the need for additional software. Streamline your workflow by managing archives directly in the studio.",
    fileCompressor: "Image Compressor", // Updated to specify "Image"
    fileCompressorDescription: "Optimize your digital footprint by reducing **image** file sizes significantly without compromising quality. Perfect for web optimization, faster uploads, and saving storage space. Keep your visuals sharp and efficient.", // Updated to specify "image"
    imageResizer: "Image Resizer",
    imageResizerDescription: "Adjust the dimensions of your images with precision. Scale photos for web, print, or social media without losing clarity. Batch process multiple images or fine-tune individual assets to fit any requirement.",
    docxToPdf: "DOCX → PDF",
    docxToPdfDescription: "Convert your Microsoft Word documents (.docx) into universally compatible PDF files. Ensure consistent formatting and secure sharing across all platforms. This feature leverages robust server-side processing for perfect conversion fidelity.",
    wordCounter: "Word Counter",
    wordCounterDescription: "Gain deep insights into your writing with precise counts of words, characters, sentences, and paragraphs. Essential for academic papers, content creation, and ensuring your text meets exact specifications.",
    pasteTextPrompt: "Paste your text here or upload a .txt file...",
    words: "Words",
    charactersWithSpaces: "Characters (with spaces)",
    charactersNoSpaces: "Characters (no spaces)",
    sentences: "Sentences",
    paragraphs: "Paragraphs",
    compressionQuality: "Compression Quality", // New
    originalSize: "Original Size", // New
    compressedSize: "Compressed Size", // New
    imageCompression: "Image Compression", // New
    fileNotSupported: "This file type is not supported. Please upload a .jpg or .png image file for compression.", // Updated to be specific
    pdfToWord: "PDF → Word", // New
    pdfToWordDescription: "Convert static PDF documents into fully editable Microsoft Word (.docx) files. Unlock your content for revisions, collaborative work or seamless integration into other document workflows. This feature utilizes secure server-side processing for superior accuracy.", // New - Updated description
    wordToPdf: "Word → PDF", // New
    wordToPdfDescription: "Effortlessly transform your Microsoft Word (.docx) documents into universally compatible PDF files. Ensure consistent formatting and secure sharing across all platforms. This feature leverages robust server-side processing for perfect conversion fidelity.", // New - Updated description


    // Media Tools
    videoToAudio: "Video → Audio",
    videoToAudioDescription: "Extract pristine audio tracks from any video file and save them as high-quality WAV files. Ideal for converting lectures, interviews, or music videos into listen-only formats for podcasts, analysis, or sound design projects. This feature requires server-side processing and is coming soon.", // New description
    gifMaker: "GIF Maker",
    gifMakerDescription: "Create animated GIFs from video clips or image sequences. Design dynamic visuals for social media, presentations, or web content with custom timing and effects. Bring your visuals to life with engaging short loops.",
    memeGenerator: "Meme Generator",
    memeGeneratorDescription: "Generate hilarious memes with customizable text, images, and templates. Express your creativity and share trending content with friends, followers, or your community. Craft viral content instantly.",

    // Fun Tools
    voiceChanger: "Voice Changer",
    voiceChangerDescription: "Transform your voice in real-time with exciting pitch effects. Experiment with high-pitched chipmunk sounds, deep monster tones, or subtle vocal adjustments. Unleash your creativity and add a fun twist to your audio.",
    startMic: "Start Microphone",
    stopMic: "Stop Microphone",
    micPermissionDenied: "Microphone permission denied. Please allow access in browser settings.",
    soundboard: "Soundboard",
    soundboardDescription: "Curate and play custom sound effects, music snippets, or vocal cues instantly. Perfect for live streams, podcasts, or interactive presentations to add dynamic audio elements on the fly.",
  },
  fr: {
    // General
    home: "Accueil",
    settings: "Paramètres",
    login: "Connexion",
    register: "S'inscrire",
    logout: "Déconnexion",
    tryIt: "Essayer",
    comingSoon: "Bientôt Disponible !",
    underConstruction: "Cet outil est en cours de construction. Revenez bientôt !",
    uploadFile: "Télécharger un fichier",
    process: "Traiter",
    download: "Télécharger",
    play: "Lecture",
    pause: "Pause",
    stop: "Arrêter",
    loading: "Chargement...",
    error: "Erreur",
    clear: "Effacer",
    preview: "Aperçu", 
    previewing: "Prévisualisation...", 
    terms: "Conditions",
    privacy: "Confidentialité",

    // Categories
    dashboard: "Tableau de bord",
    audioSuite: "Suite Audio",
    fileVault: "Coffre-fort Fichiers",
    mediaLab: "Labo Média",
    playground: "Terrain de jeu",
    archives: "Archives",
    system: "Système",
    legal: "Légal", // New Category

    // Specific Tools
    ttsStudio: "Studio TTS",
    ttsStudioDescription: "Libérez des voix hyper-réalistes pour n'importe quel texte ! Notre moteur neuronal avancé synthétise une parole humaine avec une profondeur émotionnelle incroyable, parfaite pour les récits, les livres audio ou le marketing. Créez du contenu audio captivant sans effort.",
    projects: "Projets",
    vault: "Coffre-fort",
    voiceLab: "Labo Vocal",

    // Audio Tools
    mergeAudio: "Fusionner Audio",
    mergeAudioDescription: "Fusionnez en toute transparence plusieurs fichiers audio en une seule piste cohérente. Parfait pour assembler des voix off, de la musique ou des effets sonores sans logiciel d'édition complexe. Vos projets audio, unifiés.",
    uploadedFiles: "Fichiers Téléchargés", 
    mergedAudio: "Audio Fusionné", 
    trimAudio: "Couper Audio",
    trimAudioDescription: "Coupez précisément les sections indésirables du début ou de la fin de vos clips audio. Réalisez des montages de qualité professionnelle avec des commandes intuitives, garantissant que vos extraits sonores sont nets et précis. Concentrez-vous sur l'essentiel.",
    loopAudio: "Boucler Audio",
    loopAudioDescription: "Créez des boucles audio continues et fluides à partir de vos clips sonores. Parfait pour la musique de fond, les paysages sonores ambiants ou les motifs rythmiques dans le développement de jeux et les projets multimédias. Créez un flux audio infini.", // NEW Description
    volumeBooster: "Amplificateur Volume",
    volumeBoosterDescription: "Amplifiez vos pistes audio pour améliorer la clarté et la présence sans distorsion. Boostez les enregistrements silencieux, augmentez la proéminence vocale ou assurez-vous que votre son respecte les normes de volume de l'industrie pour toute plateforme.",
    addFade: "Ajouter Fondu",
    addFadeDescription: "Appliquez des effets de fondu en entrée et en sortie fluides à vos clips audio. Créez des transitions professionnelles, éliminez les débuts ou les fins brusques et peaufinez votre son pour une expérience d'écoute sans faille. Contrôlez la dynamique de vos pistes.",
    voiceRecorder: "Enregistreur Vocal",
    voiceRecorderDescription: "Capturez un son de haute qualité directement depuis votre microphone. Idéal pour enregistrer des voix off, des podcasts ou des idées musicales. Offre une surveillance en temps réel et une sauvegarde facile pour une utilisation immédiate dans vos projets.",
    convertAudioFormat: "Convertir Format Audio",
    convertAudioFormatDescription: "Transformez des fichiers audio entre différents formats (par exemple, WAV en MP3, OGG en FLAC). Assurez la compatibilité sur différents appareils et plateformes tout en maintenant une qualité sonore optimale. Conversions simples, rapides et polyvalentes.",
    startTime: "Heure de début (s)",
    endTime: "Heure de fin (s)",
    trimmedAudio: "Audio Découpé",
    uploadAudioPrompt: "Téléchargez un fichier audio (.mp3, .wav) à découper.",
    trimmingAudio: "Découpage Audio...",
    speed: "Vitesse",
    pitch: "Hauteur", // NEW
    processingSpeed: "Traitement de la vitesse...",
    speedChangedAudio: "Audio à vitesse modifiée",

    // File Tools
    pdfToText: "PDF → Texte",
    pdfToTextDescription: "Extrayez sans effort tout le contenu textuel directement de vos documents PDF en quelques secondes. Convertissez des PDF complexes en texte brut éditable et consultable, rationalisant ainsi vos flux de récupération de données et de réutilisation de contenu.",
    uploadPdfPrompt: "Téléchargez un fichier PDF pour en extraire le texte.",
    extractingText: "Extraction du texto...",
    extractedText: "Texto Extrait",
    textToPdf: "Texte → PDF",
    textToPdfDescription: "Transformez du texte brut ou des fichiers .txt en documents PDF soignés et professionnels. Idéal pour créer des rapports, partager des notes ou archiver du contenu écrit dans un format universellement accessible et prêt à imprimer.", // New description
    generatePdf: "Générer PDF", // New
    uploadTxtPrompt: "Téléchargez un fichier texte (.txt)", // New
    zipExtractor: "Extracteur ZIP",
    zipExtractorDescription: "Décompressez rapidement les archives .zip avec facilité. Accédez instantanément à vos fichiers et dossiers regroupés sans avoir besoin de logiciels supplémentaires. Rationalisez votre flux de travail en gérant les archives directement dans le studio.",
    fileCompressor: "Compresseur d'Image", // Updated to specify "Image"
    fileCompressorDescription: "Optimisez votre empreinte numérique en réduisant considérablement la taille des fichiers **image** sans compromettre la qualité. Parfait pour l'optimisation web, les téléchargements plus rapides et l'économie d'espace de stockage. Gardez vos visuels nets et efficaces.", // Updated to specify "image"
    imageResizer: "Redimensionner Image",
    imageResizerDescription: "Ajustez les dimensions de vos images avec précision. Adaptez les photos pour le web, l'impression ou les réseaux sociaux sans perdre en clarté. Traitez plusieurs images par lot ou affinez des actifs individuels pour répondre à toutes les exigences.",
    docxToPdf: "DOCX → PDF",
    docxToPdfDescription: "Convertissez vos documents Microsoft Word (.docx) en fichiers PDF universallement compatibles. Assurez un formatage cohérent et un partage sécurisé sur toutes les plateformes. Cette fonctionnalité s'appuie sur un traitement robuste côté serveur pour une fidélité de conversion parfaite.",
    wordCounter: "Compteur de Mots",
    wordCounterDescription: "Obtenez des informations détaillées sur votre écriture avec un décompte précis des mots, caractères, phrases et paragraphes. Essentiel pour les travaux universitaires, la création de contenu et pour vous assurer que votre texte répond aux spécifications exactes.",
    pasteTextPrompt: "Collez votre texte ici ou téléchargez un fichier .txt...",
    words: "Mots",
    charactersWithSpaces: "Caractères (avec espaces)",
    charactersNoSpaces: "Caractères (sans espaces)",
    sentences: "Phrases",
    paragraphs: "Paragraphes",
    compressionQuality: "Qualité de Compression", // New
    originalSize: "Taille Originale", // New
    compressedSize: "Taille Compressée", // New
    imageCompression: "Compression d'image", // New
    fileNotSupported: "Ce type de fichier n'est pas pris en charge. Veuillez télécharger un fichier image .jpg ou .png pour la compression.", // Updated to be specific
    pdfToWord: "PDF → Word", // New
    pdfToWordDescription: "Convertissez des documents PDF statiques en fichiers Microsoft Word (.docx) entièrement éditables. Débloquez votre contenu pour des révisions, un travail collaboratif ou une intégration transparente dans d'autres flux de travail documentaires. Cette fonctionnalité utilise un traitement sécurisé côté serveur pour une précision supérieure.", // New - Updated description
    wordToPdf: "Word → PDF", // New
    wordToPdfDescription: "Transformez sans effort vos documents Microsoft Word (.docx) en fichiers PDF universallement compatibles. Assurez un formatage cohérent et un partage sécurisé sur toutes les plateformes. Cette fonctionnalité s'appuie sur un traitement robuste côté serveur pour une fidélité de conversion parfaite.", // New - Updated description

    // Media Tools
    videoToAudio: "Vidéo → Audio",
    videoToAudioDescription: "Extrayez des pistes audio impeccables de n'importe quel fichier vidéo et enregistrez-les sous forme de fichiers WAV de haute qualité. Idéal pour convertir des conférences, des interviews ou des clips musicaux en formats audio uniquement pour des podcasts, des analyses ou des projets de conception sonore. Cette fonctionnalité nécessite un traitement côté serveur et sera bientôt disponible.", // New description
    gifMaker: "Créateur GIF",
    gifMakerDescription: "Créez des GIF animés à partir de clips vidéo ou de séquences d'images. Concevez des visuels dynamiques pour les médias sociaux, les présentations ou le contenu Web avec un timing et des effets personnalisés. Donnez vie à vos visuels avec des boucles courtes et attrayantes.",
    memeGenerator: "Générateur de Mèmes",
    memeGeneratorDescription: "Générez des mèmes hilarants avec du texte, des images et des modèles personnalisables. Exprimez votre créativité et partagez du contenu tendance avec vos amis, vos abonnés ou votre communauté. Créez du contenu viral instantanément.",

    // Fun Tools
    voiceChanger: "Changeur de Voix",
    voiceChangerDescription: "Transformez votre voix en temps réel avec des effets de hauteur excitantss. Expérimentez avec des sons d'écureuil aigus, des tons de monstre profonds ou des ajustements vocaux subtils. Libérez votre créativité et ajoutez une touche amusante à votre audio.",
    startMic: "Démarrer Microphone",
    stopMic: "Arrêter Microphone",
    micPermissionDenied: "Autorisation du microphone refusée. Veuillez autoriser l'accès dans les paramètres du navigateur.",
    soundboard: "Table d'harmonie",
    soundboardDescription: "Organisez et lisez instantanément des effets sonores personnalisés, des extraits musicaux ou des signaux vocaux. Parfait pour les diffusions en direct, les podcasts ou les présentations interactives afin d'ajouter des éléments audio dynamiques à la volée.",
  },
  es: {
    // General
    home: "Inicio",
    settings: "Ajustes",
    login: "Iniciar Sesión",
    register: "Registrarse",
    logout: "Cerrar Sesión",
    tryIt: "Probar",
    comingSoon: "¡Próximamente!",
    underConstruction: "Esta herramienta está en construcción. ¡Vuelve pronto!",
    uploadFile: "Subir archivo",
    process: "Procesar",
    download: "Descargar",
    play: "Reproducir",
    pause: "Pausa",
    stop: "Detener",
    loading: "Cargando...",
    error: "Error",
    clear: "Borrar",
    preview: "Vista previa", 
    previewing: "Previsualizando...", 
    terms: "Términos",
    privacy: "Privacidad",

    // Categories
    dashboard: "Panel de control",
    audioSuite: "Suite de Audio",
    fileVault: "Bóveda de Archivos",
    mediaLab: "Laboratorio Multimedia",
    playground: "Patio de juegos",
    archives: "Archivos",
    system: "Sistema",
    legal: "Legal", // New Category

    // Specific Tools
    ttsStudio: "Estudio TTS",
    ttsStudioDescription: "¡Libera voces hiperrealistas para cualquier texto! Nuestro motor neuronal avanzado sintetiza el habla humana con una profundidad emocional increíble, perfecta para narraciones, audiolibros o marketing. Crea contenido de audio atractivo sin esfuerzo.",
    projects: "Proyectos",
    vault: "Bóveda",
    voiceLab: "Laboratorio de Voz",

    // Audio Tools
    mergeAudio: "Fusionar Audio",
    mergeAudioDescription: "Combina sin problemas múltiples archivos de audio en una sola pista cohesiva. Perfecto para unir voces en off, música o efectos de sonido sin software de edición complejo. Tus proyectos de audio, unificados.",
    uploadedFiles: "Archivos Cargados", 
    mergedAudio: "Audio Fusionado", 
    trimAudio: "Recortar Audio",
    trimAudioDescription: "Corta con precisión secciones no deseadas del principio o final de tus clips de audio. Logra ediciones de nivel profesional con controles intuitivos, asegurando que tus fragmentos de sonido sean claros y directos. Concéntrate en lo importante.",
    loopAudio: "Repetir Audio",
    loopAudioDescription: "Crea bucles de audio continuos y sin interrupciones a partir de tus clips de sonido. Perfecto para música de fondo, paisajes sonoros ambientales o patrones rítmicos en el desarrollo de juegos y proyectos multimedia. Crea audio que fluya sin fin.", // NEW Description
    volumeBooster: "Potenciador de Volumen",
    volumeBoosterDescription: "Amplifica tus pistas de audio para mejorar la claridad y la presencia sin distorsión. Aumenta las grabaciones silenciosas, realza la prominencia vocal o asegúrate de que tu sonido cumpla con los estándares de sonoridad de la industria para cualquier plataforma.",
    addFade: "Añadir Fundido",
    addFadeDescription: "Aplica efectos de fundido de entrada y salida suaves a tus clips de audio. Crea transiciones profesionales, elimina inicios o finales abruptos y pule tu sonido para una experiencia auditiva perfecta. Controla la dinámica de tus pistas.",
    voiceRecorder: "Grabadora de Voz",
    voiceRecorderDescription: "Captura audio de alta calidad directamente desde tu micrófono. Ideal para grabar voces en off, podcasts o ideas musicales. Incluye monitoreo en tiempo real y fácil guardado para su uso inmediato en tus proyectos.",
    convertAudioFormat: "Convertir Formato de Audio",
    convertAudioFormatDescription: "Transforma archivos de audio entre varios formatos (por ejemplo, WAV a MP3, OGG a FLAC). Garantiza la compatibilidad entre diferentes dispositivos y plataformas manteniendo una calidad de sonido óptima. Conversiones sencillas, rápidas y versátiles.",
    startTime: "Tiempo de inicio (s)",
    endTime: "Tiempo de fin (s)",
    trimmedAudio: "Audio Recortado",
    uploadAudioPrompt: "Sube un archivo de audio (.mp3, .wav) para recortar.",
    trimmingAudio: "Recortando audio...",
    speed: "Velocidad",
    pitch: "Tono", // NEW
    processingSpeed: "Procesando velocidad...",
    speedChangedAudio: "Audio con velocidad modificada",

    // File Tools
    pdfToText: "PDF → Texto",
    pdfToTextDescription: "Extrae sin esfuerzo todo el contenido de texto directamente de tus documentos PDF en segundos. Convierte PDFs complejos en texto plano editable y consultable, optimizando tus flujos de trabajo de recuperación de datos y reutilización de contenido.",
    uploadPdfPrompt: "Sube un archivo PDF para extraer texto.",
    extractingText: "Extrayendo texto...",
    extractedText: "Texto Extraído",
    textToPdf: "Texto → PDF",
    textToPdfDescription: "Convierte texto plano o archivos .txt en documentos PDF pulcros y profesionales. Ideal para crear informes, compartir notas o archivar contenido escrito en un formato universalmente accesible y listo para imprimir.", // New description
    generatePdf: "Generar PDF", // New
    uploadTxtPrompt: "Sube un archivo de texto plano (.txt)", // New
    zipExtractor: "Extractor ZIP",
    zipExtractorDescription: "Descomprime rápidamente archivos .zip comprimidos con facilidad. Accede a tus archivos y carpetas agrupados instantáneamente sin necesidad de software adicional. Optimiza tu flujo de trabajo gestionando archivos directamente en el estudio.",
    fileCompressor: "Compresor de Imágenes", // Updated to specify "Imágenes"
    fileCompressorDescription: "Optimiza tu huella digital reduciendo significativamente el tamaño de los archivos de **imagen** sin comprometer la calidad. Perfecto para la optimización web, cargas más rápidas y ahorro de espacio de almacenamiento. Mantén tus imágenes nítidas y eficientes.", // Updated to specify "imagen"
    imageResizer: "Redimensionador de Imágenes",
    imageResizerDescription: "Ajusta las dimensiones de tus imágenes con precisión. Escala fotos para web, impresión o redes sociales sin perder claridad. Procesa múltiples imágenes por lotes o ajusta activos individuales para adaptarse a cualquier requisito.",
    docxToPdf: "DOCX → PDF",
    docxToPdfDescription: "Convierte tus documentos de Microsoft Word (.docx) en archivos PDF universalmente compatibles. Asegura un formato consistente y un uso compartido seguro en todas las plataformas. Esta función aprovecha un robusto procesamiento del lado del servidor para una fidelidad de conversión perfecta.",
    wordCounter: "Contador de Palabras",
    wordCounterDescription: "Obtén información detallada sobre tu escritura con recuentos precisos de palabras, caracteres, frases y párrafos. Esencial para trabajos académicos, creación de contenido y para asegurar que tu texto cumple con especificaciones exactas.",
    pasteTextPrompt: "Pega tu texto aquí o sube un archivo .txt...",
    words: "Palabras",
    charactersWithSpaces: "Carácteres (con espacios)",
    charactersNoSpaces: "Carácteres (sin espacios)",
    sentences: "Oraciones",
    paragraphs: "Párrafos",
    compressionQuality: "Calidad de Compresión", // New
    originalSize: "Tamaño Original", // New
    compressedSize: "Tamaño Comprimido", // New
    imageCompression: "Compresión de imagen", // New
    fileNotSupported: "Este tipo de archivo no es compatible. Por favor, sube un archivo de imagen .jpg o .png para la compresión.", // Updated to be specific
    pdfToWord: "PDF → Word", // New
    pdfToWordDescription: "Convierte documentos PDF estáticos en archivos de Microsoft Word (.docx) completamente editables. Desbloquea tu contenido para revisiones, trabajo colaborativo o integración perfecta en otros flujos de trabajo de documentos. Esta función utiliza un procesamiento seguro del lado del servidor para una precisión superior.", // New - Updated description
    wordToPdf: "Word → PDF", // New
    wordToPdfDescription: "Transforma sin esfuerzo tus documentos de Microsoft Word (.docx) en archivos PDF universalmente compatibles. Asegura un formato consistente y un uso compartido seguro en todas las plataformas. Esta función aprovecha un robusto procesamiento del lado del servidor para una fidelidad de conversión perfecta.", // New - Updated description

    // Media Tools
    videoToAudio: "Video → Audio",
    videoToAudioDescription: "Extrae pistas de audio prístinas de cualquier archivo de video y guárdalas como archivos WAV de alta calidad. Ideal para convertir conferencias, entrevistas o videos musicales en formatos de solo audio para podcasts, análisis o proyectos de diseño de sonido. Esta función requiere un procesamiento del lado del servidor y será pronto disponible.", // New description
    gifMaker: "Creador GIF",
    gifMakerDescription: "Crea GIFs animados a partir de clips de video o secuencias de imágenes. Diseña visuales dinámicos para redes sociales, presentaciones o contenido web con tiempos y efectos personalizados. Da vida a tus imágenes con bucles cortos y atractivos.",
    memeGenerator: "Generador de Mèmes",
    memeGeneratorDescription: "Genera memes hilarantes con texto, imágenes y plantillas personalizables. Expresa tu creatividad y comparte contenido de tendencia con amigos, seguidores o tu comunidad. Crea contenido viral al instante.",

    // Fun Tools
    voiceChanger: "Cambiador de Voz",
    voiceChangerDescription: "Transforma tu voz en real-time con emocionantes efectos de tono. Experimenta con sonidos agudos de ardilla, tonos de monstro profundos o ajustes vocales sutiles. Libera tu creatividad y añade una touche amusante a tu audio.",
    startMic: "Démarrer Microphone",
    stopMic: "Arrêter Microphone",
    micPermissionDenied: "Autorisation du microphone refusée. Veuillez autoriser l'accès dans les paramètres du navigateur.",
    soundboard: "Tabla de Sonidos",
    soundboardDescription: "Cura y reproduce efectos de sonido personalizados, fragmentos de música o señales vocales al instante. Perfecto para transmisiones en vivo, podcasts o presentaciones interactivas para agregar elementos de audio dinámicos sobre la marcha.",
  },
  de: {
    // General
    home: "Startseite",
    settings: "Einstellungen",
    login: "Anmelden",
    register: "Registrieren",
    logout: "Abmelden",
    tryIt: "Ausprobieren",
    comingSoon: "Bald verfügbar!",
    underConstruction: "Dieses Tool wird derzeit entwickelt. Schauen Sie bald wieder vorbei!",
    uploadFile: "Datei hochladen",
    process: "Verarbeiten",
    download: "Herunterladen",
    play: "Abspielen",
    pause: "Pause",
    stop: "Stopp",
    loading: "Lädt...",
    error: "Fehler",
    clear: "Löschen",
    preview: "Vorschau", 
    previewing: "Vorschau wird generiert...", 
    terms: "Nutzungsbedingungen",
    privacy: "Datenschutz",

    // Categories
    dashboard: "Dashboard",
    audioSuite: "Audio Suite",
    fileVault: "Datei-Tresor",
    mediaLab: "Medienlabor",
    playground: "Spielwiese",
    archives: "Archive",
    system: "System",
    legal: "Rechtliches",

    // Specific Tools
    ttsStudio: "TTS Studio",
    ttsStudioDescription: "Entfesseln Sie hyperrealistische Stimmen für jeden Text! Unsere fortschrittliche neuronale Engine synthetisiert menschenähnliche Sprache mit unglaublicher emotionaler Tiefe, perfekt für Erzählungen, Hörbücher oder Marketing. Erstellen Sie mühelos ansprechende Audioinhalte.",
    projects: "Projekte",
    vault: "Tresor",
    voiceLab: "Stimmenlabor",
    
    // Audio Tools
    mergeAudio: "Audio zusammenführen",
    mergeAudioDescription: "Führen Sie mehrere Audiodateien nahtlos zu einem einzigen, zusammenhängenden Track zusammen. Perfekt zum Verknüpfen von Voiceovers, Musik oder Soundeffekten ohne komplexe Bearbeitungssoftware. Ihre Audioprojekte, vereint.",
    uploadedFiles: "Hochgeladene Dateien", 
    mergedAudio: "Zusammengeführtes Audio", 
    trimAudio: "Audio trimmen",
    trimAudioDescription: "Schneiden Sie unerwünschte Abschnitte am Anfang oder Ende Ihrer Audioclips präzise. Erreichen Sie professionelle Bearbeitungen mit intuitiven Bedienelementen, die sicherstellen, dass Ihre Soundbites klar und auf den Punkt sind. Konzentrieren Sie sich auf das Wesentliche.",
    loopAudio: "Audio loopen",
    loopAudioDescription: "Erstellen Sie kontinuierliche, nahtlose Audio-Loops aus Ihren Soundclips. Perfekt für Hintergrundmusik, Ambient-Klanglandschaften oder rhythmische Muster in der Spieleentwicklung und bei Medienprojekten. Erstellen Sie endlos fließendes Audio.",
    volumeBooster: "Lautstärke-Booster",
    volumeBoosterDescription: "Verstärken Sie Ihre Audiospuren, um Klarheit und Präsenz ohne Verzerrung zu verbessern. Verstärken Sie leise Aufnahmen, erhöhen Sie die Stimmpräsenz oder stellen Sie sicher, dass Ihr Sound die Industriestandards für die Lautstärke auf jeder Plattform erfüllt.",
    addFade: "Ein-/Ausblenden hinzufügen",
    addFadeDescription: "Wenden Sie sanfte Ein- und Ausblendeffekte auf Ihre Audioclips an. Erstellen Sie professionelle Übergänge, eliminieren Sie abrupte Anfänge oder Enden und polieren Sie Ihren Sound für ein nahtloses Hörerlebnis. Kontrollieren Sie die Dynamik Ihrer Spuren.",
    voiceRecorder: "Sprachrekorder",
    voiceRecorderDescription: "Nehmen Sie hochwertige Audio direkt von Ihrem Mikrofon auf. Ideal zum Aufnehmen von Voiceovers, Podcasts oder musikalischen Ideen. Bietet Echtzeitüberwachung und einfaches Speichern zur sofortigen Verwendung in Ihren Projekten.",
    convertAudioFormat: "Audioformat konvertieren",
    convertAudioFormatDescription: "Wandeln Sie Audiodateien zwischen verschiedenen Formaten (z. B. WAV in MP3, OGG in FLAC) um. Gewährleisten Sie die Kompatibilität auf verschiedenen Geräten und Plattformen bei optimaler Klangqualität. Einfache, schnelle und vielseitige Konvertierungen.",
    startTime: "Startzeit (s)",
    endTime: "Endzeit (s)",
    trimmedAudio: "Getrimmtes Audio",
    uploadAudioPrompt: "Laden Sie eine Audiodatei (.mp3, .wav) zum Trimmen hoch.",
    trimmingAudio: "Trimmen von Audio...",
    speed: "Geschwindigkeit",
    pitch: "Tonhöhe",
    processingSpeed: "Geschwindigkeit wird verarbeitet...",
    speedChangedAudio: "Geschwindigkeit geändertes Audio",

    // File Tools
    pdfToText: "PDF → Text",
    pdfToTextDescription: "Extrahieren Sie mühelos alle Textinhalte direkt aus Ihren PDF-Dokumenten in Sekundenschnelle. Konvertieren Sie komplexe PDFs in editierbaren, durchsuchbaren Klartext, um Ihre Datenwiederherstellungs- und Inhaltswiederverwendungs-Workflows zu optimieren.",
    uploadPdfPrompt: "Laden Sie eine PDF-Datei hoch, um Text zu extrahieren.",
    extractingText: "Text wird extrahiert...",
    extractedText: "Extrahierter Text",
    textToPdf: "Text → PDF",
    textToPdfDescription: "Verwandeln Sie einfachen Text oder .txt-Dateien in professionelle PDF-Dokumente. Ideal zum Erstellen von Berichten, Teilen von Notizen oder Archivieren von schriftlichen Inhalten in einem universell zugänglichen und druckfertigen Format.",
    generatePdf: "PDF generieren",
    uploadTxtPrompt: "Laden Sie eine reine Textdatei (.txt) hoch",
    zipExtractor: "ZIP Extractor",
    zipExtractorDescription: "Entpacken Sie komprimierte .zip-Archive schnell und einfach. Greifen Sie sofort auf Ihre gebündelten Dateien und Ordner zu, ohne zusätzliche Software zu benötigen. Optimieren Sie Ihren Workflow, indem Sie Archive direkt im Studio verwalten.",
    fileCompressor: "Bildkompressor",
    fileCompressorDescription: "Optimieren Sie Ihren digitalen Fußabdruck, indem Sie die Größe von **Bilddateien** erheblich reduzieren, ohne die Qualität zu beeinträchtigen. Perfekt für Weboptimierung, schnellere Uploads und das Sparen von Speicherplatz. Halten Sie Ihre Bilder scharf und effizient.",
    imageResizer: "Bild-Resizer",
    imageResizerDescription: "Passen Sie die Abmessungen Ihrer Bilder präzise an. Skalieren Sie Fotos für Web, Druck oder soziale Medien ohne Qualitätsverlust. Verarbeiten Sie mehrere Bilder stapelweise oder optimieren Sie einzelne Assets, um alle Anforderungen zu erfüllen.",
    docxToPdf: "DOCX → PDF",
    docxToPdfDescription: "Konvertieren Sie Ihre Microsoft Word-Dokumente (.docx) in universell kompatible PDF-Dateien. Sorgen Sie für konsistente Formatierung und sichere Freigabe auf allen Plattformen. Diese Funktion nutzt eine robuste serverseitige Verarbeitung für perfekte Konvertierungsgenauigkeit.",
    wordCounter: "Wortzähler",
    wordCounterDescription: "Erhalten Sie detaillierte Einblicke in Ihr Schreiben mit präzisen Zählungen von Wörtern, Zeichen, Sätzen und Absätzen. Wesentlich für wissenschaftliche Arbeiten, die Erstellung von Inhalten und die Sicherstellung, dass Ihr Text genaue Spezifikationen erfüllt.",
    pasteTextPrompt: "Fügen Sie Ihren Text hier ein oder laden Sie eine .txt-Datei hoch...",
    words: "Wörter",
    charactersWithSpaces: "Zeichen (mit Leerzeichen)",
    charactersNoSpaces: "Zeichen (ohne Leerzeichen)",
    sentences: "Sätze",
    paragraphs: "Absätze",
    compressionQuality: "Kompressionsqualität",
    originalSize: "Originalgröße",
    compressedSize: "Komprimierte Größe",
    imageCompression: "Bildkompression",
    fileNotSupported: "Dieser Dateityp wird nicht unterstützt. Bitte laden Sie eine .jpg- oder .png-Bilddatei zur Komprimierung hoch.",
    pdfToWord: "PDF → Word",
    pdfToWordDescription: "Konvertieren Sie statische PDF-Dokumente in vollständig editierbare Microsoft Word (.docx)-Dateien. Schalten Sie Ihre Inhalte für Überarbeitungen, Zusammenarbeit oder nahtlose Integration in andere Dokumenten-Workflows frei. Diese Funktion nutzt eine sichere serverseitige Verarbeitung für überragende Genauigkeit.",
    wordToPdf: "Word → PDF",
    wordToPdfDescription: "Transformieren Sie Ihre Microsoft Word (.docx)-Dokumente mühelos in universell kompatible PDF-Dateien. Sorgen Sie für konsistente Formatierung und sichere Freigabe auf allen Plattformen. Diese Funktion nutzt eine robuste serverseitige Verarbeitung für perfekte Konvertierungsgenauigkeit.",

    // Media Tools
    videoToAudio: "Video → Audio",
    videoToAudioDescription: "Extrahieren Sie makellose Audiospuren aus jeder Videodatei und speichern Sie sie als hochwertige WAV-Dateien. Ideal zum Konvertieren von Vorträgen, Interviews oder Musikvideos in reine Audioformate für Podcasts, Analysen oder Sounddesign-Projekte. Diese Funktion erfordert serverseitige Verarbeitung und ist bald verfügbar.",
    gifMaker: "GIF-Ersteller",
    gifMakerDescription: "Erstellen Sie animierte GIFs aus Videoclips oder Bildsequenzen. Gestalten Sie dynamische Visuals für soziale Medien, Präsentationen oder Webinhalte mit benutzerdefinierten Timings und Effekten. Erwecken Sie Ihre Visuals mit ansprechenden kurzen Loops zum Leben.",
    memeGenerator: "Meme-Generator",
    memeGeneratorDescription: "Erstellen Sie lustige Memes mit anpassbarem Text, Bildern und Vorlagen. Drücken Sie Ihre Kreativität aus und teilen Sie Trendinhalte mit Freunden, Followern oder Ihrer Community. Erstellen Sie sofort virale Inhalte.",

    // Fun Tools
    voiceChanger: "Stimmenverzerrer",
    voiceChangerDescription: "Verwandeln Sie Ihre Stimme in Echtzeit mit aufregenden Tonhöheneffekten. Experimentieren Sie mit hohen Chipmunk-Klängen, tiefen Monstertönen oder subtilen Stimmkorrekturen. Entfesseln Sie Ihre Kreativität und verleihen Sie Ihrem Audio eine lustige Note.",
    startMic: "Mikrofon starten",
    stopMic: "Mikrofon stoppen",
    micPermissionDenied: "Mikrofonberechtigung verweigert. Bitte erlauben Sie den Zugriff in den Browsereinstellungen.",
    soundboard: "Soundboard",
    soundboardDescription: "Kuratiere und spiele Soundeffekte, Musikausschnitte oder Sprachbefehle sofort ab. Perfekt für Live-Streams, Podcasts oder interaktive Präsentationen, um dynamische Audioelemente spontan hinzuzufügen.",
  },
  pt: {
    // General
    home: "Início",
    settings: "Configurações",
    login: "Entrar",
    register: "Registrar",
    logout: "Sair",
    tryIt: "Experimentar",
    comingSoon: "Em Breve!",
    underConstruction: "Esta ferramenta está em construção. Volte em breve!",
    uploadFile: "Carregar arquivo",
    process: "Processar",
    download: "Baixar",
    play: "Reproduzir",
    pause: "Pausar",
    stop: "Parar",
    loading: "Carregando...",
    error: "Erro",
    clear: "Limpar",
    preview: "Pré-visualização", 
    previewing: "Pré-visualizando...", 
    terms: "Termos",
    privacy: "Privacidade",

    // Categories
    dashboard: "Painel",
    audioSuite: "Suíte de Áudio",
    fileVault: "Cofre de Arquivos",
    mediaLab: "Laboratório de Mídia",
    playground: "Parque de Jogos",
    archives: "Arquivos",
    system: "Sistema",
    legal: "Legal",

    // Specific Tools
    ttsStudio: "Estúdio TTS",
    ttsStudioDescription: "Liberte vozes hiper-realistas para qualquer texto! Nosso motor neural avançado sintetiza fala humana com incrível profundidade emocional, perfeito para narrativas, audiolivros ou marketing. Crie conteúdo de áudio envolvente sem esforço.",
    projects: "Projetos",
    vault: "Cofre",
    voiceLab: "Laboratório de Voz",
    
    // Audio Tools
    mergeAudio: "Mesclar Áudio",
    mergeAudioDescription: "Combine facilmente vários arquivos de áudio em uma única faixa coesa. Perfeito para juntar locuções, músicas ou efeitos sonoros sem software de edição complexo. Seus projetos de áudio, unificados.",
    uploadedFiles: "Arquivos Carregados", 
    mergedAudio: "Áudio Mesclado", 
    trimAudio: "Cortar Áudio",
    trimAudioDescription: "Corte com precisão seções indesejadas do início ou fim de seus clipes de áudio. Obtenha edições de nível profissional com controles intuitivos, garantindo que seus trechos de som sejam claros e diretos. Concentre-se no que importa.",
    loopAudio: "Loop de Áudio",
    loopAudioDescription: "Crie loops de áudio contínuos e sem falhas a partir de seus clipes de som. Perfeito para música de fundo, paisagens sonoras ambientes ou padrões rítmicos no desenvolvimento de jogos e projetos de mídia. Crie áudio com fluxo infinito.",
    volumeBooster: "Aumentador de Volume",
    volumeBoosterDescription: "Amplifique suas faixas de áudio para melhorar a clareza e a presença sem distorção. Aumente gravações silenciosas, aumente a proeminência vocal ou garanta que seu som atenda aos padrões de volume da indústria para qualquer plataforma.",
    addFade: "Adicionar Fade In/Out",
    addFadeDescription: "Aplique efeitos de fade-in e fade-out suaves aos seus clipes de áudio. Crie transições profissionais, elimine inícios ou fins abruptos e aprimore seu som para uma experiência auditiva perfeita. Controle a dinâmica de suas faixas.",
    voiceRecorder: "Gravador de Voz",
    voiceRecorderDescription: "Capture áudio de alta qualidade diretamente do seu microfone. Ideal para gravar locuções, podcasts ou ideias musicais. Possui monitoramento em tempo real e fácil salvamento para uso imediato em seus projetos.",
    convertAudioFormat: "Converter Formato de Áudio",
    convertAudioFormatDescription: "Transforme arquivos de áudio entre vários formatos (por exemplo, WAV para MP3, OGG para FLAC). Garanta a compatibilidade em diferentes dispositivos e plataformas, mantendo a qualidade sonora ideal. Conversões simples, rápidas e versáteis.",
    startTime: "Hora de Início (s)",
    endTime: "Hora de Fim (s)",
    trimmedAudio: "Áudio Cortado",
    uploadAudioPrompt: "Carregue um arquivo de áudio (.mp3, .wav) para cortar.",
    trimmingAudio: "Cortando Áudio...",
    speed: "Velocidade",
    pitch: "Tom",
    processingSpeed: "Processando velocidade...",
    speedChangedAudio: "Áudio com Velocidade Alterada",

    // File Tools
    pdfToText: "PDF → Texto",
    pdfToTextDescription: "Extraia sem esforço todo o conteúdo de texto diretamente de seus documentos PDF em segundos. Converta PDFs complexos em texto simples editável e pesquisável, otimizando seus fluxos de trabalho de recuperação de dados e reaproveitamento de conteúdo.",
    uploadPdfPrompt: "Carregue um arquivo PDF para extrair texto.",
    extractingText: "Extraindo Texto...",
    extractedText: "Texto Extraído",
    textToPdf: "Texto → PDF",
    textToPdfDescription: "Transforme texto simples ou arquivos .txt em documentos PDF polidos e profissionais. Ideal para criar relatórios, compartilhar notas ou arquivar conteúdo escrito em um formato universalmente acessível e pronto para impressão.",
    generatePdf: "Gerar PDF",
    uploadTxtPrompt: "Carregue um arquivo de texto simples (.txt)",
    zipExtractor: "Extrator ZIP",
    zipExtractorDescription: "Descompacte rapidamente arquivos .zip com facilidade. Acesse seus arquivos e pastas empacotados instantaneamente sem a necessidade de software adicional. Otimize seu fluxo de trabalho gerenciando arquivos diretamente no estúdio.",
    fileCompressor: "Compressor de Imagens",
    fileCompressorDescription: "Otimize sua pegada digital reduzindo significativamente o tamanho dos arquivos de **imagem** sem comprometer a qualidade. Perfeito para otimização web, uploads mais rápidos e economia de espaço de armazenamento. Mantenha seus visuais nítidos e eficientes.",
    imageResizer: "Redimensionador de Imagens",
    imageResizerDescription: "Ajuste as dimensões de suas imagens com precisão. Redimensione fotos para a web, impressão ou mídias sociais sem perder a clareza. Processe várias imagens em lote ou ajuste ativos individuais para atender a qualquer requisito.",
    docxToPdf: "DOCX → PDF",
    docxToPdfDescription: "Converta seus documentos Microsoft Word (.docx) em arquivos PDF universalmente compatíveis. Garanta formatação consistente e compartilhamento seguro em todas as plataformas. Este recurso utiliza processamento robusto no lado do servidor para perfeita fidelidade de conversão.",
    wordCounter: "Contador de Palavras",
    wordCounterDescription: "Obtenha informações detalhadas sobre sua escrita com contagens precisas de palavras, caracteres, frases e parágrafos. Essencial para trabalhos acadêmicos, criação de conteúdo e para garantir que seu texto atenda às especificações exatas.",
    pasteTextPrompt: "Cole seu texto aqui ou carregue um arquivo .txt...",
    words: "Palavras",
    charactersWithSpaces: "Caracteres (com espaços)",
    charactersNoSpaces: "Caracteres (sem espaços)",
    sentences: "Frases",
    paragraphs: "Parágrafos",
    compressionQuality: "Qualidade de Compressão",
    originalSize: "Tamanho Original",
    compressedSize: "Tamanho Comprimido",
    imageCompression: "Compressão de imagem",
    fileNotSupported: "Este tipo de arquivo não é suportado. Por favor, carregue um arquivo de imagem .jpg ou .png para compressão.",
    pdfToWord: "PDF → Word",
    pdfToWordDescription: "Converta documentos PDF estáticos em arquivos Microsoft Word (.docx) totalmente editáveis. Desbloqueie seu conteúdo para revisões, trabalho colaborativo ou integração perfeita em outros fluxos de trabalho de documentos. Este recurso utiliza processamento seguro no lado do servidor para uma precisão superior.",
    wordToPdf: "Word → PDF",
    wordToPdfDescription: "Transforme sem esforço seus documentos Microsoft Word (.docx) em arquivos PDF universalmente compatíveis. Garanta formatação consistente e compartilhamento seguro em todas as plataformas. Este recurso utiliza processamento robusto no lado do servidor para perfeita fidelidade de conversão.",

    // Media Tools
    videoToAudio: "Vídeo → Áudio",
    videoToAudioDescription: "Extraia trilhas de áudio nítidas de qualquer arquivo de vídeo e salve-as como arquivos WAV de alta qualidade. Ideal para converter palestras, entrevistas ou vídeos musicais em formatos somente de áudio para podcasts, análises ou projetos de design de som. Este recurso requer processamento no lado do servidor e estará disponível em breve.",
    gifMaker: "Criador de GIF",
    gifMakerDescription: "Crie GIFs animados a partir de clipes de vídeo ou sequências de imagens. Crie visuais dinâmicos para mídias sociais, apresentações ou conteúdo da web com temporização e efeitos personalizados. Dê vida aos seus visuais com loops curtos e envolventes.",
    memeGenerator: "Gerador de Memes",
    memeGeneratorDescription: "Gere memes hilários com texto, imagens e modelos personalizáveis. Expresse sua criatividade e compartilhe conteúdo em alta com amigos, seguidores ou sua comunidade. Crie conteúdo viral instantaneamente.",

    // Fun Tools
    voiceChanger: "Trocador de Voz",
    voiceChangerDescription: "Transforme sua voz em tempo real com efeitos de pitch emocionantes. Experimente com sons agudos de esquilo, tons profundos de monstro ou ajustes vocais sutis. Liberte sua criatividade e adicione um toque divertido ao seu áudio.",
    startMic: "Iniciar Microfone",
    stopMic: "Parar Microfone",
    micPermissionDenied: "Permissão do microfone negada. Por favor, permita o acesso nas configurações do navegador.",
    soundboard: "Mesa de Som",
    soundboardDescription: "Organize e reproduza efeitos sonoros personalizados, trechos de música ou dicas vocais instantaneamente. Perfeito para transmissões ao vivo, podcasts ou apresentações interativas para adicionar elementos de áudio dinâmicos em tempo real.",
  },
  zh: {
    // General
    home: "主页",
    settings: "设置",
    login: "登录",
    register: "注册",
    logout: "注销",
    tryIt: "试用",
    comingSoon: "即将推出！",
    underConstruction: "此工具正在建设中。请稍后查看！",
    uploadFile: "上传文件",
    process: "处理",
    download: "下载",
    play: "播放",
    pause: "暂停",
    stop: "停止",
    loading: "加载中...",
    error: "错误",
    clear: "清除",
    preview: "预览", 
    previewing: "正在预览...", 
    terms: "条款",
    privacy: "隐私",

    // Categories
    dashboard: "仪表盘",
    audioSuite: "音频套件",
    fileVault: "文件库",
    mediaLab: "媒体实验室",
    playground: "游乐场",
    archives: "存档",
    system: "系统",
    legal: "法律",

    // Specific Tools
    ttsStudio: "文本转语音工作室",
    ttsStudioDescription: "为任何文本释放超逼真的声音！我们先进的神经网络引擎以令人难以置信的情感深度合成类人语音，非常适合叙事、有声读物或营销。轻松创建引人入胜的音频内容。",
    projects: "项目",
    vault: "库",
    voiceLab: "语音实验室",
    
    // Audio Tools
    mergeAudio: "合并音频",
    mergeAudioDescription: "将多个音频文件无缝合并为单个、连贯的音轨。非常适合无需复杂编辑软件即可拼接画外音、音乐或音效。您的音频项目，统一。",
    uploadedFiles: "已上传文件", 
    mergedAudio: "合并音频", 
    trimAudio: "剪辑音频",
    trimAudioDescription: "精确剪切音频片段开头或结尾的不需要部分。通过直观的控制实现专业级编辑，确保您的音效清晰明了。专注于重要内容。",
    loopAudio: "循环音频",
    loopAudioDescription: "从您的声音片段创建连续、无缝的音频循环。非常适合背景音乐、环境音景或游戏开发和媒体项目中的节奏模式。制作无休止的流动音频。",
    volumeBooster: "音量增强器",
    volumeBoosterDescription: "放大您的音轨以增强清晰度和存在感而不会失真。增强安静的录音，突出人声，或确保您的声音符合任何平台的行业响度标准。",
    addFade: "添加淡入/淡出",
    addFadeDescription: "对您的音频片段应用平滑的淡入和淡出效果。创建专业的过渡，消除突然的开始或结束，并优化您的声音以获得无缝的聆听体验。控制您的音轨动态。",
    voiceRecorder: "录音机",
    voiceRecorderDescription: "直接从麦克风捕获高质量音频。非常适合录制画外音、播客或音乐创意。具有实时监听和轻松保存功能，可立即用于您的项目。",
    convertAudioFormat: "转换音频格式",
    convertAudioFormatDescription: "在各种格式（例如 WAV 到 MP3，OGG 到 FLAC）之间转换音频文件。确保在不同设备和平台上的兼容性，同时保持最佳音质。简单、快速和多功能的转换。",
    startTime: "开始时间 (s)",
    endTime: "结束时间 (s)",
    trimmedAudio: "已剪辑音频",
    uploadAudioPrompt: "上传音频文件（.mp3，.wav）进行剪辑。",
    trimmingAudio: "正在剪辑音频...",
    speed: "速度",
    pitch: "音高",
    processingSpeed: "正在处理速度...",
    speedChangedAudio: "已变速音频",

    // File Tools
    pdfToText: "PDF → 文本",
    pdfToTextDescription: "在几秒钟内轻松地从您的 PDF 文档中提取所有文本内容。将复杂的 PDF 转换为可编辑、可搜索的纯文本，从而简化您的数据恢复和内容再利用工作流程。",
    uploadPdfPrompt: "上传 PDF 文件以提取文本。",
    extractingText: "正在提取文本...",
    extractedText: "提取的文本",
    textToPdf: "文本 → PDF",
    textToPdfDescription: "将纯文本或 .txt 文件转换为精美专业的 PDF 文档。非常适合创建报告、共享笔记或以普遍可访问和可打印的格式存档书面内容。",
    generatePdf: "生成 PDF",
    uploadTxtPrompt: "上传纯文本文件 (.txt)",
    zipExtractor: "ZIP 解压器",
    zipExtractorDescription: "轻松快速地解压压缩的 .zip 档案。无需额外软件即可即时访问捆绑的文件和文件夹。通过直接在工作室中管理档案来简化您的工作流程。",
    fileCompressor: "图像压缩器",
    fileCompressorDescription: "通过显著减小**图像**文件大小而不影响质量来优化您的数字足迹。非常适合网络优化、更快的上传和节省存储空间。保持您的视觉效果清晰高效。",
    imageResizer: "图像调整器",
    imageResizerDescription: "精确调整图像尺寸。缩放照片以适应网络、打印或社交媒体，而不会损失清晰度。批量处理多张图像或微调单个素材以满足任何要求。",
    docxToPdf: "DOCX → PDF",
    docxToPdfDescription: "将您的 Microsoft Word 文档 (.docx) 转换为通用兼容的 PDF 文件。确保在所有平台上的格式一致性和安全共享。此功能利用强大的服务器端处理以实现完美的转换保真度。",
    wordCounter: "字数统计",
    wordCounterDescription: "通过精确的单词、字符、句子和段落计数，深入了解您的写作。对于学术论文、内容创建以及确保您的文本符合确切规范至关重要。",
    pasteTextPrompt: "在此处粘贴您的文本或上传 .txt 文件...",
    words: "单词",
    charactersWithSpaces: "字符（含空格）",
    charactersNoSpaces: "字符（不含空格）",
    sentences: "句子",
    paragraphs: "段落",
    compressionQuality: "压缩质量",
    originalSize: "原始大小",
    compressedSize: "压缩大小",
    imageCompression: "图像压缩",
    fileNotSupported: "不支持此文件类型。请上传 .jpg 或 .png 图像文件进行压缩。",
    pdfToWord: "PDF → Word",
    pdfToWordDescription: "将静态 PDF 文档转换为完全可编辑的 Microsoft Word (.docx) 文件。解锁您的内容以进行修订、协作工作或无缝集成到其他文档工作流程中。此功能利用安全的服务器端处理以实现卓越的准确性。",
    wordToPdf: "Word → PDF",
    wordToPdfDescription: "轻松将您的 Microsoft Word (.docx) 文档转换为通用兼容的 PDF 文件。确保在所有平台上的格式一致性和安全共享。此功能利用强大的服务器端处理以实现完美的转换保真度。",

    // Media Tools
    videoToAudio: "视频 → 音频",
    videoToAudioDescription: "从任何视频文件中提取原始音轨并将其保存为高质量 WAV 文件。非常适合将讲座、访谈或音乐视频转换为纯音频格式，用于播客、分析或声音设计项目。此功能需要服务器端处理，即将推出。",
    gifMaker: "GIF 制作器",
    gifMakerDescription: "从视频片段或图像序列创建动画 GIF。设计用于社交媒体、演示文稿或网络内容的动态视觉效果，并具有自定义时间和效果。通过引人入胜的短循环让您的视觉效果栩栩如生。",
    memeGenerator: "表情包生成器",
    memeGeneratorDescription: "使用可自定义的文本、图像和模板生成搞笑的表情包。表达您的创造力，与朋友、关注者或社区分享热门内容。即时创建病毒式内容。",

    // Fun Tools
    voiceChanger: "变声器",
    voiceChangerDescription: "通过激动人心的音高效果实时改变您的声音。尝试高音花栗鼠声音、深沉怪物音调或微妙的人声调整。释放您的创造力，为您的音频增添乐趣。",
    startMic: "启动麦克风",
    stopMic: "停止麦克风",
    micPermissionDenied: "麦克风权限被拒绝。请在浏览器设置中允许访问。",
    soundboard: "音效板",
    soundboardDescription: "即时策划和播放自定义音效、音乐片段或人声提示。非常适合直播、播客或互动演示，以便即时添加动态音频元素。",
  }
};

const defaultSet = (p: number = 1, s: number = 1, e: string = 'Natural'): TTSSettings => ({
  pitch: p,
  speed: s,
  expression: e,
  enhancement: 'studio'
});

export const VOICES: VoiceDefinition[] = [
  // Moved Chloe (v-9) to the top to be the default voice
  { id: 'v-9', name: 'Chloe', baseVoice: VoiceName.KORE, gender: 'female', age: 'child', role: 'Student', description: 'Inquisitive', tags: ['Young', 'Smart'], previewText: 'Why do stars only come out at night time?', defaultSettings: defaultSet(1.35, 1.0, 'Natural') },

  // ELDER VOICES
  { id: 'v-1', name: 'Arthur', baseVoice: VoiceName.CHARON, gender: 'male', age: 'elder', role: 'Grandfather', description: 'Wise & Gritty', tags: ['Elderly', 'History'], previewText: 'In the winter of my life, the stories are all that remain.', defaultSettings: defaultSet(0.75, 0.85, 'Somber') },
  { id: 'v-2', name: 'Martha', baseVoice: VoiceName.FENRIR, gender: 'female', age: 'elder', role: 'Grandmother', description: 'Soft & Kind', tags: ['Warm', 'Gentle'], previewText: 'Sit down, dear. I have a tale that will warm my heart.', defaultSettings: defaultSet(0.85, 0.8, 'Natural') },
  { id: 'v-3', name: 'Silas', baseVoice: VoiceName.ZEPHYR, gender: 'male', age: 'elder', role: 'Professor', description: 'Academic & Deep', tags: ['Educational', 'Formal'], previewText: 'Consider the implications of this discovery in the 18th century.', defaultSettings: defaultSet(0.7, 0.9, 'Professional') },
  { id: 'v-4', name: 'Eleanor', baseVoice: VoiceName.KORE, gender: 'female', age: 'elder', role: 'Matriarch', description: 'Sophisticated', tags: ['Classy', 'Old'], previewText: 'Proper etiquette is the foundation of a civil society.', defaultSettings: defaultSet(0.8, 0.85, 'Authoritative') },
  { id: 'v-5', name: 'Winston', baseVoice: VoiceName.CHARON, gender: 'male', age: 'elder', role: 'Butler', description: 'Polished & Low', tags: ['Service', 'Elite'], previewText: 'Your tea is served in the library, sir.', defaultSettings: defaultSet(0.65, 0.95, 'Professional') },

  // CHILDREN / YOUNG
  { id: 'v-6', name: 'Leo', baseVoice: VoiceName.PUCK, gender: 'male', age: 'child', role: 'Kid Narrator', description: 'Energetic', tags: ['High Pitch', 'Happy'], previewText: 'Look at the giant ice cream truck! Can we go, please?', defaultSettings: defaultSet(1.4, 1.1, 'Excited') },
  { id: 'v-7', name: 'Lily', baseVoice: VoiceName.KORE, gender: 'female', age: 'child', role: 'Young Girl', description: 'Playful', tags: ['Soft', 'Sweet'], previewText: 'I found a magic butterfly in the garden today!', defaultSettings: defaultSet(1.3, 1.05, 'Cheerful') },
  { id: 'v-8', name: 'Toby', baseVoice: VoiceName.PUCK, gender: 'male', age: 'child', role: 'Gaming Host', description: 'Fast & Fun', tags: ['Hyper', 'Gaming'], previewText: 'Hey guys! Welcome back to my Minecraft stream!', defaultSettings: defaultSet(1.25, 1.2, 'Excited') },

  // ADULT - VARIOUS ROLES
  { id: 'v-10', name: 'Ziggy', baseVoice: VoiceName.PUCK, gender: 'male', age: 'young', role: 'Cyberpunk', description: 'Edgy & Fast', tags: ['Tech', 'Street'], previewText: 'Jack into the mainframe before the corps track our signal.', defaultSettings: defaultSet(1.15, 1.3, 'Excited') },
  { id: 'v-11', name: 'Seraphina', baseVoice: VoiceName.KORE, gender: 'female', age: 'adult', role: 'Goddess', description: 'Ethereal & Echoing', tags: ['Fantasy', 'Tall'], previewText: 'Mortal, you stand before the gates of the eternal sun.', defaultSettings: defaultSet(1.1, 0.7, 'Authoritative') },
  { id: 'v-12', name: 'Jax', baseVoice: VoiceName.CHARON, gender: 'male', age: 'adult', role: 'Mercenary', description: 'Rough & Tough', tags: ['Action', 'Deep'], previewText: 'I don’t care who sent you. Just stay out of my way.', defaultSettings: defaultSet(0.7, 1.1, 'Authoritative') },
  { id: 'v-13', name: 'Luna', baseVoice: VoiceName.FENRIR, gender: 'female', age: 'young', role: 'Dreamer', description: 'Whispery', tags: ['Night', 'Soft'], previewText: 'The moon knows all the secrets we keep from the sun.', defaultSettings: defaultSet(1.05, 0.8, 'Whispering') },
  { id: 'v-14', name: 'Colt', baseVoice: VoiceName.CHARON, gender: 'male', age: 'adult', role: 'Cowboy', description: 'Southern Drawl', tags: ['Accent', 'Country'], previewText: 'Welcome to the ranch, partner. Mind the rattlesnakes.', defaultSettings: defaultSet(0.85, 0.9, 'Natural') },
  { id: 'v-15', name: 'Hans', baseVoice: VoiceName.ZEPHYR, gender: 'male', age: 'adult', role: 'Engineer', description: 'Precise European', tags: ['Formal', 'Tech'], previewText: 'The mechanical efficiency must exceed ninety percent.', defaultSettings: defaultSet(1.0, 1.05, 'Professional') },
  { id: 'v-16', name: 'Mateo', baseVoice: VoiceName.PUCK, gender: 'male', age: 'young', role: 'Travel Guide', description: 'Warm & Upbeat', tags: ['Friendly', 'Latino'], previewText: 'The sun is perfect today for a walk on the golden beach!', defaultSettings: defaultSet(1.1, 1.15, 'Cheerful') },
  { id: 'v-17', name: 'Sasha', baseVoice: VoiceName.KORE, gender: 'female', age: 'adult', role: 'News Anchor', description: 'Direct & Clear', tags: ['Journalism', 'TV'], previewText: 'Coming up next: the latest updates on the global energy summit.', defaultSettings: defaultSet(1.0, 1.1, 'Professional') },
  { id: 'v-18', name: 'Viktor', baseVoice: VoiceName.FENRIR, gender: 'male', age: 'adult', role: 'Villain', description: 'Menacing', tags: ['Evil', 'Deep'], previewText: 'You are far too late to stop what has already begun.', defaultSettings: defaultSet(0.6, 0.8, 'Somber') },
  { id: 'v-19', name: 'Aria', baseVoice: VoiceName.ZEPHYR, gender: 'female', age: 'young', role: 'AI Assistant', description: 'Smooth & Helpful', tags: ['Digital', 'Modern'], previewText: 'I am here to assist you with your daily schedule.', defaultSettings: defaultSet(1.1, 1.0, 'Natural') },
  { id: 'v-20', name: 'Commander Riker', baseVoice: VoiceName.CHARON, gender: 'male', age: 'adult', role: 'Officer', description: 'Bold & Direct', tags: ['Military', 'Space'], previewText: 'All stations to battle readiness. This is not a drill.', defaultSettings: defaultSet(0.8, 1.0, 'Authoritative') },
  
  // Generating remaining 30 voices to reach 50+
  ...Array.from({length: 31}).map((_, i) => {
    // Adjust index because 'v-9' was moved to the top.
    // Original index was i + 21, now adjusted to prevent ID collision and ensure proper mapping.
    // We'll skip v-9 if it's generated again, or ensure unique IDs.
    const originalIdOffset = 21; // This is the start of the auto-generated block originally.
    let currentId = i + originalIdOffset;
    if (currentId >= 9) { // If the original ID was v-9 or higher, increment to avoid collision with new v-9
      currentId++; // Skip the ID 'v-9' as it's now at the beginning.
    }
    const id = `v-${currentId}`;

    const baseKeys = Object.values(VoiceName);
    const base = baseKeys[i % baseKeys.length]; // Use 'i' to cycle through base voices

    const gender = i % 2 === 0 ? 'male' : 'female';
    const age = i % 4 === 0 ? 'child' : i % 4 === 1 ? 'young' : i % 4 === 2 ? 'adult' : 'elder';
    const expressions = ['Natural', 'Cheerful', 'Professional', 'Authoritative', 'Excited'];
    
    return {
      id: id,
      name: ['Oliver', 'Sophia', 'Ethan', 'Isabella', 'Liam', 'Mia', 'Noah', 'Amelia', 'James', 'Ava', 'Lucas', 'Charlotte', 'Mason', 'Harper', 'Logan', 'Evelyn', 'Alexander', 'Abigail', 'Elijah', 'Emily', 'Daniel', 'Elizabeth', 'Jacob', 'Sofia', 'Michael', 'Avery', 'William', 'Ella', 'Benjamin', 'Scarlett', 'Henry'][i] || `Neural Voice ${currentId}`,
      baseVoice: base,
      gender: gender as any,
      age: age as any,
      role: ['Narrator', 'Instructor', 'Actor', 'Voiceover', 'Friend'][i % 5],
      description: `Neural Profile ${currentId}`,
      tags: ['Diverse', 'High Quality'],
      previewText: 'Testing vocal parameters for high fidelity neural synthesis.',
      defaultSettings: defaultSet(0.7 + (i * 0.015) % 0.8, 0.8 + (i * 0.01) % 0.7, expressions[i % expressions.length])
    };
  })
];

export const PLAN_CONFIGS: Record<Plan, any> = {
  'free': { limit: 500, duration: 'day', price: '$0' },
  'starter': { limit: 50000, duration: 'month', price: '$5' },
  'vip': { limit: 200000, duration: 'month', price: '$12.99' },
  'vvip': { limit: 1500000, duration: 'year', price: '$50' },
  'exclusive': { limit: 5000000, duration: 'year', price: '$99.99' }
};

export const PLAN_LIMITS: Record<Plan, number> = {
  'free': 700, // Updated to 700 to match backend
  'starter': 50000,
  'vip': 200000,
  'vvip': 1500000,
  'exclusive': 5000000
};

export const EXPRESSIONS = ['Natural', 'Professional', 'Cheerful', 'Somber', 'Whispering', 'Authoritative', 'Excited'];
