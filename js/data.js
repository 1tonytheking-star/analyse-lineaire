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
      { id:"c-t2", titre:"Acte III, scène 5 (v. 963-994)",
        intro:"Dorante est confronté à Clarice qui sait qu'il est marié. La scène révèle le menteur pris à son propre jeu, mais toujours aussi effronté.",
        contexte:"Confrontation entre Dorante et Clarice (v. 963-994).", enjeu:"Le mensonge comme art du paraître face au démenti.",
        problematique:"En quoi ce dialogue révèle-t-il Dorante comme un maître de l'illusion autant que comme personnage comique ?",
        texteIntegral:`<b>Dorante.</b>\n Impossible ! Ah ! Pour vous\nje pourrai tout, madame, en tous lieux, contre tous.\n\n<b>Clarice.</b>\nJusqu'à vous marier, quand je sais que vous l'êtes ? 965\n\n<b>Dorante.</b>\nMoi, marié ! Ce sont pièces qu'on vous a faites ;\nquiconque vous l'a dit s'est voulu divertir.\n\n<b>Clarice.</b>\nEst-il un plus grand fourbe ?\n\n<b>Lucrèce.</b>\n Il ne sait que mentir.\n\n<b>Dorante.</b>\nJe ne le fus jamais ; et si par cette voie\non pense...\n\n<b>Clarice.</b>\n Et vous pensez encor que je vous croie ? 970\n\n<b>Dorante.</b>\nQue le foudre à vos yeux m'écrase, si je mens !\n\n<b>Clarice.</b>\nUn menteur est toujours prodigue de serments.\n\n<b>Dorante.</b>\nNon, si vous avez eu pour moi quelque pensée\nqui sur ce faux rapport puisse être balancée,\ncessez d'être en balance et de vous défier 975\nde ce qu'il m'est aisé de vous justifier.\n\n<b>Clarice.</b>\nOn diroit qu'il dit vrai, tant son effronterie\navec naïveté pousse une menterie.\n\n<b>Dorante.</b>\nPour vous ôter de doute, agréez que demain\nen qualité d'époux je vous donne la main. 980\n\n<b>Clarice.</b>\nEh ! Vous la donneriez en un jour à deux mille.\n\n<b>Dorante.</b>\nCertes, vous m'allez mettre en crédit par la ville,\nmais en crédit si grand, que j'en crains les jaloux.\n\n<b>Clarice.</b>\nC'est tout ce que mérite un homme tel que vous,\nun homme qui se dit un grand foudre de guerre, 985\net n'en a vu qu'à coups d'écritoire ou de verre ;\nqui vint hier de Poitiers, et conte, à son retour,\nque depuis une année il fait ici sa cour ;\nqui donne toute nuit festin, musique et danse,\nbien qu'il l'ait dans son lit passée en tout silence ; 990\nqui se dit marié, puis soudain s'en dédit :\nsa méthode est jolie à se mettre en crédit !\nVous-même, apprenez-moi comme il faut qu'on le nomme.\n\n<b>Cliton.</b>\nSi vous vous en tirez, je vous tiens habile homme.`,
        conclusion:"La scène illustre la virtuosité du mensonge cornélien, qui ne recule devant rien, même pas le sacrilège filial.",
        conclusionItems:[{label:"Virtuosité",texte:"Dorante improvise un récit cohérent en temps réel."},{label:"Comique",texte:"Le spectateur, qui sait la vérité, jouit du double sens."}],
        order:2 },
      { id:"c-t3", titre:"Acte V, scène 6 (v. 1713-1731)",
        intro:"Dénouement : Dorante apprend qu'il a confondu les deux jeunes femmes. Loin d'être accablé, il rebondit aussitôt et prépare un nouveau mensonge.",
        contexte:"Dénouement et révélations (v. 1713-1731).", enjeu:"L'impossible repentir du menteur.",
        problematique:"En quoi le dénouement corrige-t-il le héros sans pour autant le condamner ?",
        texteIntegral:`<b>Clarice.</b>\nMais enfin vous n'avez que mépris pour Clarice ?\n\n<b>Dorante.</b>\nMais enfin vous savez le nœud de l'artifice,\net que pour être à vous je fais ce que je puis. 1715\n\n<b>Clarice.</b>\nJe ne sais plus moi-même, à mon tour, où j'en suis.\nLucrèce, écoute un mot.\n\n<b>Dorante.</b>\n Lucrèce ! Que dit-elle ?\n\n<b>Cliton.</b>\nVous en tenez, monsieur : Lucrèce est la plus belle ;\nmais laquelle des deux ? J'en ai le mieux jugé,\net vous auriez perdu si vous aviez gagé. 1720\n\n<b>Dorante.</b>\nCette nuit à la voix j'ai cru la reconnoître.\n\n<b>Cliton.</b>\nClarice sous son nom parloit à sa fenêtre ;\nSabine m'en a fait un secret entretien.\n\n<b>Dorante.</b>\nBonne bouche, j'en tiens ; mais l'autre la vaut bien ;\net comme dès tantôt je la trouvois bien faite, 1725\nmon cœur déjà penchoit où mon erreur le jette.\nNe me découvre point ; et dans ce nouveau feu\ntu me vas voir, Cliton, jouer un nouveau jeu.\nSans changer de discours changeons de batterie.\n\n<b>Lucrèce.</b>\nVoyons le dernier point de son effronterie ; 1730\nquand tu lui diras tout, il sera bien surpris.`,
        conclusion:"Le repentir de Dorante est ambigu : sincère ou calculé ? Corneille laisse planer le doute.",
        conclusionItems:[{label:"Ambiguïté",texte:"Le repentir de Dorante reste équivoque jusqu'au bout."},{label:"Dénouement",texte:"Corneille choisit la vraisemblance morale plutôt que la punition exemplaire."}],
        order:3 }
    ],
    fontenelle: [
      { id:"f-t1", titre:"« Préface » (extrait)",
        intro:"Fontenelle adresse une lettre-préface à un ami pour lui raconter ses soirées philosophiques avec la Marquise. Il y définit son projet de vulgarisation scientifique.",
        contexte:"Préface dédicatoire des Entretiens (1686).", enjeu:"Rendre la philosophie naturelle accessible à un lectorat mondain.",
        problematique:"En quoi la préface des Entretiens constitue-t-elle un manifeste de la vulgarisation scientifique ?",
        texteIntegral:`Vous voulez, Monsieur, que je vous rende un compte exact de la manière dont j'ai passé mon temps à la campagne, chez Madame la Marquise de G***. Savez-vous bien que ce compte exact sera un livre ; et ce qu'il y a de pis, un livre de philosophie ? Vous vous attendez à des fêtes, à des parties de jeu ou de chasse, et vous aurez des planètes, des mondes, des tourbillons ; il n'a presque été question que de ces choses-là. Heureusement vous êtes philosophe, et vous ne vous en moquerez pas tant qu'un autre. Peut-être même serez-vous bien aise que j'aie attiré Madame la Marquise dans le parti de la philosophie. Nous ne pouvions faire une acquisition plus considérable ; car je compte que la beauté et la jeunesse sont toujours des choses d'un grand prix. Ne croyez-vous pas que si la sagesse elle-même voulait se présenter aux hommes avec succès, elle ne ferait point mal de paraître sous une figure qui approchât un peu de celle de la Marquise ? Surtout si elle pouvait avoir dans sa conversation les mêmes agréments, je suis persuadé que tout le monde courrait après la sagesse. Ne vous attendez pourtant pas à entendre des merveilles, quand je vous ferai le récit des entretiens que j'ai eus avec cette dame ; il faudrait presque avoir autant d'esprit qu'elle, pour répéter ce qu'elle dit de la manière dont elle l'a dit. Vous lui verrez seulement cette vivacité d'intelligence que vous lui connaissez. Pour moi, je la tiens savante, à cause de l'extrême facilité qu'elle aurait à le devenir. Qu'est-ce qui lui manque? D'avoir ouvert les yeux sur des livres ; cela n'est rien, et bien des gens l'ont fait toute leur vie, à qui je refuserais, si j'osais, le nom de savants. Au reste, Monsieur, vous m'aurez une obligation. Je sais bien qu'avant que d'entrer dans le détail des conversations que j'ai eues avec la Marquise, je serais en droit de vous décrire le château où elle était allée passer l'automne. On a souvent décrit des châteaux pour de moindres occasions ; mais je vous ferai grâce sur cela. Il suffit que vous sachiez que quand j'arrivai chez elle, je n'y trouvai point de compagnie, et que j'en fus fort aise. Les deux premiers jours n'eurent rien de remarquable ; ils se passèrent à épuiser les nouvelles de Paris d'où je venais, mais ensuite vinrent ces entretiens dont je veux vous faire part. Je vous les diviserai par soirs, parce qu'effectivement nous n'eûmes de ces entretiens que les soirs.`,
        conclusion:"La préface définit le contrat de lecture d'un texte fondateur du genre de la vulgarisation scientifique.",
        conclusionItems:[{label:"Public visé",texte:"Fontenelle s'adresse explicitement aux non-spécialistes, notamment les femmes."},{label:"Fiction pédagogique",texte:"La marquise est un personnage-prétexte pour guider le lecteur."}],
        order:1 },
      { id:"f-t2", titre:"« Enfin Copernic vint » — Premier Soir",
        intro:"Fontenelle retrace la révolution copernicienne comme un récit héroïque : Copernic, seul contre tous, renverse l'ordre du monde antique et met le Soleil au centre de l'Univers.",
        contexte:"La révolution héliocentrique — Premier Soir.", enjeu:"Valoriser la pensée rationnelle contre les préjugés et héroïser le savant.",
        problematique:"Comment Fontenelle construit-il une figure héroïque du savant pour légitimer la science nouvelle ?",
        texteIntegral:`Il n'y a plus ici d'embarras inutiles, repris-je. Figurez-vous un Allemand nommé Copernic, qui fait main basse sur tous ces cercles différens, et sur tous ces cieux solides qui avoient été imaginés par l'Antiquité. Il détruit les uns, il met les autres en pièces. Saisi d'une noble fureur d'astronome, il prend la Terre et l'envoie bien loin du centre de l'univers, où elle s'étoit placée, et dans ce centre, il y met le Soleil, à qui cet honneur étoit bien mieux dû. Les planètes ne tournent plus autour de la Terre, et ne l'enferment plus au milieu du cercle qu'elles décrivent. Si elles nous éclairent, c'est en quelque sorte par hasard, et parce qu'elles nous rencontrent en leur chemin. Tout tourne présentement autour du Soleil, la Terre y tourne elle-même, et pour la punir du long repos qu'elle s'étoit attribué, Copernic la charge le plus qu'il peut de tous les mouvemens qu'elle donnoit aux planètes et aux cieux. Enfin de tout cet équipage céleste dont cette petite Terre se faisoit accompagner et environner, il ne lui est demeuré que la Lune qui tourne encore autour d'elle. Attendez un peu, dit la Marquise, il vient de vous prendre un enthousiasme qui vous a fait expliquer les choses si pompeusement, que je ne crois pas les avoir entendues. Le Soleil est au centre de l'univers, et là il est immobile, après lui, qu'est-ce qui suit ? C'est Mercure, répondis-je, il tourne autour du Soleil, en sorte que le Soleil est à peu près le centre du cercle que Mercure décrit. Au-dessus de Mercure est Vénus, qui tourne de même autour du Soleil. Ensuite vient la Terre qui, étant plus élevée que Mercure et Vénus, décrit autour du Soleil un plus grand cercle que ces planètes. Enfin suivent Mars, Jupiter, Saturne, selon l'ordre où je vous les nomme ; et vous voyez bien que Saturne doit décrire autour du Soleil le plus grand cercle de tous ; aussi emploie-t-il plus de temps qu'aucune autre planète à faire sa révolution. Et la Lune, vous l'oubliez, interrompit-elle. Je la retrouverai bien repris-je. La Lune tourne autour de la Terre et ne l'abandonne point ; mais comme la Terre avance toujours dans le cercle qu'elle décrit autour du Soleil, la Lune la suit, en tournant toujours autour d'elle ; et si elle tourne autour du Soleil, ce n'est que pour ne point quitter la Terre.`,
        conclusion:"La métaphore du ballet et le ton héroïque font de Copernic un réformateur romanesque autant que scientifique.",
        conclusionItems:[{label:"Héroïsation",texte:"Copernic est présenté comme un fondateur, un révolutionnaire solitaire."},{label:"Métaphore",texte:"Le vocabulaire du ballet traduit la mécanique céleste en termes sensibles."}],
        order:2 },
      { id:"f-t3", titre:"« Amour et astronomie » — Cinquième Soir",
        intro:"La Marquise interroge Fontenelle sur la solidité de son système. Il lui répond par une analogie savoureuse entre le raisonnement mathématique et les stratégies de l'amour.",
        contexte:"Discussion sur la pluralité des mondes — Cinquième Soir.", enjeu:"Du vertige métaphysique à la sérénité rationnelle — galanterie et science mêlées.",
        problematique:"Comment Fontenelle transforme-t-il le vertige de l'infini en un sentiment agréable et stimulant ?",
        texteIntegral:`Les autres mondes vous rendent celui-ci petit, mais ils ne vous gâtent point de beaux yeux, ou une belle bouche, cela vaut toujours son prix en dépit de tous les mondes possibles.\nC'est une étrange chose que l'amour, répondit-elle, en riant ; il se sauve de tout, et il n'y a point de système qui lui puisse faire de mal. Mais aussi parlez-moi franchement, votre système est-il bien vrai ? Ne me déguisez rien, je vous garderai le secret. Il me semble qu'il n'est appuyé que sur une petite convenance bien légère. Une étoile fixe est lumineuse d'elle-même comme le Soleil, par conséquent il faut qu'elle soit comme le Soleil le centre et l'âme d'un monde, et qu'elle ait ses planètes qui tournent autour d'elle. Cela est-il d'une nécessité bien absolue ? Ecoutez, Madame, répondis-je, puisque nous sommes en humeur de mêler toujours des folies de galanterie à nos discours les plus sérieux, les raisonnemens de mathématique sont faits comme l'amour. Vous ne sauriez accorder si peu de chose à un amant que bientôt après il ne faille lui en accorder davantage, et à la fin cela va loin. De même accordez à un mathématicien le moindre principe, il va vous en tirer une conséquence, qu'il faudra que vous lui accordiez aussi, et de cette conséquence encore une autre ; et, malgré vous-même, il vous mène si loin, qu'à peine le pouvez vous croire. Ces deux sortes de gens-là prennent toujours plus qu'on ne leur donne. Vous convenez que, quand deux choses sont semblables en tout ce qui me paraît, je les puis croire aussi semblables en ce qui ne me paraît point, s'il n'y a rien d'ailleurs qui m'en empêche. De là j'ai tiré que la Lune étoit habitée, parce qu'elle ressemble à la Terre, les autres planètes parce qu'elles ressemblent à la Lune. Je trouve que les étoiles fixes ressemblent à notre Soleil, je leur attribue tout ce qu'il a. Vous êtes engagée trop avant pour pouvoir reculer, il faut franchir le pas de bonne grâce. Mais, dit-elle, sur le pied de cette ressemblance que vous mettez entre les étoiles fixes et notre soleil, il faut que les gens d'un autre grand tourbillon ne le voient que comme une petite étoile fixe, qui se montre à eux seulement pendant leurs nuits.`,
        conclusion:"La métaphore de l'Opéra synthétise la philosophie de Fontenelle : la nature est un spectacle à déchiffrer, non une vérité révélée.",
        conclusionItems:[{label:"Métaphore centrale",texte:"L'Opéra représente l'Univers : spectacle, machination, mystère."},{label:"Épistémologie",texte:"Fontenelle distingue l'apparence (le spectacle) et les lois cachées (la machinerie)."}],
        order:3 }
    ],
    rimbaud: [
      { id:"r-t1", titre:"« Les Effarés »",
        intro:"Des enfants pauvres collés à la fenêtre d'une boulangerie, fascinés par la chaleur du pain. Rimbaud dénonce l'indifférence sociale du Second Empire.",
        contexte:"Dénonciation sociale sous le Second Empire.", enjeu:"Réquisitoire contre l'indifférence sociale.",
        problematique:"En quoi ce poème est-il à la fois une peinture réaliste de la misère et un réquisitoire social ?",
        texteIntegral:`Noirs dans la neige et dans la brume,\nAu grand soupirail qui s'allume,\n   Leurs culs en rond\n\nÀ genoux, cinq petits, — misère ! —\nRegardent le boulanger faire 5\n   Le lourd pain blond…\n\nIls voient le fort bras blanc qui tourne\nLa pâte grise, et qui l'enfourne\n   Dans un trou clair.\n\nIls écoutent le bon pain cuire. 10\nLe boulanger au gras sourire\n   Chante un vieil air.\n\nIls sont blottis, pas un ne bouge,\nAu souffle du soupirail rouge,\n   Chaud comme un sein. 15\n\nEt quand, pendant que minuit sonne,\nFaçonné, pétillant et jaune,\n   On sort le pain,\n\nQuand, sous les poutres enfumées,\nChantent les croûtes parfumées, 20\n   Et les grillons,\n\nQuand ce trou chaud souffle la vie\nIls ont leur âme si ravie\n   Sous leurs haillons,\n\nIls se ressentent si bien vivre, 25\nLes pauvres petits pleins de givre !\n   — Qu'ils sont là, tous,\n\nCollant leurs petits museaux roses\nAu grillage, chantant des choses,\n   Entre les trous,\n\nMais bien bas, — comme une prière… 30\nRepliés vers cette lumière\n   Du ciel rouvert,\n\nSi fort, qu'ils crèvent leur culotte,\nEt que leur lange blanc tremblotte\n   Au vent d'hiver… 35`,
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
        order:2 },
      { id:"r-t3", titre:"« Au Cabaret-Vert, cinq heures du soir »",
        intro:"Rimbaud, en fugue sur les routes de Belgique, s'arrête dans une auberge et savoure un moment de repos et de plaisir simple. Un sonnet solaire qui célèbre la liberté du vagabond.",
        contexte:"Poème écrit en octobre 1870, durant la fugue de Rimbaud vers la Belgique.", enjeu:"Célébration hédoniste de la liberté et du plaisir simple face à la misère du monde.",
        problematique:"En quoi ce sonnet, apparemment anodin, est-il une célébration de la liberté et de la sensation ?",
        texteIntegral:`Depuis huit jours, j'avais déchiré mes bottines\nAux cailloux des chemins. J'entrais à Charleroi,\n— Au Cabaret-Vert : je demandai des tartines\nDe beurre et du jambon qui fût à moitié froid.\n\nBienheureux, j'allongeai les jambes sous la table 5\nVerte : je contemplai les sujets très naïfs\nDe la tapisserie. — Et ce fut adorable,\nQuand la fille aux tétons énormes, aux yeux vifs,\n\n— Celle-là, ce n'est pas un baiser qui l'épeure ! —\nRieuse, m'apporta des tartines de beurre,    10\nDu jambon tiède, dans un plat colorié,\n\nDu jambon rose et blanc parfumé d'une gousse\nD'ail, — et m'emplit la chope immense, avec sa mousse\nQue dorait un rayon de soleil arriéré.`,
        conclusion:"Ce sonnet subvertit la forme classique pour en faire un hymne à la sensation, à la liberté du vagabond et au plaisir des choses simples.",
        conclusionItems:[{label:"Liberté",texte:"Le vagabondage de Rimbaud comme affirmation d'une liberté totale."},{label:"Sensations",texte:"La profusion sensorielle (couleurs, odeurs, saveurs) célèbre la joie de vivre."},{label:"Subversion",texte:"Le sonnet, forme noble, mis au service d'un sujet trivial et hédoniste."}],
        order:3 }
    ]
  },
  analyses: {
    "c-t1": [
      { id:"c-t1-mvt1", mouvement:1, titre:"La rupture avec le passé", vers:"v. 1-4",
        procedes:[
          {id:"p-c1m1-1",num:1,citation:"quitté la robe pour l'épée",ref:"(v. 1)",procede:"double métonymie + locution temporelle",analyse:`La locution temporelle (« À la fin ») souligne le soulagement. La <span class="procede-type">double métonymie</span> (« la robe » pour les études/la loi, « l'épée » pour la noblesse) symbolise immédiatement son changement radical de classe sociale.`},
          {id:"p-c1m1-2",num:2,citation:"l'attente où j'ai vécu n'a point été trompée",ref:"(v. 2)",procede:"litote",analyse:`La <span class="procede-type">litote</span> (« n'a point été trompée ») insiste sur la réussite immédiate de sa transition sociale, tandis que le lexique de l'illusion (« trompée ») amorce le thème du mensonge.`},
          {id:"p-c1m1-3",num:3,citation:"mon père a consenti que je suive mon choix",ref:"(v. 3)",procede:"champ lexical du consentement",analyse:`Le <span class="procede-type">champ lexical du consentement</span> montre que l'autorité paternelle valide cette émancipation, la rendant légale.`},
          {id:"p-c1m1-4",num:4,citation:"banqueroute à ce fatras de lois",ref:"(v. 4)",procede:"métaphore financière + terme péjoratif",analyse:`La <span class="procede-type">métaphore financière</span> (« banqueroute ») et le <span class="procede-type">terme péjoratif</span> (« fatras ») rejettent son passé d'étudiant avec un profond mépris.`}
        ]},
      { id:"c-t1-mvt2", mouvement:2, titre:"Le théâtre des Tuileries", vers:"v. 5-11",
        procedes:[
          {id:"p-c1m2-1",num:1,citation:"dedans les Tuileries",ref:"(v. 5)",procede:"didascalie interne",analyse:`La <span class="procede-type">didascalie interne</span> ancre l'action dans un lieu mondain de parade.`},
          {id:"p-c1m2-2",num:2,citation:"le pays du beau monde et des galanteries",ref:"(v. 6)",procede:"périphrase élogieuse",analyse:`La <span class="procede-type">périphrase élogieuse</span> définit le nouveau système de valeurs de Dorante : l'apparence et la séduction.`},
          {id:"p-c1m2-3",num:3,citation:"dis-moi, me trouves-tu bien fait en cavalier ?",ref:"(v. 7)",procede:"interrogation directe",analyse:`L'<span class="procede-type">interrogation directe</span> trahit le narcissisme de Dorante et son besoin de validation.`},
          {id:"p-c1m2-4",num:4,citation:"Ne vois-tu rien en moi qui sente l'écolier ?",ref:"(v. 8)",procede:"phrase interro-négative + antithèse",analyse:`La <span class="procede-type">phrase interro-négative</span> et l'<span class="procede-type">antithèse</span> (cavalier / écolier) révèlent son insécurité face à son ancienne identité.`},
          {id:"p-c1m2-5",num:5,citation:"aux royaumes du code / on apprenne à se faire un visage à la mode",ref:"(v. 9-10)",procede:"allégorie + métaphore de fabrication",analyse:`L'<span class="procede-type">allégorie</span> austère de l'université s'oppose à la <span class="procede-type">métaphore de la fabrication</span> du visage, dévoilant une identité conçue comme un simple masque.`},
          {id:"p-c1m2-6",num:6,citation:"j'ai lieu d'appréhender...",ref:"(v. 11)",procede:"aposiopèse",analyse:`L'<span class="procede-type">aposiopèse</span> (interruption) par le valet donne un rythme vif à l'échange comique.`}
        ]},
      { id:"c-t1-mvt3", mouvement:3, titre:"La flatterie de Cliton", vers:"v. 12-16",
        procedes:[
          {id:"p-c1m3-1",num:1,citation:"vous ferez en une heure ici mille jaloux",ref:"(v. 12)",procede:"hyperbole chiffrée",analyse:`L'<span class="procede-type">hyperbole chiffrée</span> de Cliton flatte l'ego de son maître.`},
          {id:"p-c1m3-2",num:2,citation:"Ce visage et ce port n'ont point l'air de l'école",ref:"(v. 13)",procede:"parallélisme",analyse:`Le <span class="procede-type">parallélisme</span> souligne la transformation purement physique.`},
          {id:"p-c1m3-3",num:3,citation:"jamais comme vous on ne peignit Bartole",ref:"(v. 14)",procede:"référence culturelle comique",analyse:`La <span class="procede-type">référence culturelle comique</span> (Bartole, vieux juriste) crée un contraste par l'absurde avec la beauté de Dorante.`},
          {id:"p-c1m3-4",num:4,citation:"je prévois du malheur pour beaucoup de maris",ref:"(v. 15)",procede:"prolepse dramatique",analyse:`Cette <span class="procede-type">prolepse dramatique</span> annonce les intrigues amoureuses à venir.`},
          {id:"p-c1m3-5",num:5,citation:"Mais que vous semble encor maintenant de Paris ?",ref:"(v. 16)",procede:"question de relance",analyse:`La <span class="procede-type">question de relance</span> permet à Dorante d'exposer sa philosophie.`}
        ]},
      { id:"c-t1-mvt4", mouvement:4, titre:"Le projet galant", vers:"v. 17-21",
        procedes:[
          {id:"p-c1m4-1",num:1,citation:"J'en trouve l'air bien doux, et cette loi bien rude",ref:"(v. 17)",procede:"parallélisme antithétique",analyse:`Le <span class="procede-type">parallélisme antithétique</span> justifie son choix moral du plaisir contre la contrainte.`},
          {id:"p-c1m4-2",num:2,citation:"banni sous prétexte d'étude",ref:"(v. 18)",procede:"lexique de l'exil + ironie",analyse:`Le lexique dramatique de l'<span class="procede-type">exil</span> (« banni ») et le nom ironique « prétexte » dévaluent totalement l'éducation.`},
          {id:"p-c1m4-3",num:3,citation:"divertir / ayant eu le bonheur de n'en jamais sortir",ref:"(v. 19-20)",procede:"champ lexical de la jouissance",analyse:`Le <span class="procede-type">champ lexical de la jouissance</span> montre la complicité hédoniste entre le maître et le valet.`},
          {id:"p-c1m4-4",num:4,citation:"dis-moi comme en ce lieu l'on gouverne les dames",ref:"(v. 21)",procede:"métaphore militaire et politique",analyse:`La <span class="procede-type">métaphore militaire et politique</span> (« gouverne ») résume l'amour à une stratégie de conquête.`}
        ]}
    ],
    "c-t2": [
      { id:"c-t2-mvt1", mouvement:1, titre:"L'obstination spectaculaire", vers:"v. 963-967",
        procedes:[
          {id:"p-c2m1-1",num:1,citation:"Impossible ! Ah ! Pour vous",ref:"(v. 963)",procede:"cascade d'exclamations",analyse:`La <span class="procede-type">cascade d'exclamations</span> feint une surprise totale pour esquiver et gagner du temps.`},
          {id:"p-c2m1-2",num:2,citation:"je pourrai tout, madame, en tous lieux, contre tous.",ref:"(v. 964)",procede:"hyperbole galante + allitération en [t]",analyse:`L'<span class="procede-type">hyperbole galante</span> et l'<span class="procede-type">allitération en [t]</span> constituent une feinte héroïque pour détourner l'accusation vers le sentimentalisme.`},
          {id:"p-c2m1-3",num:3,citation:"Jusqu'à vous marier, quand je sais que vous l'êtes ?",ref:"(v. 965)",procede:"question accusatrice",analyse:`La <span class="procede-type">question accusatrice</span> de Clarice bloque la parade de Dorante.`},
          {id:"p-c2m1-4",num:4,citation:"Moi, marié ! Ce sont pièces qu'on vous a faites",ref:"(v. 966)",procede:"apostrophe à soi-même + métaphore théâtrale",analyse:`L'<span class="procede-type">apostrophe à soi-même</span> renforce l'aplomb du menteur, tandis que la <span class="procede-type">métaphore théâtrale</span> (« pièces ») accuse autrui de faire des mises en scène.`}
        ]},
      { id:"c-t2-mvt2", mouvement:2, titre:"Le menteur démasqué", vers:"v. 968-971",
        procedes:[
          {id:"p-c2m2-1",num:1,citation:"Est-il un plus grand fourbe ? / Il ne sait que mentir.",ref:"(v. 968)",procede:"question rhétorique + négation restrictive",analyse:`La <span class="procede-type">question rhétorique</span> de Clarice et la <span class="procede-type">négation restrictive</span> de Lucrèce encerclent Dorante et réduisent son identité à son vice.`},
          {id:"p-c2m2-2",num:2,citation:"Je ne le fus jamais",ref:"(v. 969)",procede:"négation absolue au passé simple",analyse:`La <span class="procede-type">négation absolue</span> conjuguée au passé simple montre une audace suicidaire face à l'évidence.`},
          {id:"p-c2m2-3",num:3,citation:"on pense...",ref:"(v. 970)",procede:"aposiopèse",analyse:`L'<span class="procede-type">aposiopèse</span> témoigne de la perte de contrôle rhétorique du héros, qui bégaie.`},
          {id:"p-c2m2-4",num:4,citation:"Et vous pensez encor que je vous croie ?",ref:"(v. 970)",procede:"interrogation sarcastique",analyse:`L'<span class="procede-type">interrogation sarcastique</span> de Clarice détruit le masque galant.`}
        ]},
      { id:"c-t2-mvt3", mouvement:3, titre:"La surenchère des serments", vers:"v. 972-983",
        procedes:[
          {id:"p-c2m3-1",num:1,citation:"Que le foudre à vos yeux m'écrase, si je mens !",ref:"(v. 972)",procede:"invocation mythologique",analyse:`L'<span class="procede-type">invocation mythologique</span> relève du registre tragique, détourné ici pour un effet comique de disproportion.`},
          {id:"p-c2m3-2",num:2,citation:"Un menteur est toujours prodigue de serments.",ref:"(v. 973)",procede:"maxime morale",analyse:`La <span class="procede-type">maxime morale</span> de Clarice neutralise immédiatement le sortilège de Dorante.`},
          {id:"p-c2m3-3",num:3,citation:"cessez d'être en balance",ref:"(v. 976)",procede:"métaphore de la pesée",analyse:`La <span class="procede-type">métaphore de la pesée</span> traduit la volonté pathétique de Dorante de reprendre l'ascendant psychologique.`},
          {id:"p-c2m3-4",num:4,citation:"tant son effronterie / avec naïveté pousse une menterie.",ref:"(v. 978-979)",procede:"oxymore",analyse:`Cet <span class="procede-type">oxymore</span> (effronterie / naïveté) est l'essence même du génie comique de Dorante.`},
          {id:"p-c2m3-5",num:5,citation:"agréez que demain / en qualité d'époux je vous donne la main.",ref:"(v. 980-981)",procede:"lexique formel de l'engagement",analyse:`Le <span class="procede-type">lexique formel de l'engagement</span> montre le menteur cherchant à écraser un vieux mensonge par un nouveau.`},
          {id:"p-c2m3-6",num:6,citation:"Eh ! Vous la donneriez en un jour à deux mille.",ref:"(v. 982)",procede:"hyperbole sarcastique",analyse:`L'<span class="procede-type">hyperbole sarcastique</span> de Clarice scelle l'échec de Dorante.`}
        ]},
      { id:"c-t2-mvt4", mouvement:4, titre:"Le gouffre entre le mythe et la réalité", vers:"v. 984-994",
        procedes:[
          {id:"p-c2m4-1",num:1,citation:"en crédit si grand, que j'en crains les jaloux.",ref:"(v. 984-985)",procede:"autoglorification",analyse:`Cette <span class="procede-type">autoglorification</span> illustre le déni de réalité total de Dorante.`},
          {id:"p-c2m4-2",num:2,citation:"un grand foudre de guerre",ref:"(v. 986-987)",procede:"anaphore + reprise ironique du vocabulaire épique",analyse:`L'<span class="procede-type">anaphore</span> et la <span class="procede-type">reprise ironique du vocabulaire épique</span> ridiculisent Dorante par la bouche même de Clarice.`},
          {id:"p-c2m4-3",num:3,citation:"n'en a vu qu'à coups d'écritoire ou de verre",ref:"(v. 988)",procede:"antithèse triviale",analyse:`L'<span class="procede-type">antithèse triviale</span> rabaisse l'héroïsme au rang d'ivrognerie ou d'études ennuyeuses.`},
          {id:"p-c2m4-4",num:4,citation:"qui vint hier [...] depuis une année il fait ici sa cour",ref:"(v. 989-990)",procede:"antithèse temporelle",analyse:`L'<span class="procede-type">antithèse temporelle</span> expose mathématiquement le mensonge.`},
          {id:"p-c2m4-5",num:5,citation:"festin, musique [...] dans son lit passée en tout silence",ref:"(v. 991-992)",procede:"antithèse situationnelle",analyse:`La violente <span class="procede-type">antithèse situationnelle</span> confronte l'hallucination mondaine à la réalité solitaire.`},
          {id:"p-c2m4-6",num:6,citation:"s'en dédit / sa méthode est jolie à se mettre en crédit !",ref:"(v. 993-994)",procede:"paronomase + antiphrase exclamative",analyse:`La <span class="procede-type">paronomase</span> (dit/dédit) et l'<span class="procede-type">antiphrase exclamative</span> valident le triomphe de Clarice et la faillite sociale de Dorante.`}
        ]}
    ],
    "c-t3": [
      { id:"c-t3-mvt1", mouvement:1, titre:"La révélation exaspérée", vers:"v. 1713-1717",
        procedes:[
          {id:"p-c3m1-1",num:1,citation:"Mais enfin vous n'avez que mépris pour Clarice ?",ref:"(v. 1713)",procede:"négation restrictive + interrogation",analyse:`La <span class="procede-type">négation restrictive</span> et l'interrogation soulignent la fin des illusions de la jeune femme.`},
          {id:"p-c3m1-2",num:2,citation:"Mais enfin vous savez le nœud de l'artifice",ref:"(v. 1714)",procede:"anaphore + métaphore dramatique",analyse:`L'<span class="procede-type">anaphore</span> de « Mais enfin » et la <span class="procede-type">métaphore dramatique</span> (« nœud ») explicitent la fin de la manipulation scénaristique.`},
          {id:"p-c3m1-3",num:3,citation:"Je ne sais plus moi-même... où j'en suis.",ref:"(v. 1716)",procede:"aveu de confusion",analyse:`L'<span class="procede-type">aveu de confusion</span> de Clarice montre l'épuisement mental causé par les mensonges répétés de Dorante.`},
          {id:"p-c3m1-4",num:4,citation:"Lucrèce ! Que dit-elle ?",ref:"(v. 1717)",procede:"stichomythie",analyse:`La <span class="procede-type">stichomythie</span> donne une impulsion nerveuse qui accélère le rythme vers l'éclatement de la vérité.`}
        ]},
      { id:"c-t3-mvt2", mouvement:2, titre:"La lucidité brutale de Cliton", vers:"v. 1718-1722",
        procedes:[
          {id:"p-c3m2-1",num:1,citation:"Vous en tenez, monsieur",ref:"(v. 1718)",procede:"expression familière",analyse:`L'<span class="procede-type">expression familière</span> du valet tranche avec le vernis aristocratique et ramène Dorante au réel.`},
          {id:"p-c3m2-2",num:2,citation:"et vous auriez perdu si vous aviez gagé.",ref:"(v. 1720)",procede:"champ lexical du jeu",analyse:`Le <span class="procede-type">champ lexical du jeu</span> définit la vérité de Dorante comme une simple loterie, réduisant ses mensonges à un pari hasardeux.`},
          {id:"p-c3m2-3",num:3,citation:"Cette nuit à la voix j'ai cru la reconnoître.",ref:"(v. 1721)",procede:"lexique de la sensorialité trompeuse",analyse:`La justification repose sur le <span class="procede-type">lexique de la sensorialité trompeuse</span> (la nuit, la voix) — Dorante se donne une excuse commode.`},
          {id:"p-c3m2-4",num:4,citation:"Clarice sous son nom parloit à sa fenêtre",ref:"(v. 1722)",procede:"explication factuelle",analyse:`Cliton produit l'<span class="procede-type">explication factuelle</span> qui résout objectivement le quiproquo du balcon.`}
        ]},
      { id:"c-t3-mvt3", mouvement:3, titre:"Le rebond cynique", vers:"v. 1725-1731",
        procedes:[
          {id:"p-c3m3-1",num:1,citation:"Bonne bouche, j'en tiens ; mais l'autre la vaut bien",ref:"(v. 1725)",procede:"évaluation marchande cynique",analyse:`L'<span class="procede-type">évaluation marchande cynique</span> de Dorante prouve son inconstance absolue : une femme en vaut une autre.`},
          {id:"p-c3m3-2",num:2,citation:"mon cœur déjà penchoit où mon erreur le jette.",ref:"(v. 1726)",procede:"personnification + rationalisation a posteriori",analyse:`La <span class="procede-type">personnification du cœur</span> et la <span class="procede-type">rationalisation a posteriori</span> transforment génialement sa stupidité en fatalité amoureuse.`},
          {id:"p-c3m3-3",num:3,citation:"jouer un nouveau jeu.",ref:"(v. 1728)",procede:"polyptote",analyse:`Le <span class="procede-type">polyptote</span> confirme que la vie sentimentale n'est pour Dorante qu'une scène de théâtre permanente.`},
          {id:"p-c3m3-4",num:4,citation:"Sans changer de discours changeons de batterie.",ref:"(v. 1729)",procede:"métaphore de l'artillerie militaire",analyse:`La <span class="procede-type">métaphore de l'artillerie militaire</span> montre que le mensonge est une munition recyclable à l'infini.`},
          {id:"p-c3m3-5",num:5,citation:"Voyons le dernier point de son effronterie",ref:"(v. 1730)",procede:"hyperbole spectaculaire",analyse:`L'<span class="procede-type">hyperbole spectaculaire</span> de Lucrèce transforme la fin de la pièce en exhibition théâtrale.`}
        ]}
    ],
    "f-t1": [
      { id:"f-t1-mvt1", mouvement:1, titre:"Le pacte de lecture", vers:"l. 1-6",
        procedes:[
          {id:"p-f1m1-1",num:1,citation:"Vous voulez, Monsieur, que je vous rende un compte exact",ref:"(l. 1)",procede:"registre épistolaire",analyse:`Le <span class="procede-type">registre épistolaire</span> ancre la fiction dans une vérité immédiate et intime.`},
          {id:"p-f1m1-2",num:2,citation:"ce qu'il y a de pis, un livre de philosophie",ref:"(l. 3)",procede:"autodérision",analyse:`L'<span class="procede-type">autodérision</span> désamorce les craintes du lecteur mondain face au jargon scientifique.`},
          {id:"p-f1m1-3",num:3,citation:"fêtes... jeu ou de chasse / [...] planètes, mondes, tourbillons",ref:"(l. 4-5)",procede:"antithèse + accumulation cosmique",analyse:`L'<span class="procede-type">antithèse</span> et l'<span class="procede-type">accumulation cosmique</span> remplacent les plaisirs terrestres par un horizon merveilleux.`},
          {id:"p-f1m1-4",num:4,citation:"Heureusement vous êtes philosophe",ref:"(l. 6)",procede:"captatio benevolentiae",analyse:`La <span class="procede-type">captatio benevolentiae</span> flatte l'esprit du lecteur et l'invite à se sentir à la hauteur du sujet.`}
        ]},
      { id:"f-t1-mvt2", mouvement:2, titre:"La Marquise, trophée philosophique", vers:"l. 7-14",
        procedes:[
          {id:"p-f1m2-1",num:1,citation:"attiré Madame la Marquise dans le parti de la philosophie.",ref:"(l. 7-8)",procede:"métaphore de l'engagement politique",analyse:`La <span class="procede-type">métaphore de l'engagement politique ou militaire</span> transforme la leçon en conquête intellectuelle.`},
          {id:"p-f1m2-2",num:2,citation:"la beauté et la jeunesse sont toujours des choses d'un grand prix.",ref:"(l. 9)",procede:"lexique de l'estimation",analyse:`Le <span class="procede-type">lexique de l'estimation</span> montre que la science s'orne des atours de la séduction mondaine.`},
          {id:"p-f1m2-3",num:3,citation:"si la sagesse elle-même voulait se présenter... sous une figure",ref:"(l. 10-12)",procede:"allégorie de la Sagesse",analyse:`L'<span class="procede-type">allégorie de la Sagesse</span> incarnée par la Marquise charnalise l'abstraction philosophique.`},
          {id:"p-f1m2-4",num:4,citation:"tout le monde courrait après la sagesse.",ref:"(l. 14)",procede:"hyperbole",analyse:`L'<span class="procede-type">hyperbole</span> souligne l'efficacité redoutable de cette méthode d'enseignement par la séduction.`}
        ]},
      { id:"f-t1-mvt3", mouvement:3, titre:"L'éloge d'un esprit moderne", vers:"l. 14-20",
        procedes:[
          {id:"p-f1m3-1",num:1,citation:"répéter ce qu'elle dit de la manière dont elle l'a dit.",ref:"(l. 16)",procede:"parallélisme",analyse:`Le <span class="procede-type">parallélisme</span> prouve que la forme de la pensée compte autant que le fond.`},
          {id:"p-f1m3-2",num:2,citation:"cette vivacité d'intelligence",ref:"(l. 17)",procede:"éloge explicite",analyse:`L'<span class="procede-type">éloge explicite</span> définit l'intuition vive comme supérieure à l'érudition classique.`},
          {id:"p-f1m3-3",num:3,citation:"Qu'est-ce qui lui manque ? D'avoir ouvert les yeux sur des livres",ref:"(l. 18-19)",procede:"question rhétorique paradoxale",analyse:`La <span class="procede-type">question rhétorique paradoxale</span> minimise l'enseignement classique et valorise l'intelligence naturelle.`},
          {id:"p-f1m3-4",num:4,citation:"à qui je refuserais... le nom de savants.",ref:"(l. 20)",procede:"paradoxe",analyse:`L'emploi du <span class="procede-type">paradoxe</span> permet de critiquer ouvertement les pédants de l'université.`}
        ]},
      { id:"f-t1-mvt4", mouvement:4, titre:"Le cadre narratif des entretiens", vers:"l. 21-27",
        procedes:[
          {id:"p-f1m4-1",num:1,citation:"je serais en droit de vous décrire le château",ref:"(l. 22)",procede:"prétérition",analyse:`La <span class="procede-type">prétérition</span> évacue la description inutile pour valoriser le débat d'idées.`},
          {id:"p-f1m4-2",num:2,citation:"je n'y trouvai point de compagnie, et j'en fus fort aise.",ref:"(l. 24)",procede:"insistance sur l'intimité",analyse:`L'<span class="procede-type">insistance sur l'intimité</span> installe le climat de la confidence amoureuse, propice à la transmission du savoir.`},
          {id:"p-f1m4-3",num:3,citation:"épuiser les nouvelles de Paris",ref:"(l. 25-26)",procede:"hyperbole",analyse:`L'<span class="procede-type">hyperbole</span> montre la transition nécessaire entre le bavardage vain et la science.`},
          {id:"p-f1m4-4",num:4,citation:"Je vous les diviserai par soirs",ref:"(l. 27)",procede:"annonce structurante",analyse:`L'<span class="procede-type">annonce de la structuration narrative</span> promet une progression typique des contes, rendant la science désirable.`}
        ]}
    ],
    "f-t2": [
      { id:"f-t2-mvt1", mouvement:1, titre:"La geste héroïque de Copernic", vers:"l. 1-12",
        procedes:[
          {id:"p-f2m1-1",num:1,citation:"qui fait main basse",ref:"(l. 2)",procede:"métaphore guerrière",analyse:`La <span class="procede-type">métaphore guerrière</span> présente Copernic comme le destructeur triomphant des erreurs antiques.`},
          {id:"p-f2m1-2",num:2,citation:"Saisi d'une noble fureur d'astronome",ref:"(l. 4)",procede:"oxymore",analyse:`L'<span class="procede-type">oxymore</span> élève la passion scientifique froide au rang de fureur divine ou épique.`},
          {id:"p-f2m1-3",num:3,citation:"il prend la Terre et l'envoie bien loin",ref:"(l. 4-5)",procede:"personnification désinvolte",analyse:`La <span class="procede-type">personnification désinvolte</span> dégrade la Terre, la traitant comme un vulgaire caillou que l'on jette.`},
          {id:"p-f2m1-4",num:4,citation:"pour la punir du long repos qu'elle s'étoit attribué",ref:"(l. 8-9)",procede:"personnification moralisatrice",analyse:`La <span class="procede-type">personnification moralisatrice</span> justifie la mécanique gravitationnelle par une punition humoristique.`}
        ]},
      { id:"f-t2-mvt2", mouvement:2, titre:"La résistance du bon sens", vers:"l. 12-16",
        procedes:[
          {id:"p-f2m2-1",num:1,citation:"Attendez un peu, dit la Marquise",ref:"(l. 13)",procede:"injonction à l'impératif",analyse:`L'<span class="procede-type">injonction à l'impératif</span> incarne la résistance naturelle du bon sens face au lyrisme scientifique.`},
          {id:"p-f2m2-2",num:2,citation:"expliquer les choses si pompeusement",ref:"(l. 14)",procede:"critique méta-discursive",analyse:`La <span class="procede-type">critique méta-discursive</span> de l'élève condamne le lyrisme vide et contraint le narrateur à la rigueur.`},
          {id:"p-f2m2-3",num:3,citation:"je ne crois pas les avoir entendues.",ref:"(l. 15)",procede:"aveu d'incompréhension",analyse:`Cet <span class="procede-type">aveu d'incompréhension</span> contraint le narrateur à la stricte pédagogie.`},
          {id:"p-f2m2-4",num:4,citation:"immobile, après lui, qu'est-ce qui suit ?",ref:"(l. 16)",procede:"interrogation spatiale",analyse:`L'<span class="procede-type">interrogation spatiale</span> recadre le discours sur des bases géométriques claires.`}
        ]},
      { id:"f-t2-mvt3", mouvement:3, titre:"La cartographie du système solaire", vers:"l. 15-21",
        procedes:[
          {id:"p-f2m3-1",num:1,citation:"C'est Mercure... Au-dessus... Ensuite vient la Terre... Enfin suivent Mars, Jupiter",ref:"(l. 17-20)",procede:"énumération spatiale ordonnée",analyse:`L'<span class="procede-type">énumération spatiale ordonnée</span> construit une carte visuelle et rassurante du cosmos.`},
          {id:"p-f2m3-2",num:2,citation:"le plus grand cercle de tous",ref:"(l. 21)",procede:"superlatif",analyse:`L'utilisation du <span class="procede-type">superlatif</span> pour Saturne exprime l'immensité tout en la gardant mesurable.`},
          {id:"p-f2m3-3",num:3,citation:"Et la Lune, vous l'oubliez",ref:"(l. 22)",procede:"interruption de l'élève",analyse:`L'<span class="procede-type">interruption de l'élève</span> prouve la réussite de la leçon : la Marquise détecte elle-même l'anomalie du modèle.`}
        ]},
      { id:"f-t2-mvt4", mouvement:4, titre:"L'orbite affective de la Lune", vers:"l. 21-26",
        procedes:[
          {id:"p-f2m4-1",num:1,citation:"Je la retrouverai bien",ref:"(l. 23)",procede:"ironie désinvolte",analyse:`L'<span class="procede-type">ironie désinvolte</span> dédramatise la complexité de l'univers.`},
          {id:"p-f2m4-2",num:2,citation:"ne l'abandonne point... la suit",ref:"(l. 24)",procede:"personnification affective intense",analyse:`L'<span class="procede-type">personnification affective intense</span> transforme l'attraction physique en fidélité conjugale.`},
          {id:"p-f2m4-3",num:3,citation:"ce n'est que pour ne point quitter la Terre.",ref:"(l. 25-26)",procede:"explication finaliste",analyse:`Cette <span class="procede-type">explication finaliste</span> donne un but émotionnel au mouvement mécanique, le rendant compréhensible pour une mondaine.`}
        ]}
    ],
    "f-t3": [
      { id:"f-t3-mvt1", mouvement:1, titre:"Le flirt protecteur", vers:"l. 1-4",
        procedes:[
          {id:"p-f3m1-1",num:1,citation:"ne vous gâtent point de beaux yeux, ou une belle bouche",ref:"(l. 1)",procede:"champ lexical de la galanterie",analyse:`Le <span class="procede-type">champ lexical de la galanterie</span> ancre le discours abstrait dans la corporalité rassurante de la beauté.`},
          {id:"p-f3m1-2",num:2,citation:"en dépit de tous les mondes possibles.",ref:"(l. 2)",procede:"hyperbole vertigineuse",analyse:`Cette <span class="procede-type">hyperbole vertigineuse</span> exalte la valeur de l'individu face au vide de l'univers infini.`},
          {id:"p-f3m1-3",num:3,citation:"C'est une étrange chose que l'amour",ref:"(l. 3)",procede:"sentence philosophique",analyse:`L'emploi de la <span class="procede-type">sentence philosophique</span> prouve l'autonomie intellectuelle de la Marquise.`},
          {id:"p-f3m1-4",num:4,citation:"répondit-elle, en riant",ref:"(l. 3)",procede:"complément de manière",analyse:`Le <span class="procede-type">complément de manière</span> rappelle que le savoir est indissociable du plaisir.`}
        ]},
      { id:"f-t3-mvt2", mouvement:2, titre:"La bascule épistémologique", vers:"l. 4-10",
        procedes:[
          {id:"p-f3m2-1",num:1,citation:"Ne me déguisez rien, je vous garderai le secret.",ref:"(l. 5)",procede:"ton de la confidence",analyse:`Le <span class="procede-type">ton de la confidence</span> masque une véritable exigence d'honnêteté scientifique.`},
          {id:"p-f3m2-2",num:2,citation:"appuyé que sur une petite convenance bien légère.",ref:"(l. 6-7)",procede:"euphémisme",analyse:`Cet <span class="procede-type">euphémisme</span> montre que la Marquise perçoit la fragilité des hypothèses induites.`},
          {id:"p-f3m2-3",num:3,citation:"Cela est-il d'une nécessité bien absolue ?",ref:"(l. 10)",procede:"interrogation directe",analyse:`L'<span class="procede-type">interrogation directe</span> confronte le savant à l'exigence de preuve.`}
        ]},
      { id:"f-t3-mvt3", mouvement:3, titre:"L'analogie séductrice", vers:"l. 8-19",
        procedes:[
          {id:"p-f3m3-1",num:1,citation:"mêler toujours des folies de galanterie à nos discours",ref:"(l. 11)",procede:"aveu de méthode",analyse:`L'<span class="procede-type">aveu de méthode</span> justifie ouvertement l'esthétique galante du livre.`},
          {id:"p-f3m3-2",num:2,citation:"les raisonnemens de mathématique sont faits comme l'amour.",ref:"(l. 12-13)",procede:"immense comparaison",analyse:`Cette <span class="procede-type">immense comparaison</span> affirme que la logique contraint l'esprit comme la passion contraint le cœur.`},
          {id:"p-f3m3-3",num:3,citation:"accorder si peu... lui en accorder davantage",ref:"(l. 14)",procede:"parallélisme + gradation",analyse:`Le <span class="procede-type">parallélisme</span> et la <span class="procede-type">gradation</span> modélisent l'engrenage fatal de l'induction mathématique.`},
          {id:"p-f3m3-4",num:4,citation:"malgré vous-même, il vous mène si loin",ref:"(l. 16-17)",procede:"personnification du mathématicien/amant",analyse:`La <span class="procede-type">personnification du mathématicien/amant</span> souligne la toute-puissance du raisonnement en chaîne.`},
          {id:"p-f3m3-5",num:5,citation:"Ces deux sortes de gens-là prennent toujours plus qu'on ne leur donne.",ref:"(l. 18-19)",procede:"synthèse satirique",analyse:`La <span class="procede-type">synthèse satirique</span> clôt l'analogie par un trait d'esprit mémorable.`}
        ]},
      { id:"f-t3-mvt4", mouvement:4, titre:"La vertigineuse conclusion", vers:"l. 18-33",
        procedes:[
          {id:"p-f3m4-1",num:1,citation:"quand deux choses sont semblables en tout...",ref:"(l. 20-21)",procede:"définition du syllogisme analogique",analyse:`La <span class="procede-type">définition du syllogisme analogique</span> offre les clés de la pensée scientifique moderne.`},
          {id:"p-f3m4-2",num:2,citation:"j'ai tiré que la Lune étoit habitée... parce qu'elles ressemblent",ref:"(l. 22-23)",procede:"illustration concrète de la déduction",analyse:`L'<span class="procede-type">illustration concrète de la déduction</span> montre la loi énoncée précédemment à l'œuvre.`},
          {id:"p-f3m4-3",num:3,citation:"il faut franchir le pas de bonne grâce.",ref:"(l. 26)",procede:"métaphore de la reddition",analyse:`La <span class="procede-type">métaphore de la reddition</span> exige de l'élève qu'elle accepte les conclusions extrêmes de la logique.`},
          {id:"p-f3m4-4",num:4,citation:"ne le voient que comme une petite étoile fixe",ref:"(l. 28-29)",procede:"antithèse visuelle",analyse:`La puissante <span class="procede-type">antithèse visuelle</span> (soleil immense / petite étoile) démontre la parfaite compréhension de la Marquise, qui énonce elle-même la relativité du monde.`}
        ]}
    ],
    "r-t1": [
      { id:"r-t1-mvt1", mouvement:1, titre:"L'exposition glaciale de la misère", vers:"v. 1-6",
        procedes:[
          {id:"p-r1m1-1",num:1,citation:"Noirs dans la neige et dans la brume",ref:"(v. 1)",procede:"antithèse chromatique",analyse:`L'<span class="procede-type">antithèse chromatique</span> engloutit immédiatement les enfants dans un froid mortel.`},
          {id:"p-r1m1-2",num:2,citation:"Leurs culs en rond",ref:"(v. 3)",procede:"registre trivial",analyse:`L'usage du <span class="procede-type">registre trivial</span> animalise les victimes, réduites à des corps souffrants.`},
          {id:"p-r1m1-3",num:3,citation:"misère !",ref:"(v. 4)",procede:"apostrophe exclamative",analyse:`Cette soudaine <span class="procede-type">apostrophe exclamative</span> traduit l'indignation personnelle de Rimbaud.`},
          {id:"p-r1m1-4",num:4,citation:"Regardent le boulanger faire",ref:"(v. 5)",procede:"verbe de perception passive",analyse:`Le <span class="procede-type">verbe de perception passive</span> marque leur mise à l'écart radicale du cycle de la nourriture.`},
          {id:"p-r1m1-5",num:5,citation:"Le lourd pain blond",ref:"(v. 6)",procede:"adjectif de matérialité + couleur or",analyse:`L'adjectif de <span class="procede-type">matérialité</span> (« lourd ») et la <span class="procede-type">couleur or</span> (« blond ») sacralisent la richesse inaccessible.`}
        ]},
      { id:"r-t1-mvt2", mouvement:2, titre:"La féerie du démiurge", vers:"v. 7-12",
        procedes:[
          {id:"p-r1m2-1",num:1,citation:"le fort bras blanc qui tourne",ref:"(v. 8)",procede:"allitération en [b] + synecdoque",analyse:`L'<span class="procede-type">allitération en [b]</span> et la <span class="procede-type">synecdoque</span> donnent au boulanger l'apparence d'une force créatrice mécanique et toute-puissante.`},
          {id:"p-r1m2-2",num:2,citation:"Dans un trou clair.",ref:"(v. 10)",procede:"métaphore lumineuse",analyse:`La <span class="procede-type">métaphore lumineuse</span> isole le four comme un centre de vie éclatant.`},
          {id:"p-r1m2-3",num:3,citation:"écoutent le bon pain cuire.",ref:"(v. 11)",procede:"synesthésie",analyse:`L'utilisation de la <span class="procede-type">synesthésie</span> montre leurs sens aiguisés par l'odeur et la faim.`},
          {id:"p-r1m2-4",num:4,citation:"Le boulanger au gras sourire / Chante",ref:"(v. 12-13)",procede:"adjectif péjoratif",analyse:`L'<span class="procede-type">adjectif péjoratif</span> (« gras ») traduit le dégoût du poète pour l'indifférence cruelle des nantis face au besoin.`}
        ]},
      { id:"r-t1-mvt3", mouvement:3, titre:"La chaleur matricielle", vers:"v. 13-24",
        procedes:[
          {id:"p-r1m3-1",num:1,citation:"Ils sont blottis, pas un ne bouge",ref:"(v. 14)",procede:"animalisation de survie",analyse:`L'<span class="procede-type">animalisation de survie</span> évoque des bêtes terrées contre le froid.`},
          {id:"p-r1m3-2",num:2,citation:"Chaud comme un sein.",ref:"(v. 16)",procede:"comparaison maternelle",analyse:`La <span class="procede-type">comparaison maternelle</span> d'une immense cruauté souligne que la seule « mère » de ces enfants est une machine industrielle.`},
          {id:"p-r1m3-3",num:3,citation:"Chantent les croûtes parfumées",ref:"(v. 21)",procede:"personnification",analyse:`La <span class="procede-type">personnification</span> anime le pain, exacerbant la torture sensorielle des enfants.`},
          {id:"p-r1m3-4",num:4,citation:"ont leur âme si ravie / Sous leurs haillons",ref:"(v. 23-24)",procede:"antithèse",analyse:`L'<span class="procede-type">antithèse saisissante</span> entre la misère textile (« haillons ») et l'élévation spirituelle (« âme ») sacralise leur souffrance.`}
        ]},
      { id:"r-t1-mvt4", mouvement:4, titre:"Le réveil à l'atrocité", vers:"v. 25-35",
        procedes:[
          {id:"p-r1m4-1",num:1,citation:"Collant leurs petits museaux roses",ref:"(v. 27)",procede:"métaphore animale et chromatique",analyse:`La <span class="procede-type">métaphore animale et chromatique</span> allie la dégradation de la misère à l'innocence enfantine.`},
          {id:"p-r1m4-2",num:2,citation:"comme une prière…",ref:"(v. 30)",procede:"comparaison religieuse",analyse:`La <span class="procede-type">comparaison religieuse</span> dévoile l'impuissance absolue de l'humain face à la faim.`},
          {id:"p-r1m4-3",num:3,citation:"Du ciel rouvert",ref:"(v. 32)",procede:"métaphore sacrée",analyse:`La <span class="procede-type">métaphore sacrée</span> du four comme paradis terrestre condamne une société qui affame ses membres.`},
          {id:"p-r1m4-4",num:4,citation:"qu'ils crèvent leur culotte",ref:"(v. 34)",procede:"verbe vulgaire et violent",analyse:`Le <span class="procede-type">verbe vulgaire et violent</span> brise la liturgie en un éclair de réalisme désespérant.`},
          {id:"p-r1m4-5",num:5,citation:"lange blanc tremblotte",ref:"(v. 35)",procede:"détail pathétique",analyse:`Le <span class="procede-type">détail pathétique</span> de la prime enfance (« lange ») fige les victimes dans la cruauté du vent hivernal.`}
        ]}
    ],
    "r-t2": [
      { id:"r-t2-mvt1", mouvement:1, titre:"L'horreur aveugle et mécanique", vers:"v. 1-4",
        procedes:[
          {id:"p-r2m1-1",num:1,citation:"les crachats rouges de la mitraille",ref:"(v. 1)",procede:"métaphore organique hideuse",analyse:`La <span class="procede-type">métaphore organique hideuse</span> (« crachats ») dépouille la guerre de toute grandeur épique.`},
          {id:"p-r2m1-2",num:2,citation:"l'infini du ciel bleu",ref:"(v. 2)",procede:"antithèse chromatique",analyse:`La pureté de cette <span class="procede-type">antithèse chromatique</span> (bleu du ciel / rouge du sang) accuse l'impassibilité du monde face au massacre.`},
          {id:"p-r2m1-3",num:3,citation:"Roi qui les raille",ref:"(v. 3)",procede:"allitération gutturale en [r]",analyse:`L'<span class="procede-type">allitération gutturale en [r]</span> souligne la violence de l'attaque politique directe contre des souverains indifférents.`},
          {id:"p-r2m1-4",num:4,citation:"Croulent les bataillons",ref:"(v. 4)",procede:"inversion syntaxique",analyse:`L'<span class="procede-type">inversion syntaxique</span> mettant le verbe de chute dramatique en tête de vers illustre l'anéantissement de masse.`}
        ]},
      { id:"r-t2-mvt2", mouvement:2, titre:"La Nature profanée par l'industrie de mort", vers:"v. 5-8",
        procedes:[
          {id:"p-r2m2-1",num:1,citation:"folie épouvantable, broie",ref:"(v. 5)",procede:"personnification + enjambement",analyse:`La violente <span class="procede-type">personnification</span> et l'<span class="procede-type">enjambement</span> transforment la guerre en une machine infernale et dévorante.`},
          {id:"p-r2m2-2",num:2,citation:"un tas fumant",ref:"(v. 6)",procede:"métaphore réifiante",analyse:`La terrible <span class="procede-type">métaphore réifiante</span> anéantit l'individualité de « cent milliers d'hommes ».`},
          {id:"p-r2m2-3",num:3,citation:"Pauvres morts ! dans l'été, dans l'herbe, dans ta joie",ref:"(v. 7)",procede:"anaphore",analyse:`L'<span class="procede-type">anaphore</span> rythme le contraste cruel entre le printemps verdoyant et la rigidité cadavérique.`},
          {id:"p-r2m2-4",num:4,citation:"Nature ! ô toi qui fis ces hommes saintement !",ref:"(v. 8)",procede:"apostrophe lyrique païenne",analyse:`L'<span class="procede-type">apostrophe lyrique païenne</span> accuse par contraste l'impiété des chefs de guerre qui détruisent la création.`}
        ]},
      { id:"r-t2-mvt3", mouvement:3, titre:"Le cynisme luxueux de Dieu", vers:"v. 9-12",
        procedes:[
          {id:"p-r2m3-1",num:1,citation:"- Il est un Dieu, qui rit",ref:"(v. 9)",procede:"rupture + antithèse blasphématoire",analyse:`La <span class="procede-type">rupture</span> créée par le tiret précède une <span class="procede-type">antithèse blasphématoire</span> où la miséricorde attendue cède la place au sadisme divin.`},
          {id:"p-r2m3-2",num:2,citation:"nappes damassées... encens... calices d'or",ref:"(v. 9-10)",procede:"champ lexical de l'opulence religieuse",analyse:`La saturation du <span class="procede-type">champ lexical de l'opulence religieuse</span> fustige la richesse obscène d'une Église coupée de son peuple.`},
          {id:"p-r2m3-3",num:3,citation:"dans le bercement des hosannah s'endort",ref:"(v. 11)",procede:"métaphore du sommeil",analyse:`La <span class="procede-type">métaphore du sommeil</span> révèle l'hypocrisie des rituels qui servent uniquement d'œillères pour ignorer le Mal.`}
        ]},
      { id:"r-t2-mvt4", mouvement:4, titre:"Le scandale vénal de l'Église", vers:"v. 12-14",
        procedes:[
          {id:"p-r2m4-1",num:1,citation:"des mères, ramassées / Dans l'angoisse",ref:"(v. 12-13)",procede:"participe passé postposé",analyse:`Le <span class="procede-type">participe passé postposé</span> exprime métaphoriquement et physiquement l'anéantissement des victimes civiles.`},
          {id:"p-r2m4-2",num:2,citation:"pleurant sous leur vieux bonnet noir",ref:"(v. 13)",procede:"détail réaliste et chromatique",analyse:`Ce <span class="procede-type">détail réaliste et chromatique</span> (le deuil populaire) contraste violemment avec les « calices d'or » de l'institution.`},
          {id:"p-r2m4-3",num:3,citation:"Lui donnent un gros sou lié dans leur mouchoir !",ref:"(v. 14)",procede:"chute ironique",analyse:`La redoutable <span class="procede-type">chute ironique</span> prouve que la religion n'est qu'un commerce : Dieu n'accorde son attention qu'au prix d'une tractation financière.`}
        ]}
    ]
  }
};

// ----------------------------------------------------------------
// SEED — vérifie que la base est vide avant d'insérer (anti-doublon)
// ----------------------------------------------------------------
export async function seedIfEmpty() {
  const snap = await getDocs(collection(db, 'oeuvres'));
  const isNew = snap.empty;

  if (isNew) {
    // Première initialisation : oeuvres + analyses
    console.log('Initialisation de la base…');
    for (const oeuvre of SEED.oeuvres) {
      await setDoc(doc(db, 'oeuvres', oeuvre.id), { ...oeuvre, createdAt: serverTimestamp() });
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
    console.log('Seed initial terminé !');
  }

  // Toujours : synchronise les textes depuis le code vers Firebase
  // Permet d'ajouter/corriger des textes sans vider la base
  for (const [oeuvreId, textes] of Object.entries(SEED.textes)) {
    for (const texte of textes) {
      await setDoc(doc(db, 'textes', texte.id), { ...texte, oeuvreId, updatedAt: serverTimestamp() });
    }
  }
  console.log('Textes synchronisés !');
}



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
