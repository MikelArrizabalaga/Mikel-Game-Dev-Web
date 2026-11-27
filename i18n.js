(() => {
  // Each entry contains the Euskara and English translations. Spanish is in the HTML.
  const translations = {
    "common.skip": ["Joan edukira", "Skip to content"],
    "common.nav": ["Nabigazio nagusia", "Main navigation"],
    "common.projects": ["Proiektuak", "Projects"],
    "common.services": ["Zerbitzuak", "Services"],
    "common.process": ["Nire lan-modua", "How I work"],
    "common.contact": ["Kontaktua", "Contact"],
    "common.email": ["Posta elektronikoa", "Email"],
    "common.theme": ["Kolore-gaia", "Colour theme"],
    "common.system": ["Sistema", "System"],
    "common.light": ["Argia", "Light"],
    "common.dark": ["Iluna", "Dark"],
    "common.legal": ["Lege-oharra", "Legal notice"],
    "common.privacy": ["Pribatutasuna", "Privacy"],
    "common.pause": ["Pausatu animazioa", "Pause animation"],
    "common.top": ["Itzuli gora", "Back to top"],
    "common.games": ["Bideojokoak", "Video games"],
    "common.vr": ["Errealitate birtuala", "Virtual reality"],
    "common.apps": ["Jokoak eta aplikazioak", "Games and apps"],
    "common.techArt": ["Arte teknikoa", "Technical art"],
    "common.socialImage": ["Mikel Arrizabalaga. Bideojokoak eta arte teknikoa freelance. Zero eta bat laranjaz dituen irudi grafikoa.", "Mikel Arrizabalaga. Freelance game development and technical art. Graphic identity featuring an orange zero and one."],

    "home.title": ["Unity garatzailea eta artista tekniko \"freelance\"-a | Mikel Arrizabalaga", "Freelance Unity Developer and Technical Artist | Mikel Arrizabalaga"],
    "home.description": ["Mikel Arrizabalaga, bideojoko-estudioentzako garatzaile \"freelance\"-a. Joko-mekaniken programazioa Unity eta C# erabiliz, shader-ak, VFX eta produkzio-tresnak.", "Mikel Arrizabalaga, freelance developer for game studios. Gameplay programming in Unity and C#, shaders, VFX and production tools."],
    "home.socialTitle": ["Mikel Arrizabalaga · Bideojokoak eta arte teknikoa \"freelance\"", "Mikel Arrizabalaga · Freelance Game Development and Technical Art"],
    "home.socialDescription": ["Joko-mekaniken programazioa Unity eta C# erabiliz, shader-ak, VFX eta produkzio-tresnak bideojoko-estudioentzat.", "Gameplay programming in Unity and C#, shaders, VFX and production tools for game studios."],
    "home.jobTitle": ["Bideojoko-garatzailea eta artista tekniko \"freelance\"-a", "Freelance Game Developer and Technical Artist"],
    "home.eyebrow": ["Bideojokoak eta arte teknikoa \"freelance\"", "Freelance game development and technical art"],
    "home.intro": ["Bideojoko-estudioentzako mekanikak, shader-ak eta tresnak programatzen ditut. Prototipo jokagarriak sortzen lagundu edo zure produkzioan parte har dezaket.", "I program gameplay mechanics, shaders and tools for game studios. I can help you build a playable prototype or join your production team."],
    "home.viewProjects": ["Ikusi proiektuak", "View projects"],
    "home.propose": ["Proposatu eskaintza bat", "Ask a project"],
    "home.heroGames": ["Bideojokoak programatzen", "In game programming"],
    "home.heroEffects": ["Shader-etan eta VFXetan", "In shaders and VFX"],
    "home.heroCollaboration": ["Gertuko harremanean", "In working closely together"],
    "home.catalogue": ["Ikusi proiektu guztiak", "View all projects"],
    "home.featuredNextStop": ["Interakzioak eta elkarrizketa-interfaza misteriozko abentura batean.", "Interactions and dialogue UI for a mystery adventure."],
    "home.featuredPrevir": ["Programazioa eta arte teknikoa ebakuntzak planifikatzeko simulagailu baterako.", "Programming and technical art for a surgical planning simulator."],
    "home.featuredLiz": ["Programazioa eta arte teknikoa mugikorretarako arcade joko baterako.", "Programming and technical art for a mobile arcade game."],

    "services.intro": ["Zertan lagun diezazukedan eta zer espero dezakezun zerbitzu bakoitzetik.", "How I can help and what you can expect from each service."],
    "services.available": ["Zerbitzu erabilgarriak", "Available services"],
    "services.games": ["Bideojokoak eta programazioa", "Game development and programming"],
    "services.techArt": ["Arte teknikoa", "Technical Art"],
    "services.shaders": ["Shader-ak", "Shaders"],
    "services.tools": ["Softwarea eta tresnak", "Software and tools"],
    "services.example": ["Enkarguaren adibidea", "Example brief"],
    "services.deliverable": ["Entregaga", "Delivery"],
    "services.prepare": ["Prestatu enkargu hau", "Discuss this project"],
    "services.gamesDescription": ["Bideojokoak, prototipo jokagarriak, joko-mekanikak eta abian dauden proiektuetarako sistemak garatzen ditut. Unity eta C# erabiltzen ditut.", "I develop games, playable prototypes, gameplay mechanics and systems for projects already in production. I work with Unity and C#."],
    "services.gamesExample": ["Pertsonaia baten mugimendua, jauzia eta talkak programatzea.", "Program a character’s movement, jumping and collisions."],
    "services.gamesDelivery": ["Mekanika jokagarri bat eta zure proiektuan integratzeko prest dagoen kodea.", "A playable mechanic and code ready to integrate into your project."],
    "services.artDescription": ["Artearen eta programazioaren arteko zubia egiten dut. Baliabideak Unityn integratzen ditut eta lan-fluxuak prestatzen ditut taldeak bere kabuz iteratu ahal izan dezan.", "I connect art and programming. I integrate assets into Unity and set up workflows so the team can iterate independently."],
    "services.artExample": ["Joko-motorrean baliabide artistikoak inportatu eta konfiguratzeko lan-fluxu bat prestatzea.", "Set up a workflow for importing and configuring art assets in the game engine."],
    "services.artDelivery": ["Baliabide integratuak eta taldeak prozesua errepikatzeko gida bat.", "Integrated assets and a guide so the team can repeat the process."],
    "services.shadersDescription": ["Zure taldeak doitu ditzakeen parametroak dituzten shader-ak eta materialak programatzen ditut. Unityn Shader Graph eta HLSL erabiltzen ditut URPrako.", "I program shaders and materials with parameters your team can adjust. In Unity, I use Shader Graph and HLSL for URP."],
    "services.shadersExample": ["Kolorea, mugimendua eta gardentasuna doitzeko kontrolak dituen ur-material bat sortzea.", "Create a water material with controls for colour, movement and transparency."],
    "services.shadersDelivery": ["Shader integratua, adibideko material bat eta parametroen azalpena.", "The integrated shader, a sample material and an explanation of its parameters."],
    "services.vfxDescription": ["Denbora errealeko efektu bisualak sortu eta integratzen ditut trebetasunetarako, inpaktuetarako eta inguruneko elementuetarako.", "I create and integrate real-time visual effects for abilities, impacts and environmental elements."],
    "services.vfxExample": ["Jokalariari kolpeak jo duela adierazteko inpaktu-efektu bat sortzea.", "Create an impact effect that shows the player when a hit lands."],
    "services.vfxDelivery": ["Efektua, jokoan berrerabiltzeko eta motorretik doitzeko prest.", "An effect ready to reuse in the game and adjust in the engine."],
    "services.toolsDescription": ["Neurrira egindako aplikazioak eta barne-tresnak sortzen ditut zure taldeak produkzioan errepikatzen dituen zereginak errazteko.", "I build custom applications and internal tools to simplify tasks your team repeats during production."],
    "services.toolsExample": ["Baliabideak inportatu aurretik egiaztatzeko editore-tresna bat sortzea.", "Create an editor tool that checks assets before import."],
    "services.toolsDelivery": ["Tresna integratu bat eta hura instalatu eta erabiltzeko gida labur bat.", "An integrated tool and a short installation and usage guide."],

    "process.intro": ["Lehen bertsio bat izango duzu probatzeko, entrega amaitu aurretik.", "You’ll have a first version to try before the final handover."],
    "process.scope": ["Helburua zehazten dugu", "We agree on the scope"],
    "process.scopeDetail": ["Enkarguak zer konpondu behar duen, zer jasoko duzun eta zure proiektuan nola integratuko dugun adosten dugu.", "We agree on what the work needs to solve, what you’ll receive and how we’ll integrate it into your project."],
    "process.try": ["Aurrerapenak probatzen ditugu", "We test an early version"],
    "process.tryDetail": ["Lehen bertsioa bidaltzen dizut. Elkarrekin probatzen dugu eta zure iradokizunak erabiltzen ditut doikuntzak egiteko.", "I send you a first version. We try it together and I use your feedback to make adjustments."],
    "process.handover": ["Entrega prestatzen dut", "I prepare the handover"],
    "process.handoverDetail": ["Adostutako kodea edo baliabideak entregatzen ditut, zure taldeak integratu ahal izateko jarraibideekin batera.", "I deliver the agreed code or assets with instructions so your team can integrate them."],

    "contact.intro": ["Kontatu posta elektronikoz zer sortu edo hobetu nahi duzun, zein plataformatarako eta zein epetan.", "Email me what you’d like to build or improve, the target platform and your timeline."],
    "contact.data": ["Nola tratatzen ditudan zure kontaktu-datuak", "How I handle your contact information"],
    "contact.write": ["Idatzi mezu bat", "Email me"],
    "contact.subject": ["Enkargu bati buruzko kontsulta", "Project enquiry"],

    "work.title": ["Bideojokoen, VRaren eta arte teknikoaren portfolioa | Mikel Arrizabalaga", "Game, VR and Technical Art Portfolio | Mikel Arrizabalaga"],
    "work.description": ["Mikel Arrizabalagaren portfolioa. Ezagutu The Next Stop eta PREVIR-CTX proiektuetan egindako lana eta Unityko zein Unreal Engine 5eko shader eta VFX laginak.", "Mikel Arrizabalaga’s portfolio. Explore his work on The Next Stop and PREVIR-CTX and his shader and VFX samples in Unity and Unreal Engine 5."],
    "work.socialTitle": ["Bideojokoen, VRaren eta arte teknikoaren portfolioa · Mikel Arrizabalaga", "Game, VR and Technical Art Portfolio · Mikel Arrizabalaga"],
    "work.socialDescription": ["The Next Stop eta PREVIR-CTX proiektuetan egindako lana eta Unityko zein Unreal Engine 5eko shader eta VFX laginak.", "My work on The Next Stop and PREVIR-CTX, plus shader and VFX samples in Unity and Unreal Engine 5."],
    "work.intro": ["Bideojokoetan, errealitate birtualean eta aplikazioetan egindako lana, Unityko eta Unreal Engine 5eko shader eta VFX laginekin.", "My contributions to games, virtual reality and apps, with shader and VFX samples in Unity and Unreal Engine 5."],
    "work.categories": ["Proiektu motak", "Project categories"],
    "work.nextStopContext": ["Paranoid Delusionekin elkarlanean", "Collaboration with Paranoid Delusion"],
    "work.nextStopDescription": ["Jokoaren programazioan eta arte teknikoan ari naiz lanean, interakzioak eta elkarrizketa-interfazea doitzen. Misteriozko abentura bat da, denbora-begizta batean harrapatutako metro batean girotua.", "I work on the game’s programming and technical art, refining its interactions and dialogue UI. It’s a mystery adventure set on a subway caught in a time loop."],
    "work.nextStopLink": ["Ikusi The Next Stop Steamen", "View The Next Stop on Steam"],
    "work.nextStopAlt": ["The Next Stop-en azala, bidaiari bat nasan eserita trenaren alboan", "The Next Stop cover, with a passenger sitting on a platform beside the train"],
    "work.bossContext": ["Garapen bidean dagoen proiektu pertsonala", "Personal project in development"],
    "work.bossDescription": ["2.5D-ko plataforma-joko hau garatzen ari naiz hasieratik. Mekanikak programatzen eta artea eta kodea Unityn uztartzen aritzen naiz batez ere. Jokoko 3D baliabideetako batzuk ere modelatu ditut.", "I’ve worked on this 2.5D platformer from the start. I focus on programming mechanics and bringing art and code together in Unity. I’ve also modelled some of the game’s 3D assets."],
    "work.bossTech": ["Unity · C# · 3D modelaketa", "Unity · C# · 3D modelling"],
    "work.bossRelease": ["2027an argitaratzea aurreikusten da.", "Release planned for 2027."],
    "work.bossAlt": ["Don’t Anger the Boss-en logotipoa laranjaz eta horiz hondo argi baten gainean", "Orange and yellow Don’t Anger the Boss logo on a light background"],
    "work.bioContext": ["BIO-CRUCESerako proiektuak", "Projects for BIO-CRUCES"],
    "work.programming": ["Programazioa", "Programming"],
    "work.programmingArt": ["Programazioa eta arte teknikoa", "Programming and technical art"],
    "work.resDescription": ["Errealitate birtualeko bizkortze-gela baten programazioan aritu nintzen. Medikuek eta erizainek beren erantzuna trebatu dezakete kasu errealetan oinarritutako simulazioetan.", "I helped program a virtual reality resuscitation room. Doctors and nurses can practise their response in simulations based on real cases."],
    "work.resAlt": ["RES-VRko bizkortze-gela, paziente simulatu batekin eta rola aukeratzeko kontrolarekin", "RES-VR resuscitation room with a simulated patient and a role selector"],
    "work.previrDescription": ["Tumoreak edo bestelako gaitzak dituzten organoen 3D ereduak inportatzeko aukera ematen duen ingurune birtual bat garatzen lagundu nuen. Ebakuntza-taldeak anatomia azter dezake eta ebakuntza aurretik hainbat modu entseatu. Geroago, Virtualwarek proiektua erosi zuen.", "I helped develop a virtual environment that imports 3D models of organs with conditions such as tumours. The surgical team can explore the anatomy and rehearse different approaches before operating. Virtualware later acquired the project."],
    "work.previrAlt": ["PREVIR-CTXren 3D eredu anatomikoa eta kontrol-panela", "PREVIR-CTX 3D anatomical model and control panel"],
    "work.eliDescription": ["8 eta 16 urte bitarteko gazteentzako hezkuntza-bideojoko batean aritu nintzen. Erronka osagaiak aukeratu eta prestatzea da, ahalik eta osasun-puntuazio handiena lortzeko.", "I worked on an educational game for ages 8 to 16. Players choose and cook ingredients to get the highest possible health score."],
    "work.eliAlt": ["Eli-K-On-en azala, sukaldaritza-lehiaketako pertsonaiekin", "Eli-K-On cover featuring the cooking competition characters"],
    "work.tutorialDescription": ["Errealitate birtualeko kontrolak erabiltzen ikasteko esperientzia batean lagundu nuen. Ordenagailuaren aurkako hiru lerroan jokoa, saskibaloia eta beste minijoko batzuk ditu ingurunea ezagutzeko.", "I contributed to an introductory experience for virtual reality controls. It includes tic-tac-toe against the computer, basketball and other minigames to help players get used to the environment."],
    "work.tutorialAlt": ["BIO-Tutorialeko robot gidaria errealitate birtualeko ingurune batean", "BIO-Tutorial guide robot in a virtual reality environment"],
    "work.baleukoContext": ["Baleuko S. L.rako proiektuak", "Projects for Baleuko S. L."],
    "work.lizDescription": ["Mugikorretarako arcade joko batean lagundu nuen. Jokoan Liz gidatzen duzu oztopoen artean. Jokalariek senideekin lehiatu eta sailkapenean puntuazioak alderatu ditzakete.", "I contributed to a mobile arcade game where you guide Liz past obstacles. Players can compete with family members and compare scores on the leaderboard."],
    "work.lizLink": ["Ikusi Vuela, Liz Google Playn", "View Vuela, Liz on Google Play"],
    "work.lizAlt": ["Liz hegazkinlari-txapelarekin", "Liz wearing an aviator hat"],
    "work.hurTech": ["Kalitate-kontrola (QA) eta programazioa", "Quality assurance (QA) and programming"],
    "work.hurDescription": ["Hur telesailean oinarritutako minijokoak, asmakizunak eta erronkak dituen hezkuntza-aplikazio batean probak egin eta akatsak zuzendu nituen.", "I tested and fixed bugs in an educational app with minigames, puzzles and challenges based on the Hur series."],
    "work.hurLink": ["Ikusi Hur: Aprende Google Playn", "View Hur: Aprende on Google Play"],
    "work.hurAlt": ["Hurren erretratua", "Portrait of Hur"],
    "work.wordSearchTech": ["Aplikazioaren garapena", "App development"],
    "work.wordSearchDescription": ["Aplikazio osoa garatu nuen. Jokoan lauki-sare batean ezkutatutako hitzak bilatu behar dira.", "I built the entire app, a word search game where players find hidden words in a grid."],
    "work.gameDevelopment": ["Bideojokoen garapena", "Game development"],
    "work.pintxoDescription": ["Goitik ikusten den biziraupeneko roguelike joko batean aritu nintzen. Pintxok kutsadura irudikatzen duten etsaien aurka borrokatzen du, eta bere estatistikak hobetzen ditu mailaz igo eta zailtasuna handitu ahala.", "I worked on a top-down survival roguelike. Pintxo fights enemies that represent pollution and improves his stats as he levels up and the difficulty increases."],
    "work.runnerTitle": ["Lasterketa-joko didaktikoa", "Educational runner"],
    "work.runnerDescription": ["Txanponak biltzea eta matematikari, birziklapenari eta hiztegiari buruzko galderak uztartzen dituen lasterketa-joko batean aritu nintzen. Erantzuteko, jokalariak ezkerreko edo eskuineko erreia hautatzen du, zuzentzat jotzen duen aukeraren arabera.", "I worked on a running game that combines collecting coins with questions about maths, recycling and vocabulary. Players answer by choosing the left or right lane based on which option they think is correct."],
    "work.artStation": ["Ikusi ArtStationen", "View on ArtStation"],
    "work.clayDescription": ["Denbora errealeko shader bat sortu nuen marrazki bizidunen estiloko jokoetan buztinaren itxura simulatzeko.", "I created a real-time shader to simulate a clay finish in cartoon-style games."],
    "work.clayAlt": ["Esfera berde bat, kubo gorri bat eta zilindro turkesa bat, buztin-itxurarekin", "A green sphere, a red cube and a turquoise cylinder with a clay finish"],
    "work.clayLink": ["Ikusi Clay Shader ArtStationen", "View Clay Shader on ArtStation"],
    "work.ditheringDescription": ["Pertsonaia Blender-en modelatu eta Unityra eraman nuen, pantaila osoko dithering-efektu bat probatzeko.", "I modelled the character in Blender and brought it into Unity to test a full-screen dithering effect."],
    "work.ditheringAlt": ["Jemsa tonu turkesa eta arrosetan, dithering-bilbe baten gainean", "Jemsa in turquoise and pink over a dithering pattern"],
    "work.ditheringLink": ["Ikusi Jemsaren dithering-proba ArtStationen", "View Jemsa’s dithering test on ArtStation"],
    "work.jemsaVfxDescription": ["Unityn sortutako zeinudun distantzia-eremu bat (SDF) erabili nuen efektuaren oinarri gisa, eta neurrira egindako arrastoak gehitu nituen.", "I used a signed distance field (SDF) generated in Unity as the basis for the effect and added custom trails."],
    "work.jemsaVfxAlt": ["Jemsaren silueta, koloretako argi-arrastoz marraztua hondo ilun baten gainean", "Jemsa’s silhouette drawn with colourful light trails on a dark background"],
    "work.jemsaVfxLink": ["Ikusi Jemsa – Unity Visual Effect ArtStationen", "View Jemsa – Unity Visual Effect on ArtStation"],
    "work.dancingDescription": ["VFX Graph erabili nuen Unityn pertsonaiaren sare animatuaren inguruan partikulak igortzeko.", "I used VFX Graph to emit particles around the character’s animated mesh in Unity."],
    "work.dancingAlt": ["Jemsaren silueta, partikula arrosez eta laranjaz osatua hondo beltz baten gainean", "Jemsa’s silhouette made of pink and orange particles on a black background"],
    "work.dancingLink": ["Ikusi Jemsa Dancing ArtStationen", "View Jemsa Dancing on ArtStation"],
    "work.beamDescription": ["Inpaktu-partikulak dituen laser-izpi bat sortu nuen VFX Graph-ekin, eta distira animatua eta distortsioa gehitu nizkion Shader Graph-ekin.", "I created a laser beam with impact particles in VFX Graph and added animated glow and distortion with Shader Graph."],
    "work.beamAlt": ["Laser-izpiaren hiru faseko muntaketa, inpaktuaren distira barne", "Composite showing three stages of the laser beam, including the impact flash"],
    "work.beamLink": ["Ikusi Beam VFX ArtStationen", "View Beam VFX on ArtStation"],
    "work.shaderContext": ["Shader-en proiektu propioa", "Personal shader project"],
    "work.shaderDescription": ["Unityko hainbat materialetan formak berrerabiltzeko, azpigrafoen pakete bat prestatu eta izar bat eta poligono prozedural bat programatu nituen, biraketa eta ertzak leuntzea doitzeko kontrolekin.", "To reuse shapes across Unity materials, I put together a subgraph package and programmed a star and a procedural polygon with rotation and edge smoothing controls."],
    "work.shaderLink": ["Ikusi paketea GitHuben", "View the package on GitHub"],
    "work.polygonTitle": ["Probatu poligonoa", "Try the polygon"],
    "work.polygonLabel": ["WebGLn marraztutako poligono prozedurala", "Procedural polygon rendered in WebGL"],
    "work.polygonFallback": ["Poligono prozeduralaren aurrebista.", "Procedural polygon preview."],
    "work.polygonSides": ["Aldeak", "Sides"],
    "work.polygonRotation": ["Biraketa", "Rotation"],
    "work.degree": ["gradu", "degree"],
    "work.degrees": ["gradu", "degrees"],
    "work.polygonNote": ["Formaren WebGL bertsioa nabigatzailerako.", "Browser version of the shape rendered in WebGL."],

    "legal.title": ["Lege-oharra · Mikel Arrizabalaga", "Legal Notice · Mikel Arrizabalaga"],
    "legal.description": ["Mikel Arrizabalagaren portfolioaren titularraren identifikazioa, kontsultarako baldintzak eta edukien gaineko eskubideak.", "Site owner details, terms of use and rights relating to content in Mikel Arrizabalaga’s portfolio."],
    "legal.ownerInfo": ["Titularraren identifikazioa", "Site owner details"],
    "legal.owner": ["Titularra", "Site owner"],
    "legal.address": ["Establezimenduaren helbidea", "Business address"],
    "legal.addressValue": ["Harrobi plaza, 4 (sarrera Kontzezio kaletik), 48003 Bilbo (Bizkaia), Espainia", "Harrobi Plaza, 4 (entrance on Kontzezio Kalea), 48003 Bilbao (Bizkaia), Spain"],
    "legal.contactEmail": ["Harremanetarako helbide elektronikoa", "Contact email"],
    "legal.services": ["Zerbitzuak eta enkarguak", "Services and commissioned work"],
    "legal.servicesDetail": ["Webgune honetan bideojokoen programazio, arte tekniko, shader, VFX eta tresnen garapeneko zerbitzuak aurkezten ditut. Nire proiektuak eta elkarlanak ere erakusten ditut.", "This website presents my services in game programming, technical art, shaders, VFX and tool development. It also showcases my own projects and collaborations."],
    "legal.rights": ["Jabetza intelektuala eta portfolioko materialak", "Intellectual property and portfolio materials"],
    "legal.thirdParty": ["Azalen, pantaila-argazkien, logotipoen, marken eta hirugarrenen gainerako materialen eskubideak dagozkien titularrenak dira. Fitxek proiektu bakoitzean izan dudan parte-hartzea azaltzen dute.", "Rights to covers, screenshots, logos, trademarks and other third-party materials belong to their respective owners. The project entries describe my contribution to each project."],
    "legal.external": ["Kanpoko estekak eta pribatutasuna", "External links and privacy"],
    "legal.subject": ["Lege-oharrari buruzko kontsulta", "Legal notice enquiry"],

    "privacy.title": ["Pribatutasun-politika · Mikel Arrizabalaga", "Privacy Policy · Mikel Arrizabalaga"],
    "privacy.description": ["Mikel Arrizabalagak posta elektronikoz jasotako kontsulta profesionalak nola kudeatzen dituen, zenbat denboraz gordetzen dituen eta pribatutasun-eskubideak nola baliatu.", "How Mikel Arrizabalaga handles professional email enquiries, how long they are kept and how to exercise your privacy rights."],
    "privacy.heading": ["Pribatutasun-politika", "Privacy policy"],
    "privacy.enquiries": ["Kontsultak eta enkarguak", "Enquiries and commissioned work"],
    "privacy.use": ["Zure helbide elektronikoa eta mezuan ematen duzun informazioa erabiltzen ditut zuri erantzuteko, enkargua baloratzeko eta, eskatzen baduzu, aurrekontua prestatzeko. Datu horiek ematea borondatezkoa da, baina erantzun ahal izateko helbide elektroniko bat eta kontsultari buruzko nahikoa informazio behar ditut.", "I use your email address and the information in your message to reply, assess the work and prepare a quote if you ask for one. Providing these details is voluntary, but I need an email address and enough information about your enquiry to reply."],
    "privacy.basis": ["Aurrekontua eskatzen duzunean edo zeure izenean kontratatu behar duzunean, oinarri juridikoa zuk eskatutako kontratu aurreko neurriak aplikatzea da. Kontsulta orokorretan edo enpresa edo estudio baten izenean idazten baduzu, oinarria kontsultari erantzuteko eta harreman profesionala kudeatzeko dudan interes legitimoa da.", "When you request a quote or plan to engage me in a personal capacity, the legal basis is taking pre-contractual steps at your request. For general enquiries or if you write on behalf of a company or studio, the basis is my legitimate interest in responding to the enquiry and managing the professional relationship."],
    "privacy.retention": ["Datuen gordetzea", "Retention"],
    "privacy.retentionDetail": ["Enkargu bihurtzen ez diren kontsultak gehienez 12 hilabetez gordetzen ditut azken harremanetik aurrera. Enkargu bat formalizatzen bada, beharrezko informazioa harremanak irauten duen bitartean gordetzen dut, eta ondoren dagozkion legezko epeetan, betebeharrak betetzeko eta balizko erreklamazioei erantzuteko.", "I keep enquiries that do not lead to commissioned work for up to 12 months after the last communication. If we agree on a commission, I keep the necessary information for the duration of the relationship and then for the applicable legal periods to meet obligations and handle potential claims."],
    "privacy.providers": ["Zerbitzu-hornitzaileak", "Service providers"],
    "privacy.rights": ["Zure eskubideak", "Your rights"],
    "privacy.subject": ["Pribatutasuna", "Privacy"],
    "privacy.theme": ["Kolore-gaiaren hobespena", "Theme preference"],
    "privacy.themeDetail": ["Argia edo Iluna aukeratzen baduzu, webguneak hobespen hori zure nabigatzailearen biltegiratze lokalean gordetzen du. Sistema berriz aukeratzean, hobespena ezabatzen da. Webguneak ez du analitika-tresnarik edo publizitateko jarraitzailerik erabiltzen.", "If you choose Light or Dark, the site saves that preference in your browser’s local storage. Selecting System again clears the preference. The site uses no analytics or advertising trackers."],

    "legal.identification": ["Hauek dira webgunearen titularraren datuak, {1:34/2002 Legearen 10. artikuluaren} arabera.", "The website owner’s details are provided in accordance with {1:Article 10 of Law 34/2002}."],
    "legal.quotes": ["{1:Posta elektronikoz idatz diezadakezu} erabilgarritasuna galdetzeko edo aurrekontua eskatzeko. Aurrera egitea erabakitzen badugu, idatziz adostuko ditugu irismena, epeak, prezioa, entregagaiak eta, hala badagokio, materialak erabiltzeko eskubideak.", "You can {1:email me} to check availability or request a quote. If we decide to proceed, we’ll agree in writing on the scope, timelines, price, deliverables and, where applicable, the rights to use the materials."],
    "legal.reuse": ["Webguneko edukiak berrerabiltzeko, aplikatu beharreko lizentziari, eskubideen titularraren baimenari edo legeak aurreikusitako salbuespenei jarraitu behar zaie. Aitortzarekin edo eskubideekin lotutako arazoren bat antzematen baduzu, {1:idatzi} eta adierazi zein fitxa eta material diren, berrikusi ahal izan ditzadan.", "Reuse of website content is subject to the applicable licence, permission from the rights holder or exceptions provided by law. If you spot an attribution or rights issue, {1:email me} with the specific project entry and material so I can review it."],
    "legal.externalDetail": ["Esteka batzuek Steam, ArtStation edo GitHub bezalako plataformetako fitxetara eta laginetara eramaten dute. Orri horiek bisitatzean, plataforma bakoitzaren baldintzak eta politikak aplikatzen dira. {1:Pribatutasun-politikan} azaltzen dut nola tratatzen ditudan posta elektronikoz jasotzen ditudan kontsultak.", "Some links lead to listings and samples on platforms such as Steam, ArtStation or GitHub. Their own terms and policies apply when you visit those pages. The {1:privacy policy} explains how I handle enquiries received by email."],

    "privacy.controller": ["Mikel Arrizabalaga Munduate naiz, eta posta elektronikoz jasotzen ditudan kontsulten tratamenduaren arduraduna naiz. {1:arrizamikel@gmail.com} helbidera idatz dezakezu, edo nire helbidea {2:lege-oharrean} kontsultatu.", "I’m Mikel Arrizabalaga Munduate, the data controller for enquiries I receive by email. You can contact me at {1:arrizamikel@gmail.com} or find my address in the {2:legal notice}."],
    "privacy.google": ["Kontakturako botoiak zure posta-aplikazioa irekitzen du. Mezuak Gmailen jasotzen ditut. Googlek jakinarazten du datuak Europako Esparru Ekonomikotik kanpo trata daitezkeela, eta transferentzietarako bermeak azaltzen ditu. Horien artean daude egokitasun-erabakiak eta EB-AEB Datuen Pribatutasun Esparrua. Ikusi {1:Googleren transferentzia-esparruak} eta {2:Googleren pribatutasun-politika}.", "The contact button opens your email app. I receive messages in Gmail. Google says data may be processed outside the European Economic Area and describes its transfer safeguards, including adequacy decisions and the EU–US Data Privacy Framework. See {1:Google’s transfer frameworks} and {2:Google’s privacy policy}."],
    "privacy.github": ["Webgune publikoa GitHub Pagesen ostatatuta dago. GitHubek jakinarazten du bisitarien IP helbidea erregistratzen duela segurtasunagatik. Ikusi {1:GitHub Pagesen datu-bilketari buruzko informazioa}.", "The public site is hosted on GitHub Pages. GitHub says it logs visitors’ IP addresses for security. See {1:GitHub Pages’ information on data collection}."],
    "privacy.rightsDetail": ["Datuak eskuratzeko, zuzentzeko, ezabatzeko, tratamendua mugatzeko, aurka egiteko eta datuen eramangarritasunerako eskubideak balia ditzakezu, hala badagokio. Horretarako, idatzi {1:arrizamikel@gmail.com} helbidera. Halaber, erreklamazioa aurkez dezakezu {2:Datuak Babesteko Espainiako Agentzian}.", "You can request access, rectification, erasure, restriction, objection and portability where applicable. To exercise these rights, email {1:arrizamikel@gmail.com}. You can also lodge a complaint with the {2:Spanish Data Protection Agency}."],
  };

  const locales = {
    es: { social: 'es_ES' },
    eu: { social: 'eu_ES', column: 0 },
    en: { social: 'en_GB', column: 1 },
  };
  const preferences = navigator.languages?.length ? navigator.languages : [navigator.language];
  const language = preferences
    .map((tag) => tag?.toLowerCase().split('-')[0])
    .find((code) => Object.hasOwn(locales, code)) ?? 'es';
  if (language === 'es') return;

  const locale = locales[language];
  const translate = (key) => translations[key][locale.column];

  function translateAttribute(marker, attribute = marker) {
    for (const element of document.querySelectorAll('[data-i18n-' + marker + ']')) {
      element.setAttribute(attribute, translate(element.getAttribute('data-i18n-' + marker)));
    }
  }

  document.documentElement.lang = language;

  for (const element of document.querySelectorAll('[data-i18n]')) {
    element.textContent = translate(element.dataset.i18n);
  }

  for (const attribute of ['content', 'aria-label', 'alt']) translateAttribute(attribute);
  translateAttribute('hero-effects', 'data-hero-effects');
  translateAttribute('hero-collaboration', 'data-hero-collaboration');
  translateAttribute('degree', 'data-degree');
  translateAttribute('degrees', 'data-degrees');

  for (const link of document.querySelectorAll('[data-i18n-subject]')) {
    const base = link.getAttribute('href').split('?')[0];
    link.href = base + '?subject=' + encodeURIComponent(translate(link.dataset.i18nSubject));
  }

  for (const element of document.querySelectorAll('[data-i18n-rich]')) {
    const links = [...element.querySelectorAll('a')];
    // {1:label} keeps the first original link and replaces its text.
    const parts = translate(element.dataset.i18nRich).split(/\{(\d+):([^}]+)\}/g);
    const content = [parts[0]];
    for (let index = 1; index < parts.length; index += 3) {
      const link = links[Number(parts[index]) - 1];
      link.textContent = parts[index + 1];
      content.push(link, parts[index + 2]);
    }
    element.replaceChildren(...content);
  }

  const socialLocale = document.querySelector('meta[property="og:locale"]');
  if (socialLocale) socialLocale.content = locale.social;

  const profile = document.querySelector('script[data-i18n-job-title]');
  if (profile) {
    const details = JSON.parse(profile.textContent);
    details.inLanguage = language;
    details.mainEntity.jobTitle = translate(profile.dataset.i18nJobTitle);
    profile.textContent = JSON.stringify(details);
  }
})();
