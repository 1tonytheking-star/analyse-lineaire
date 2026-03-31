// ================================================================
// DATA LAYER — Firestore reads / writes + seed data
// ================================================================

import { db } from './firebase-config.js';
import {
  collection, doc, getDoc, getDocs, setDoc, addDoc,
  updateDoc, deleteDoc, orderBy, query, serverTimestamp, writeBatch
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ----------------------------------------------------------------
// SEED DATA
// ----------------------------------------------------------------
const SEED = {
  oeuvres: [
    {
      id: "corneille", auteur: "Pierre Corneille", titre: "Le Menteur",
      soustitre: "Comédie en cinq actes et en vers", mouvement: "Baroque / Classicisme (1644)",
      couleur1: "#1a3a4a", couleur2: "#0d5c8a",
      motsCles: ["Illusion : Le monde comme un théâtre","Paraître : Costume et rang social","Parole créatrice : Le mensonge","Métamorphose : de l'étudiant au cavalier"],
      enjeu: "Dorante, héros narcissique, utilise la parole créatrice pour réinventer son identité et transformer la réalité en un spectacle dont il est le metteur en scène.", order: 1
    },
    {
      id: "fontenelle", auteur: "Fontenelle", titre: "Entretiens sur la pluralité des mondes",
      soustitre: "Essai philosophique", mouvement: "Lumières / Classicisme (1686)",
      couleur1: "#2d1b4e", couleur2: "#6a3093",
      motsCles: ["Vulgarisation scientifique","Dialogue pédagogique","Copernic et l'héliocentrisme","Raison vs. tradition"],
      enjeu: "Fontenelle invente la vulgarisation scientifique moderne en mettant la philosophie naturelle à la portée d'un lectorat mondain, notamment féminin.", order: 2
    },
    {
      id: "rimbaud", auteur: "Arthur Rimbaud", titre: "Cahiers de Douai",
      soustitre: "Recueil de poèmes", mouvement: "Parnasse / Symbolisme naissant (1870)",
      couleur1: "#1a3a2a", couleur2: "#2d7a4a",
      motsCles: ["Révolte sociale et politique","Antimilitarisme","Anticléricalisme","Nature profanée"],
      enjeu: "Rimbaud, à 16 ans, dresse un réquisitoire contre la société bourgeoise, la guerre et l'Église à travers une poésie d'une violence et d'une lucidité stupéfiantes.", order: 3
    }
  ],
  textes: {
    corneille: [
      { id:"c-t1", titre:"Acte I, scène 1 (v. 1-21)",
        intro:"Cette scène d'exposition nous présente Dorante, qui vient de quitter ses études de droit pour entamer sa métamorphose en cavalier parisien.",
        contexte:"Retour de Corneille à la comédie (1644).", enjeu:"Métamorphose de Dorante : d'étudiant en cavalier parisien.",
        problematique:"En quoi cette scène d'exposition, qui apporte des éléments d'information au spectateur, aiguise-t-elle aussi son intérêt ?",
        texteIntegral:`<b>Dorante.</b>\nA la fin j'ai <span class="hl hl-1-1">quitté la robe pour l'épée</span> :\n<span class="hl hl-1-2">l'attente où j'ai vécu n'a point été trompée</span> ;\n<span class="hl hl-1-3">mon père a consenti que je suive mon choix,</span>\net j'ai fait <span class="hl hl-1-4">banqueroute à ce fatras de lois</span>.\n\nMais puisque nous voici <span class="hl hl-2-1">dedans les Tuileries</span>, 5\n<span class="hl hl-2-2">le pays du beau monde et des galanteries</span>,\n<span class="hl hl-2-3">dis-moi, me trouves-tu bien fait en cavalier ?</span>\n<span class="hl hl-2-4">Ne vois-tu rien en moi qui sente l'écolier ?</span>\nComme il est malaisé qu'<span class="hl hl-2-5">aux royaumes du code\non apprenne à se faire un visage à la mode</span>, 10\n<span class="hl hl-2-6">j'ai lieu d'appréhender...</span>\n\n<b>Cliton.</b>\n Ne craignez rien pour vous :\n<span class="hl hl-3-1">vous ferez en une heure ici mille jaloux.</span>\n<span class="hl hl-3-2">Ce visage et ce port n'ont point l'air de l'école</span>,\net <span class="hl hl-3-3">jamais comme vous on ne peignit Bartole</span> :\n<span class="hl hl-3-4">je prévois du malheur pour beaucoup de maris.</span> 15\n<span class="hl hl-3-5">Mais que vous semble encor maintenant de Paris ?</span>\n\n<b>Dorante.</b>\n<span class="hl hl-4-1">J'en trouve l'air bien doux, et cette loi bien rude</span>\nqui m'en avoit <span class="hl hl-4-2">banni sous prétexte d'étude</span>.\n<span class="hl hl-4-3">Toi qui sais les moyens de s'y bien divertir,\nayant eu le bonheur de n'en jamais sortir,</span> 20\n<span class="hl hl-4-4">dis-moi comme en ce lieu l'on gouverne les dames.</span>`,
        conclusion:"Le bilan informatif est complet : le spectateur connaît le passé et les buts de Dorante. L'intérêt dramatique est stimulé par la personnalité narcissique du héros, promettant une conduite audacieuse.",
        conclusionItems:[{label:"Bilan informatif",texte:"Passé et buts de Dorante pleinement révélés."},{label:"Intérêt dramatique",texte:"La personnalité narcissique promet une conduite audacieuse."},{label:"Thématique",texte:"Introduction du « théâtre dans le théâtre » par l'obsession du masque."}],
        order:1 },
      { id:"c-t2", titre:"Acte III, scène 5",
        intro:"Dorante face à son père Géronte : il prétend s'être marié à Poitiers. La mécanique du mensonge atteint ici son comble.",
        contexte:"Confrontation père/fils", enjeu:"Le mensonge comme art du paraître",
        problematique:"En quoi ce dialogue révèle-t-il Dorante comme un maître de l'illusion autant que comme personnage comique ?",
        texteIntegral:`<b>Géronte.</b>\nDorante, est-il bien vrai qu'à Poitiers tu t'es marié ?\n\n<b>Dorante.</b>\nVous le savez, mon père, et vous l'avez su dès hier.\n\n<b>Géronte.</b>\nJe l'ai su, mais ta femme, où l'as-tu donc laissée ?\n\n<b>Dorante.</b>\n<span class="hl hl-1-1">A Poitiers, où depuis elle est demeurée.</span>\nElle avoit de l'amour pour son pays natal,\net <span class="hl hl-1-2">son humeur là-bas n'est pas toujours égale.</span>`,
        conclusion:"La scène illustre la virtuosité du mensonge cornélien, qui ne recule devant rien, même pas le sacrilège filial.",
        conclusionItems:[{label:"Virtuosité",texte:"Dorante improvise un récit cohérent en temps réel."},{label:"Comique",texte:"Le spectateur, qui sait la vérité, jouit du double sens."}],
        order:2 },
      { id:"c-t3", titre:"Acte V, scène 6",
        intro:"Dénouement : Dorante est démasqué. Corneille signe un dénouement ambigu, entre leçon morale et admiration pour son héros.",
        contexte:"Dénouement et révélations", enjeu:"L'impossible repentir du menteur",
        problematique:"En quoi le dénouement corrige-t-il le héros sans pour autant le condamner ?",
        texteIntegral:`<b>Dorante.</b>\n<span class="hl hl-1-1">Ah ! j'ai trop mérité les coups que j'en reçois.</span>\nJe suis pris dans le piège où j'avois pris les autres :\n<span class="hl hl-1-2">ma honte est juste prix de mes perfides tours.</span>`,
        conclusion:"Le repentir de Dorante est ambigu : sincère ou calculé ? Corneille laisse planer le doute.",
        conclusionItems:[{label:"Ambiguïté",texte:"Le repentir de Dorante reste équivoque jusqu'au bout."},{label:"Dénouement",texte:"Corneille choisit la vraisemblance morale plutôt que la punition exemplaire."}],
        order:3 }
    ],
    fontenelle: [
      { id:"f-t1", titre:"Préface des Entretiens",
        intro:"Fontenelle pose les bases de son projet révolutionnaire : rendre la science accessible à tous, et en particulier aux femmes, sans la trahir.",
        contexte:"Projet de vulgarisation (1686)", enjeu:"Rendre la philosophie naturelle accessible",
        problematique:"En quoi la préface des Entretiens constitue-t-elle un manifeste de la vulgarisation scientifique ?",
        texteIntegral:`Je me suis proposé dans ces Entretiens une femme que l'on instruit pour la première fois, et qui n'a jamais rien ouï parler de ces choses. J'ai cru que cette fiction me seroit utile, et pour rendre l'ouvrage plus susceptible d'agrément, et pour encourager les femmes par l'exemple d'une femme qui sans sortir d'une condition ordinaire, sans avoir eu aucune éducation particulière, est capable de comprendre ce qu'on lui explique.`,
        conclusion:"La préface définit le contrat de lecture d'un texte fondateur du genre de la vulgarisation scientifique.",
        conclusionItems:[{label:"Public visé",texte:"Fontenelle s'adresse explicitement aux non-spécialistes, notamment les femmes."},{label:"Fiction pédagogique",texte:"La marquise est un personnage-prétexte pour guider le lecteur."}],
        order:1 },
      { id:"f-t2", titre:"« Enfin Copernic vint »",
        intro:"Fontenelle retrace la révolution copernicienne comme un récit héroïque : Copernic, seul contre tous, renverse le monde.",
        contexte:"La révolution héliocentrique", enjeu:"Valoriser la pensée rationnelle contre les préjugés",
        problematique:"Comment Fontenelle construit-il une figure héroïque du savant pour légitimer la science nouvelle ?",
        texteIntegral:`<span class="hl hl-1-1">Enfin vint Copernic, qui fit main-basse sur tous ces cercles et ces épicycles.</span> Incapable d'être content d'un système aussi embrouillé, il alla prendre le Soleil, et le mit au centre de l'Univers, où il avoit bien le droit d'être, <span class="hl hl-1-2">parce qu'il éclaire tout le monde.</span> Les Planètes n'eurent plus leurs anciens ballets compliqués ; chacune fit son tour simple autour du Soleil.`,
        conclusion:"La métaphore du ballet et le ton héroïque font de Copernic un réformateur romanesque autant que scientifique.",
        conclusionItems:[{label:"Héroïsation",texte:"Copernic est présenté comme un fondateur, un révolutionnaire solitaire."},{label:"Métaphore",texte:"Le vocabulaire du ballet traduit la mécanique céleste en termes sensibles."}],
        order:2 },
      { id:"f-t3", titre:"Le Cinquième Soir",
        intro:"Fontenelle aborde l'infini de l'Univers, ouvrant un vertige philosophique que la marquise doit apprivoiser.",
        contexte:"L'infini de l'Univers", enjeu:"Du vertige métaphysique à la sérénité rationnelle",
        problematique:"Comment Fontenelle transforme-t-il le vertige de l'infini en un sentiment agréable et stimulant ?",
        texteIntegral:`<span class="hl hl-1-1">« Je me figure toujours, dis-je à la Marquise, que l'Univers est un grand spectacle ressemblant en quelque chose à celui de l'Opéra. »</span> Vous n'êtes pas au théâtre de la même façon que l'Ouvrier qui est dessous, qui fait jouer les machines. Cet Ouvrier est caché ; <span class="hl hl-2-1">il vous laisse admirer les effets de son art, sans vous en révéler le secret.</span>`,
        conclusion:"La métaphore de l'Opéra synthétise la philosophie de Fontenelle : la nature est un spectacle à déchiffrer, non une vérité révélée.",
        conclusionItems:[{label:"Métaphore centrale",texte:"L'Opéra représente l'Univers : spectacle, machination, mystère."},{label:"Épistémologie",texte:"Fontenelle distingue l'apparence (le spectacle) et les lois cachées (la machinerie)."}],
        order:3 }
    ],
    rimbaud: [
      { id:"r-t1", titre:"« Les Effarés »",
        intro:"Des enfants pauvres collés à la fenêtre d'une boulangerie, fascinés par la chaleur du pain. Rimbaud dénonce l'indifférence sociale du Second Empire.",
        contexte:"Dénonciation sociale sous le Second Empire", enjeu:"Réquisitoire contre l'indifférence sociale",
        problematique:"En quoi ce poème est-il à la fois une peinture réaliste de la misère et un réquisitoire social ?",
        texteIntegral:`Noirs dans la neige et dans la brume,\nAu grand soupirail qui s'allume,\n   Leurs culs en rond,\n\nÀ genoux, cinq petits, — misère ! —\nRegardent le Boulanger faire\n   Le lourd pain blond.\n\nIls voient le fort bras blanc qui tourne\nLa pâte grise et qui l'enfourne\n   Dans un trou clair.\n\nIls écoutent le bon pain cuire.\nLe Boulanger au gras sourire\n   Grogne un vieil air.\n\nIls sont blottis, pas un ne bouge,\nAu souffle du soupirail rouge\n   Chaud comme un sein.`,
        conclusion:"Le poème associe la féerie sensorielle du pain à la dureté de l'exclusion sociale, créant un pathétique d'autant plus puissant.",
        conclusionItems:[{label:"Féerie",texte:"La chaleur du pain rend l'indifférence encore plus douce-amère."},{label:"Dénonciation",texte:"Puissant réquisitoire social contre le Second Empire."}],
        order:1 },
      { id:"r-t2", titre:"« Le Mal »",
        intro:"Ce sonnet virulent prend racine dans la débâcle de la guerre franco-prussienne. Rimbaud met en accusation les responsables humains et l'indifférence divine.",
        contexte:"Sonnet né de la débâcle de la guerre franco-prussienne.", enjeu:"Mise en accusation des responsables humains et de l'indifférence divine.",
        problematique:"En quoi ce texte est-il un sonnet politique antimilitariste et anticlérical ?",
        texteIntegral:`Tandis que <span class="hl hl-1-1">les crachats rouges de la mitraille</span>\n<span class="hl hl-1-2">Sifflent tout le jour par l'infini du ciel bleu</span> ;\nQu'écarlates ou verts, près du <span class="hl hl-1-3">Roi qui les raille</span>.\n<span class="hl hl-1-4">Croulent les bataillons</span> en masse dans le feu ;\nTandis qu'une <span class="hl hl-2-1">folie épouvantable, broie</span> 5\nEt fait de cent milliers d'hommes <span class="hl hl-2-2">un tas fumant</span> ;\n— <span class="hl hl-2-3">Pauvres morts ! dans l'été, dans l'herbe, dans ta joie,</span>\n<span class="hl hl-2-4">Nature ! ô toi qui fis ces hommes saintement !</span>… —\n\n— Il est un Dieu, qui <span class="hl hl-3-1">rit aux nappes damassées\nDes autels, à l'encens, aux grands calices d'or</span> ; 10\n<span class="hl hl-3-2">Qui dans le bercement des hosannah s'endort.</span>\nEt se réveille, quand des mères, ramassées\nDans l'angoisse, et <span class="hl hl-4-1">pleurant sous leur vieux bonnet noir</span>,\n<span class="hl hl-4-2">Lui donnent un gros sou lié dans leur mouchoir !</span>`,
        conclusion:"Le poème dresse le réquisitoire d'un massacre inutile orchestré par la folie des rois. Il dépasse l'antimilitarisme pour dénoncer les abus d'une Église corrompue et indifférente.",
        conclusionItems:[{label:"Massacre",texte:"Réquisitoire d'un massacre inutile orchestré par la folie des rois."},{label:"Abus",texte:"Dénonciation des abus d'une Église corrompue et indifférente."},{label:"Rhétorique",texte:"Puissantes hypotyposes qui renforcent le sentiment pathétique."},{label:"Victimes",texte:"Seul le peuple paie le prix du sang et des larmes."}],
        order:2 }
    ]
  },
  analyses: {
    "c-t1": [
      { id:"c-t1-mvt1", mouvement:1, titre:"L'émancipation de Dorante", vers:"v. 1-4",
        procedes:[
          {id:"p-c1m1-1",num:1,citation:"quitté la robe pour l'épée",ref:"(v. 1)",procede:"antithèse vestimentaire",analyse:`L'<span class="procede-type">antithèse vestimentaire</span> symbolise un changement d'identité radical : la robe du juriste contre l'épée du noble guerrier.`},
          {id:"p-c1m1-2",num:2,citation:"l'attente où j'ai vécu n'a point été trompée",ref:"(v. 2)",procede:"litote",analyse:`La <span class="procede-type">litote</span> (« n'a point été trompée ») traduit discrètement une profonde satisfaction.`},
          {id:"p-c1m1-3",num:3,citation:"mon père a consenti que je suive mon choix",ref:"(v. 3)",procede:"valorisation de l'autonomie",analyse:`L'insistance sur le <span class="procede-type">consentement paternel</span> paradoxalement souligne la rébellion de Dorante.`},
          {id:"p-c1m1-4",num:4,citation:"banqueroute à ce fatras de lois",ref:"(v. 4)",procede:"métaphore financière + terme péjoratif",analyse:`La <span class="procede-type">métaphore financière</span> (« banqueroute ») et le <span class="procede-type">terme péjoratif</span> (« fatras ») rejettent son passé d'étudiant avec un profond mépris.`}
        ]},
      { id:"c-t1-mvt2", mouvement:2, titre:"Le théâtre des Tuileries", vers:"v. 5-11",
        procedes:[
          {id:"p-c1m2-1",num:1,citation:"dedans les Tuileries",ref:"(v. 5)",procede:"didascalie interne",analyse:`La <span class="procede-type">didascalie interne</span> ancre l'action dans un lieu mondain de parade.`},
          {id:"p-c1m2-2",num:2,citation:"le pays du beau monde et des galanteries",ref:"(v. 6)",procede:"périphrase élogieuse",analyse:`La <span class="procede-type">périphrase élogieuse</span> définit le nouveau système de valeurs de Dorante : l'apparence et la séduction.`},
          {id:"p-c1m2-3",num:3,citation:"dis-moi, me trouves-tu bien fait en cavalier ?",ref:"(v. 7)",procede:"interrogation directe",analyse:`L'<span class="procede-type">interrogation directe</span> trahit le narcissisme de Dorante et son besoin de validation.`},
          {id:"p-c1m2-4",num:4,citation:"Ne vois-tu rien en moi qui sente l'écolier ?",ref:"(v. 8)",procede:"phrase interro-négative + antithèse",analyse:`La <span class="procede-type">phrase interro-négative</span> et l'<span class="procede-type">antithèse</span> (cavalier / écolier) révèlent son insécurité.`},
          {id:"p-c1m2-5",num:5,citation:"aux royaumes du code / on apprenne à se faire un visage à la mode",ref:"(v. 9-10)",procede:"allégorie + métaphore de fabrication",analyse:`L'<span class="procede-type">allégorie</span> austère de l'université s'oppose à la <span class="procede-type">métaphore de la fabrication</span> du visage, dévoilant une identité conçue comme un simple masque.`},
          {id:"p-c1m2-6",num:6,citation:"j'ai lieu d'appréhender...",ref:"(v. 11)",procede:"aposiopèse",analyse:`L'<span class="procede-type">aposiopèse</span> (interruption) par le valet donne un rythme vif à l'échange comique.`}
        ]},
      { id:"c-t1-mvt3", mouvement:3, titre:"La flatterie de Cliton", vers:"v. 12-16",
        procedes:[
          {id:"p-c1m3-1",num:1,citation:"vous ferez en une heure ici mille jaloux",ref:"(v. 12)",procede:"hyperbole chiffrée",analyse:`L'<span class="procede-type">hyperbole chiffrée</span> de Cliton flatte l'ego de son maître.`},
          {id:"p-c1m3-2",num:2,citation:"Ce visage et ce port n'ont point l'air de l'école",ref:"(v. 13)",procede:"parallélisme",analyse:`Le <span class="procede-type">parallélisme</span> souligne la transformation purement physique.`},
          {id:"p-c1m3-3",num:3,citation:"jamais comme vous on ne peignit Bartole",ref:"(v. 14)",procede:"référence culturelle comique",analyse:`La <span class="procede-type">référence culturelle comique</span> (Bartole, vieux juriste) crée un contraste par l'absurde avec la beauté de Dorante.`},
          {id:"p-c1m3-4",num:4,citation:"je prévois du malheur pour beaucoup de maris",ref:"(v. 15)",procede:"prolepse",analyse:`Cette <span class="procede-type">prolepse</span> dramatique annonce les intrigues amoureuses à venir.`},
          {id:"p-c1m3-5",num:5,citation:"Mais que vous semble encor maintenant de Paris ?",ref:"(v. 16)",procede:"question de relance",analyse:`La <span class="procede-type">question de relance</span> permet à Dorante d'exposer sa philosophie.`}
        ]},
      { id:"c-t1-mvt4", mouvement:4, titre:"Le projet galant", vers:"v. 17-21",
        procedes:[
          {id:"p-c1m4-1",num:1,citation:"J'en trouve l'air bien doux, et cette loi bien rude",ref:"(v. 17)",procede:"parallélisme antithétique",analyse:`Le <span class="procede-type">parallélisme antithétique</span> justifie son choix moral du plaisir contre la contrainte.`},
          {id:"p-c1m4-2",num:2,citation:"banni sous prétexte d'étude",ref:"(v. 18)",procede:"lexique de l'exil + ironie",analyse:`Le lexique dramatique de l'<span class="procede-type">exil</span> (« banni ») et le nom ironique « prétexte » dévaluent totalement l'éducation.`},
          {id:"p-c1m4-3",num:3,citation:"divertir / ayant eu le bonheur de n'en jamais sortir",ref:"(v. 19-20)",procede:"champ lexical de la jouissance",analyse:`Le <span class="procede-type">champ lexical de la jouissance</span> montre la complicité hédoniste entre le maître et le valet.`},
          {id:"p-c1m4-4",num:4,citation:"dis-moi comme en ce lieu l'on gouverne les dames",ref:"(v. 21)",procede:"métaphore militaire",analyse:`La <span class="procede-type">métaphore militaire et politique</span> (« gouverne ») résume l'amour à une stratégie de conquête.`}
        ]}
    ],
    "r-t2": [
      { id:"r-t2-mvt1", mouvement:1, titre:"L'horreur aveugle et mécanique", vers:"v. 1-4",
        procedes:[
          {id:"p-r2m1-1",num:1,citation:"les crachats rouges de la mitraille",ref:"(v. 1)",procede:"métaphore organique hideuse",analyse:`La <span class="procede-type">métaphore organique hideuse</span> (« crachats ») dépouille la guerre de toute grandeur épique.`},
          {id:"p-r2m1-2",num:2,citation:"l'infini du ciel bleu",ref:"(v. 2)",procede:"antithèse chromatique",analyse:`La pureté de cette <span class="procede-type">antithèse chromatique</span> (bleu du ciel / rouge du sang) accuse l'impassibilité du monde face au massacre.`},
          {id:"p-r2m1-3",num:3,citation:"Roi qui les raille",ref:"(v. 3)",procede:"allitération gutturale en [r]",analyse:`L'<span class="procede-type">allitération gutturale en [r]</span> souligne la violence de l'attaque politique directe.`},
          {id:"p-r2m1-4",num:4,citation:"Croulent les bataillons",ref:"(v. 4)",procede:"inversion syntaxique",analyse:`L'<span class="procede-type">inversion syntaxique</span> mettant le verbe de chute dramatique en tête de vers illustre l'anéantissement de masse.`}
        ]},
      { id:"r-t2-mvt2", mouvement:2, titre:"La Nature profanée par l'industrie de mort", vers:"v. 5-8",
        procedes:[
          {id:"p-r2m2-1",num:1,citation:"folie épouvantable, broie",ref:"(v. 5)",procede:"personnification + enjambement",analyse:`La violente <span class="procede-type">personnification</span> et l'<span class="procede-type">enjambement</span> transforment la guerre en une machine infernale et dévorante.`},
          {id:"p-r2m2-2",num:2,citation:"un tas fumant",ref:"(v. 6)",procede:"métaphore réifiante",analyse:`La terrible <span class="procede-type">métaphore réifiante</span> anéantit l'individualité de « cent milliers d'hommes ».`},
          {id:"p-r2m2-3",num:3,citation:"Pauvres morts ! dans l'été, dans l'herbe, dans ta joie",ref:"(v. 7)",procede:"anaphore",analyse:`L'<span class="procede-type">anaphore</span> rythme le contraste cruel entre le printemps verdoyant et la rigidité cadavérique.`},
          {id:"p-r2m2-4",num:4,citation:"Nature ! ô toi qui fis ces hommes saintement !",ref:"(v. 8)",procede:"apostrophe lyrique païenne",analyse:`L'<span class="procede-type">apostrophe lyrique païenne</span> accuse par contraste l'impiété des chefs de guerre.`}
        ]},
      { id:"r-t2-mvt3", mouvement:3, titre:"Le cynisme luxueux de Dieu", vers:"v. 9-12",
        procedes:[
          {id:"p-r2m3-1",num:1,citation:"rit aux nappes damassées / Des autels, à l'encens, aux grands calices d'or",ref:"(v. 9-10)",procede:"champ lexical de l'opulence religieuse",analyse:`La saturation du <span class="procede-type">champ lexical de l'opulence religieuse</span> fustige la richesse obscène d'une Église coupée de son peuple.`},
          {id:"p-r2m3-2",num:2,citation:"Qui dans le bercement des hosannah s'endort",ref:"(v. 11)",procede:"métaphore du sommeil",analyse:`La <span class="procede-type">métaphore du sommeil</span> révèle l'hypocrisie des rituels qui servent d'œillères pour ignorer le Mal.`}
        ]},
      { id:"r-t2-mvt4", mouvement:4, titre:"Le scandale vénal de l'Église", vers:"v. 13-14",
        procedes:[
          {id:"p-r2m4-1",num:1,citation:"pleurant sous leur vieux bonnet noir",ref:"(v. 13)",procede:"détail réaliste et chromatique",analyse:`Ce <span class="procede-type">détail réaliste et chromatique</span> (le deuil populaire) contraste violemment avec les « calices d'or ».`},
          {id:"p-r2m4-2",num:2,citation:"Lui donnent un gros sou lié dans leur mouchoir !",ref:"(v. 14)",procede:"chute ironique",analyse:`La redoutable <span class="procede-type">chute ironique</span> prouve que la religion n'est qu'un commerce.`}
        ]}
    ]
  }
};

// ----------------------------------------------------------------
// SEED — vérifie que la base est vide avant d'insérer (anti-doublon)
// ----------------------------------------------------------------
export async function seedIfEmpty() {
  const snap = await getDocs(collection(db, 'oeuvres'));
  if (!snap.empty) { console.log('DB déjà initialisée.'); return; }

  console.log('Initialisation de la base…');

  for (const oeuvre of SEED.oeuvres) {
    await setDoc(doc(db, 'oeuvres', oeuvre.id), { ...oeuvre, createdAt: serverTimestamp() });
  }

  for (const [oeuvreId, textes] of Object.entries(SEED.textes)) {
    for (const texte of textes) {
      await setDoc(doc(db, 'textes', texte.id), { ...texte, oeuvreId, createdAt: serverTimestamp() });
    }
  }

  for (const [texteId, mouvements] of Object.entries(SEED.analyses)) {
    for (const mvt of mouvements) {
      const { procedes, ...mvtData } = mvt;
      await setDoc(doc(db, 'mouvements', mvt.id), { ...mvtData, texteId, createdAt: serverTimestamp() });
      for (let i = 0; i < procedes.length; i++) {
        await setDoc(doc(db, 'procedes', procedes[i].id), { ...procedes[i], mouvementId: mvt.id, texteId, order: i, createdAt: serverTimestamp() });
      }
    }
  }
  console.log('Seed terminé !');
}

// ---- Oeuvres ----
export async function getOeuvres() {
  const snap = await getDocs(query(collection(db, 'oeuvres'), orderBy('order')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
export async function addOeuvre(data) {
  const id = 'oeuvre-' + Date.now();
  await setDoc(doc(db, 'oeuvres', id), { ...data, order: Date.now(), createdAt: serverTimestamp() });
  return id;
}
export async function updateOeuvre(id, data) {
  await updateDoc(doc(db, 'oeuvres', id), { ...data, updatedAt: serverTimestamp() });
}

// ---- Textes ----
export async function getTextesForOeuvre(oeuvreId) {
  const snap = await getDocs(query(collection(db, 'textes'), orderBy('order')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(t => t.oeuvreId === oeuvreId);
}
export async function getTexte(texteId) {
  const snap = await getDoc(doc(db, 'textes', texteId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}
export async function addTexte(oeuvreId, data) {
  const id = 'tx-' + Date.now();
  await setDoc(doc(db, 'textes', id), { ...data, oeuvreId, order: Date.now(), createdAt: serverTimestamp() });
  return id;
}
export async function updateTexte(id, data) {
  await updateDoc(doc(db, 'textes', id), { ...data, updatedAt: serverTimestamp() });
}

// ---- Mouvements ----
export async function getMouvementsForTexte(texteId) {
  const snap = await getDocs(query(collection(db, 'mouvements'), orderBy('mouvement')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(m => m.texteId === texteId);
}
export async function addMouvement(texteId, data) {
  const id = 'mvt-' + Date.now();
  await setDoc(doc(db, 'mouvements', id), { ...data, texteId, createdAt: serverTimestamp() });
  return id;
}
export async function updateMouvement(id, data) {
  await updateDoc(doc(db, 'mouvements', id), { ...data, updatedAt: serverTimestamp() });
}
export async function deleteMouvement(id) {
  await deleteDoc(doc(db, 'mouvements', id));
}

// ---- Procédés ----
export async function getProcedesForMouvement(mouvementId) {
  const snap = await getDocs(query(collection(db, 'procedes'), orderBy('order')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(p => p.mouvementId === mouvementId);
}
export async function addProcede(mouvementId, texteId, data) {
  return await addDoc(collection(db, 'procedes'), { ...data, mouvementId, texteId, order: Date.now(), createdAt: serverTimestamp() });
}
export async function updateProcede(id, data) {
  await updateDoc(doc(db, 'procedes', id), { ...data, updatedAt: serverTimestamp() });
}
export async function deleteProcede(id) {
  await deleteDoc(doc(db, 'procedes', id));
}
