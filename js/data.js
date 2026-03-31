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
