import { Lesson } from '../types';

export const LESSONS: Lesson[] = [
  {
    id: 'lesson-1',
    number: 1,
    category: 'fundamentos',
    title: 'As 7 Notas Musicais e Nomes',
    description: 'Aprenda os nomes das 7 notas naturais, a notação internacional (C D E F G A B) e como o som funciona.',
    iconName: 'Music',
    xpReward: 100,
    theoryContent: [
      {
        title: 'As 7 Notas Naturais',
        paragraphs: [
          'Toda a música ocidental é construída a partir de 7 notas fundamentais em ciclo: Dó, Ré, Mi, Fá, Sol, Lá, Si.',
          'Quando chegamos ao Si, o ciclo recomeça em um Dó mais agudo. A altura de uma nota depende da velocidade da vibração do ar (frequência medida em Hertz).'
        ],
        tips: [
          'Notas mais graves vibram mais devagar (frequência baixa).',
          'Notas mais agudas vibram mais rápido (frequência alta).'
        ]
      },
      {
        title: 'Notação Internacional (Cifras)',
        paragraphs: [
          'No mundo inteiro, as notas também são representadas pelas primeiras letras do alfabeto, começando pela nota Lá (A):',
          'A = Lá | B = Si | C = Dó | D = Ré | E = Mi | F = Fá | G = Sol.'
        ],
        tips: [
          'Memorize que C é Dó e A é Lá! Isso será essencial no piano e na partitura.'
        ]
      }
    ],
    questions: [
      {
        id: 'q1-1',
        type: 'theory-quiz',
        prompt: 'Qual letra do sistema de cifras internacional representa a nota DÓ?',
        explanation: 'C representa a nota Dó. O sistema começa em A (Lá), B (Si), C (Dó), D (Ré), E (Mi), F (Fá), G (Sol).',
        options: [
          { id: 'o1', label: 'C', subLabel: 'Dó', isCorrect: true },
          { id: 'o2', label: 'D', subLabel: 'Ré', isCorrect: false },
          { id: 'o3', label: 'A', subLabel: 'Lá', isCorrect: false },
          { id: 'o4', label: 'G', subLabel: 'Sol', isCorrect: false }
        ]
      },
      {
        id: 'q1-2',
        type: 'theory-quiz',
        prompt: 'Qual nota vem imediatamente depois de Sol na sequência natural ascendente?',
        explanation: 'A sequência é: Dó, Ré, Mi, Fá, Sol, LÁ, Si.',
        options: [
          { id: 'o1', label: 'Lá (A)', isCorrect: true },
          { id: 'o2', label: 'Fá (F)', isCorrect: false },
          { id: 'o3', label: 'Si (B)', isCorrect: false },
          { id: 'o4', label: 'Dó (C)', isCorrect: false }
        ]
      },
      {
        id: 'q1-3',
        type: 'play-note-on-piano',
        prompt: 'Toque a nota MI (E) no teclado interativo abaixo.',
        subPrompt: 'Clique na tecla Mi (E4)',
        targetNotes: [{ note: 'E', octave: 4 }],
        explanation: 'Muito bem! A nota Mi (E) fica logo à direita da nota Ré.',
        options: []
      },
      {
        id: 'q1-4',
        type: 'ear-single-note',
        prompt: 'Ouça o som e identifique qual nota foi tocada!',
        audioTarget: {
          notes: [{ note: 'C', octave: 4 }],
          type: 'single'
        },
        explanation: 'Você ouviu o Dó 4 (C4), a nota fundamental de referência central!',
        options: [
          { id: 'o1', label: 'Dó (C)', isCorrect: true },
          { id: 'o2', label: 'Sol (G)', isCorrect: false },
          { id: 'o3', label: 'Si (B)', isCorrect: false },
          { id: 'o4', label: 'Fá (F)', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'lesson-2',
    number: 2,
    category: 'partitura',
    title: 'A Pauta Musical e a Clave de Sol',
    description: 'Descubra como ler o pentagrama, as 5 linhas, os 4 espaços e a famosa Clave de Sol.',
    iconName: 'FileText',
    xpReward: 120,
    theoryContent: [
      {
        title: 'O Pentagrama (Pauta Musical)',
        paragraphs: [
          'A partitura é escrita sobre uma pauta de 5 linhas paralelas e 4 espaços, contados sempre de BAIXO PARA CIMA.',
          'Quanto mais alto a nota estiver na pauta, mais AGUDO é o som!'
        ],
        tips: [
          'Linha 1 é a de baixo, Linha 5 é a do topo.'
        ]
      },
      {
        title: 'A Clave de Sol (Treble Clef)',
        paragraphs: [
          'A Clave de Sol é desenhada a partir da 2ª LINHA da pauta.',
          'Isso significa que toda nota que repousa sobre a 2ª linha é a nota SOL (G4)! A partir dela, encontramos todas as outras.'
        ],
        tips: [
          'Linhas (de baixo p/ cima): Mi (1ª), Sol (2ª), Si (3ª), Ré (4ª), Fá (5ª).',
          'Espaços (de baixo p/ cima): Fá (1º), Lá (2º), Dó (3º), Mi (4º).'
        ]
      }
    ],
    questions: [
      {
        id: 'q2-1',
        type: 'identify-note-sheet',
        prompt: 'Que nota está marcada sobre a 2ª linha na Clave de Sol?',
        clef: 'treble',
        targetNotes: [{ note: 'G', octave: 4 }],
        explanation: 'Exato! A 2ª linha é o Sol 4 (G4), onde a própria Clave de Sol tem sua origem.',
        options: [
          { id: 'o1', label: 'Sol (G4)', isCorrect: true },
          { id: 'o2', label: 'Mi (E4)', isCorrect: false },
          { id: 'o3', label: 'Si (B4)', isCorrect: false },
          { id: 'o4', label: 'Dó (C5)', isCorrect: false }
        ]
      },
      {
        id: 'q2-2',
        type: 'identify-note-sheet',
        prompt: 'Qual é esta nota localizada no 1º espaço da pauta?',
        clef: 'treble',
        targetNotes: [{ note: 'F', octave: 4 }],
        explanation: 'O 1º espaço entre a primeira e a segunda linha é a nota FÁ (F4).',
        options: [
          { id: 'o1', label: 'Fá (F4)', isCorrect: true },
          { id: 'o2', label: 'Lá (A4)', isCorrect: false },
          { id: 'o3', label: 'Dó (C4)', isCorrect: false },
          { id: 'o4', label: 'Ré (D4)', isCorrect: false }
        ]
      },
      {
        id: 'q2-3',
        type: 'identify-note-sheet',
        prompt: 'Que nota está no 3º espaço da pauta (entre a 3ª e 4ª linha)?',
        clef: 'treble',
        targetNotes: [{ note: 'C', octave: 5 }],
        explanation: 'Muito bem! O 3º espaço é o Dó agudo (C5). Os espaços de baixo para cima formam FÁ - LÁ - DÓ - MI.',
        options: [
          { id: 'o1', label: 'Dó (C5)', isCorrect: true },
          { id: 'o2', label: 'Sol (G4)', isCorrect: false },
          { id: 'o3', label: 'Mi (E5)', isCorrect: false },
          { id: 'o4', label: 'Si (B4)', isCorrect: false }
        ]
      },
      {
        id: 'q2-4',
        type: 'play-note-on-piano',
        prompt: 'Toque no piano a nota da 1ª linha da Clave de Sol: MI (E4).',
        targetNotes: [{ note: 'E', octave: 4 }],
        explanation: 'Perfeito! A 1ª linha da pauta na Clave de Sol é a nota Mi 4 (E4).',
        options: []
      }
    ]
  },
  {
    id: 'lesson-3',
    number: 3,
    category: 'oitavas',
    title: 'O Dó Central (C4) e o Conceito de Oitavas',
    description: 'Entenda como as oitavas organizam os sons e conheça as linhas suplementares.',
    iconName: 'Layers',
    xpReward: 140,
    theoryContent: [
      {
        title: 'O que é uma Oitava?',
        paragraphs: [
          'Uma oitava é a distância entre uma nota e a próxima repetição do seu nome (por exemplo, de Dó até o próximo Dó acima ou abaixo).',
          'A nota mais aguda tem exatamente o DOBRO da frequência da nota mais grave (ex: Lá 4 = 440 Hz, Lá 5 = 880 Hz, Lá 3 = 220 Hz). Elas soam em perfeita consonância!'
        ],
        tips: [
          'No piano padrão existem 7 oitavas e meia numeradas de C1 a C8.'
        ]
      },
      {
        title: 'O Dó Central (C4) e Linhas Suplementares',
        paragraphs: [
          'O Dó Central (C4) fica bem no meio do piano acústico. Na partitura da Clave de Sol, ele fica abaixo da pauta, desenhado com uma pequena linha própria chamada Linha Suplementar Inferior.',
          'As linhas suplementares funcionam como extensões invisíveis da pauta quando as notas são muito graves ou muito agudas.'
        ],
        tips: [
          'Dó Central = 1 linha suplementar abaixo da pauta na Clave de Sol.'
        ]
      }
    ],
    questions: [
      {
        id: 'q3-1',
        type: 'identify-note-sheet',
        prompt: 'Identifique esta nota fundamental com uma linha suplementar abaixo da pauta:',
        clef: 'treble',
        targetNotes: [{ note: 'C', octave: 4 }],
        explanation: 'Este é o famoso Dó Central (C4), ponto de encontro entre as claves de Sol e Fá!',
        options: [
          { id: 'o1', label: 'Dó Central (C4)', isCorrect: true },
          { id: 'o2', label: 'Lá (A3)', isCorrect: false },
          { id: 'o3', label: 'Ré (D4)', isCorrect: false },
          { id: 'o4', label: 'Mi (E4)', isCorrect: false }
        ]
      },
      {
        id: 'q3-2',
        type: 'ear-pitch-compare',
        prompt: 'Ouça duas notas. A SEGUNDA nota é mais AGUDA ou mais GRAVE que a primeira?',
        audioTarget: {
          notes: [{ note: 'C', octave: 3 }, { note: 'C', octave: 5 }],
          type: 'interval'
        },
        explanation: 'A segunda nota (C5) está 2 oitavas acima da primeira (C3), logo é muito mais AGUDA!',
        options: [
          { id: 'o1', label: 'Mais Aguda ⬆', isCorrect: true },
          { id: 'o2', label: 'Mais Grave ⬇', isCorrect: false },
          { id: 'o3', label: 'Mesma Altura', isCorrect: false }
        ]
      },
      {
        id: 'q3-3',
        type: 'play-note-on-piano',
        prompt: 'Toque a nota DÓ na Oitava 5 (C5 - Dó Agudo).',
        targetNotes: [{ note: 'C', octave: 5 }],
        explanation: 'Excelente! C5 é uma oitava inteira acima de C4.',
        options: []
      }
    ]
  },
  {
    id: 'lesson-4',
    number: 4,
    category: 'partitura',
    title: 'A Clave de Fá (Sons Graves)',
    description: 'Aprenda a ler a pauta para instrumentos graves como contrabaixo, violoncelo e a mão esquerda do piano.',
    iconName: 'Disc',
    xpReward: 150,
    theoryContent: [
      {
        title: 'Para que serve a Clave de Fá?',
        paragraphs: [
          'Instrumentos graves produzem frequências baixas. Se usássemos a Clave de Sol, precisaríamos de dezenas de linhas suplementares!',
          'A Clave de Fá (Bass Clef) posiciona suas referências na 4ª LINHA da pauta, cercada por dois pontinhos.'
        ],
        tips: [
          'A 4ª linha da pauta na Clave de Fá é o FÁ 3 (F3).'
        ]
      },
      {
        title: 'Notas na Clave de Fá',
        paragraphs: [
          'Linhas (baixo para cima): Sol (1ª), Si (2ª), Ré (3ª), Fá (4ª), Lá (5ª).',
          'Espaços (baixo para cima): Lá (1º), Dó (2º), Mi (3º), Sol (4º).'
        ],
        tips: [
          'O Dó Central (C4) fica na 1ª linha suplementar SUPERIOR da Clave de Fá!'
        ]
      }
    ],
    questions: [
      {
        id: 'q4-1',
        type: 'identify-note-sheet',
        prompt: 'Na Clave de Fá, qual nota fica exatamente na 4ª linha (entre os 2 pontos)?',
        clef: 'bass',
        targetNotes: [{ note: 'F', octave: 3 }],
        explanation: 'Correto! A 4ª linha é a nota FÁ 3 (F3), que dá o nome à Clave de Fá.',
        options: [
          { id: 'o1', label: 'Fá (F3)', isCorrect: true },
          { id: 'o2', label: 'Dó (C3)', isCorrect: false },
          { id: 'o3', label: 'Lá (A3)', isCorrect: false },
          { id: 'o4', label: 'Sol (G2)', isCorrect: false }
        ]
      },
      {
        id: 'q4-2',
        type: 'identify-note-sheet',
        prompt: 'Qual nota está no 2º espaço da Clave de Fá?',
        clef: 'bass',
        targetNotes: [{ note: 'C', octave: 3 }],
        explanation: 'Muito bem! O 2º espaço na Clave de Fá é o Dó 3 (C3).',
        options: [
          { id: 'o1', label: 'Dó (C3)', isCorrect: true },
          { id: 'o2', label: 'Mi (E3)', isCorrect: false },
          { id: 'o3', label: 'Sol (G3)', isCorrect: false },
          { id: 'o4', label: 'Si (B2)', isCorrect: false }
        ]
      },
      {
        id: 'q4-3',
        type: 'play-note-on-piano',
        prompt: 'Toque no teclado a nota SOL grave da 1ª linha da Clave de Fá: Sol 2 (G2) ou Sol 3 (G3).',
        targetNotes: [{ note: 'G', octave: 3 }],
        explanation: 'Sensacional! Você já está lendo sons graves no teclado!',
        options: []
      }
    ]
  },
  {
    id: 'lesson-5',
    number: 5,
    category: 'fundamentos',
    title: 'O que é Tom e Semitom? Acidentes & Enarmonia',
    description: 'Entenda a régua elementar da música: semitom (meio-tom), tom inteiro (2 semitons), sustenidos, bemóis e notas enarmônicas.',
    iconName: 'Hash',
    xpReward: 160,
    theoryContent: [
      {
        title: 'O Semitom (Meio-Tom) e o Tom Inteiro',
        paragraphs: [
          'O Semitom (ou meio-tom) é a menor distância entre duas notas na música ocidental. No piano, é o passo imediato para a tecla vizinha mais próxima — seja ela preta ou branca (ex: de Dó para Dó♯, ou de Mi para Fá).',
          'Um Tom inteiro é a soma de 2 Semitons (por exemplo: Dó para Ré, Fá para Sol, Sol para Lá). Entre duas notas separadas por um tom inteiro, há sempre uma nota intermediária no meio.'
        ],
        tips: [
          'Nos instrumentos de trastes (como violão e guitarra), 1 traste = 1 semitom. 2 trastes = 1 tom.',
          'Entre Mi e Fá, e entre Si e Dó NÃO existem teclas pretas — a distância natural entre elas já é de apenas 1 Semitom!'
        ]
      },
      {
        title: 'Sustenido (♯), Bemol (♭) e Bequadro (♮)',
        paragraphs: [
          'Os acidentes são sinais gráficos colocados antes da nota que alteram sua frequência sonora:',
          '• Sustenido (♯): eleva a nota em 1 semitom (meio-tom mais agudo / para a direita).',
          '• Bemol (♭): abaixa a nota em 1 semitom (meio-tom mais grave / para a esquerda).',
          '• Bequadro (♮): desfaz e anula qualquer acidente anterior, devolvendo a nota ao som natural.'
        ],
        tips: [
          'Enarmonia: notas com nomes diferentes, mas que produzem exatamente o mesmo som e frequência (ex: Dó♯ e Ré♭, Fá♯ e Sol♭, Lá♯ e Si♭).'
        ]
      }
    ],
    questions: [
      {
        id: 'q5-1',
        type: 'theory-quiz',
        prompt: 'Qual é a definição exata de 1 TOM inteiro na teoria musical?',
        explanation: 'Um tom inteiro equivale à distância de exatamente 2 semitons (ou 2 meios-tons reunidos).',
        options: [
          { id: 'o1', label: 'A soma de 2 semitons (meios-tons)', isCorrect: true },
          { id: 'o2', label: 'A distância de 4 oitavas', isCorrect: false },
          { id: 'o3', label: 'Uma nota sem nenhuma vibração sonora', isCorrect: false },
          { id: 'o4', label: 'A menor distância possível entre teclas vizinhas', isCorrect: false }
        ]
      },
      {
        id: 'q5-2',
        type: 'theory-quiz',
        prompt: 'Entre quais pares de notas naturais a distância já é de 1 SEMITOM (sem tecla preta intermediária)?',
        explanation: 'Entre Mi–Fá e entre Si–Dó a distância natural é de apenas 1 semitom!',
        options: [
          { id: 'o1', label: 'Mi–Fá e Si–Dó', isCorrect: true },
          { id: 'o2', label: 'Dó–Ré e Fá–Sol', isCorrect: false },
          { id: 'o3', label: 'Sol–Lá e Lá–Si', isCorrect: false },
          { id: 'o4', label: 'Ré–Mi e Lá–Si', isCorrect: false }
        ]
      },
      {
        id: 'q5-3',
        type: 'theory-quiz',
        prompt: 'O que significa o conceito de ENARMONIA na teoria musical?',
        explanation: 'Enarmonia é o fenômeno em que duas notas têm nomes e grafias diferentes na partitura (ex: Dó♯ e Ré♭), mas soam na mesmíssima frequência sonora.',
        options: [
          { id: 'o1', label: 'Notas com nomes diferentes, mas mesmo som e tom', isCorrect: true },
          { id: 'o2', label: 'Tocar desafinado no coro', isCorrect: false },
          { id: 'o3', label: 'Um instrumento sem cordas', isCorrect: false },
          { id: 'o4', label: 'Um silêncio que dura 4 tempos', isCorrect: false }
        ]
      },
      {
        id: 'q5-4',
        type: 'play-note-on-piano',
        prompt: 'Toque a tecla FÁ SUSTENIDO (F#4) no piano.',
        targetNotes: [{ note: 'F#', octave: 4 }],
        explanation: 'Excelente! F#4 fica na primeira tecla preta do grupo de 3 teclas pretas.',
        options: []
      }
    ]
  },
  {
    id: 'lesson-6',
    number: 6,
    category: 'intervalos',
    title: 'Intervalos Musicais e Ouvido Relativo',
    description: 'Aprenda a reconhecer a distância entre notas pelo som: 2ª, 3ª maior/menor, 5ª justa e 8ª.',
    iconName: 'Radio',
    xpReward: 180,
    theoryContent: [
      {
        title: 'O que é um Intervalo?',
        paragraphs: [
          'Intervalo é a distância sonora entre duas notas musicais.',
          'Podem ser melódicos (tocados um após o outro no tempo) ou harmônicos (tocados simultaneamente, soando juntos).'
        ],
        tips: [
          '3ª Maior (4 semitons / 2 tons): som aberto, alegre e luminoso (ex: Dó para Mi).',
          '3ª Menor (3 semitons / 1 tom e meio): som melancólico, lírico e reflexivo (ex: Dó para Mi♭).',
          '5ª Justa (7 semitons / 3 tons e meio): som muito estável, nobre e potente (ex: Dó para Sol).',
          '8ª Justa (12 semitons / 6 tons): a mesma nota duplicada em outro registro com o dobro da frequência.'
        ]
      }
    ],
    questions: [
      {
        id: 'q6-1',
        type: 'ear-interval',
        prompt: 'Ouça o intervalo tocado. Que tipo de salto sonoro você ouve?',
        audioTarget: {
          notes: [{ note: 'C', octave: 4 }, { note: 'G', octave: 4 }],
          type: 'interval'
        },
        explanation: 'Você ouviu uma 5ª Justa (Dó -> Sol), um dos intervalos mais fundamentais e estáveis da música!',
        options: [
          { id: 'o1', label: '5ª Justa (Salto Potente/Estável)', isCorrect: true },
          { id: 'o2', label: '2ª Menor (Sem tom vizinho)', isCorrect: false },
          { id: 'o3', label: 'Oitava (Salto Grande)', isCorrect: false }
        ]
      },
      {
        id: 'q6-2',
        type: 'ear-interval',
        prompt: 'Ouça este som: é uma 3ª MAIOR (alegre) ou uma 3ª MENOR (triste)?',
        audioTarget: {
          notes: [{ note: 'C', octave: 4 }, { note: 'E', octave: 4 }],
          type: 'interval'
        },
        explanation: 'Foi uma 3ª Maior (Dó para Mi natural), que traz sensação luminosa e alegre!',
        options: [
          { id: 'o1', label: '3ª Maior (Sensação Alegre/Brilhante)', isCorrect: true },
          { id: 'o2', label: '3ª Menor (Sensação Nostálgica/Triste)', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'lesson-7',
    number: 7,
    category: 'acordes',
    title: 'Construindo Acordes: Tríades Maiores e Menores',
    description: 'Descubra a harmonia: como empilhar 3 notas para criar acordes maiores e menores.',
    iconName: 'Zap',
    xpReward: 200,
    theoryContent: [
      {
        title: 'O que é um Acorde?',
        paragraphs: [
          'Um acorde é a execução simultânea de 3 ou mais notas em harmonia.',
          'A base fundamental de toda a música tonal são as Tríades, formadas pelo empilhamento de terças: Tônica (1º grau), Terça (3º grau) e Quinta (5º grau).'
        ],
        tips: [
          'Acorde Maior = Tônica + 3ª Maior (4 semitons) + 5ª Justa (7 semitons). Exemplo: C = Dó + Mi + Sol.',
          'Acorde Menor = Tônica + 3ª Menor (3 semitons) + 5ª Justa (7 semitons). Exemplo: Cm = Dó + Mi♭ + Sol.'
        ]
      }
    ],
    questions: [
      {
        id: 'q7-1',
        type: 'theory-quiz',
        prompt: 'Quais são as 3 notas que formam o acorde de DÓ MAIOR (C)?',
        explanation: 'O acorde de C Maior é formado pela Tônica (Dó), Terça Maior (Mi) e Quinta Justa (Sol).',
        options: [
          { id: 'o1', label: 'Dó - Mi - Sol (C - E - G)', isCorrect: true },
          { id: 'o2', label: 'Dó - Fá - Lá (C - F - A)', isCorrect: false },
          { id: 'o3', label: 'Ré - Fá - Lá (D - F - A)', isCorrect: false },
          { id: 'o4', label: 'Dó - Mi♭ - Sol (C - Eb - G)', isCorrect: false }
        ]
      },
      {
        id: 'q7-2',
        type: 'ear-chord',
        prompt: 'Ouça o acorde tocado. É um Acorde MAIOR ou um Acorde MENOR?',
        audioTarget: {
          notes: [{ note: 'C', octave: 4 }, { note: 'E', octave: 4 }, { note: 'G', octave: 4 }],
          type: 'chord'
        },
        explanation: 'Você ouviu um Acorde de Dó Maior, com sua sonoridade aberta e radiante!',
        options: [
          { id: 'o1', label: 'Acorde Maior (Alegre / Radiante)', isCorrect: true },
          { id: 'o2', label: 'Acorde Menor (Nostálgico / Tenso)', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'lesson-8',
    number: 8,
    category: 'escalas',
    title: 'O que é Escala Musical? A Fórmula Maior e a Pentatônica',
    description: 'Entenda como as escalas são formadas, a fórmula universal Tom-Tom-Semitom (T-T-ST-T-T-T-ST), os graus e a mágica Pentatônica.',
    iconName: 'Compass',
    xpReward: 220,
    theoryContent: [
      {
        title: 'O que é uma Escala Musical?',
        paragraphs: [
          'A palavra escala vem do latim scala, que significa "escada". Uma escala musical é uma sucessão organizada e ordenada de notas musicais em sentido ascendente ou descendente de altura.',
          'A escala funciona como a paleta de cores ou o alfabeto melódico de uma composição. Quando dizemos que uma música está em "Dó Maior", significa que suas melodias e harmonias usam predominantemente as notas dessa escala!'
        ],
        tips: [
          'A nota inicial que dá o nome à escala e serve como ponto de repouso é chamada de TÔNICA (Grau I).'
        ]
      },
      {
        title: 'A Fórmula Universal da Escala Maior',
        paragraphs: [
          'Qualquer Escala Maior do planeta segue rigorosamente a mesma regra de distâncias entre suas notas consecutivas:',
          'Tom — Tom — Semitom — Tom — Tom — Tom — Semitom  (T - T - ST - T - T - T - ST)',
          'Em Dó Maior: C --(T)--> D --(T)--> E --(ST)--> F --(T)--> G --(T)--> A --(T)--> B --(ST)--> C.'
        ],
        tips: [
          'Observe que os semitons acontecem entre o 3º e 4º graus (Mi e Fá) e entre o 7º e 8º graus (Si e Dó)!'
        ]
      },
      {
        title: 'Os 7 Graus da Escala & A Escala Pentatônica',
        paragraphs: [
          'Cada nota na escala ocupa uma posição fundamental chamada Grau:',
          'I - Tônica (casa/repouso) | II - Supertônica | III - Mediante | IV - Subdominante (afastamento) | V - Dominante (tensão que resolve na tônica) | VI - Sobredominante | VII - Sensível (atração irresistível pela tônica).',
          'A Escala Pentatônica: composta por apenas 5 notas (Graus I, II, III, V e VI). Por não conter semitons de atrito, qualquer nota tocada na pentatônica soa harmoniosa e sem conflito, sendo a base do Blues, Rock, MPB e da música milenar oriental.'
        ],
        tips: [
          'As 5 teclas pretas do piano formam, sozinhas, uma escala pentatônica pura!'
        ]
      }
    ],
    questions: [
      {
        id: 'q8-1',
        type: 'theory-quiz',
        prompt: 'Qual é a fórmula de intervalos que define a ESCALA MAIOR?',
        explanation: 'A fórmula da Escala Maior é: Tom - Tom - Semitom - Tom - Tom - Tom - Semitom (T - T - ST - T - T - T - ST).',
        options: [
          { id: 'o1', label: 'Tom - Tom - Semitom - Tom - Tom - Tom - Semitom', isCorrect: true },
          { id: 'o2', label: 'Semitom - Semitom - Tom - Tom - Tom - Semitom - Tom', isCorrect: false },
          { id: 'o3', label: 'Tom - Semitom - Tom - Semitom - Tom - Semitom - Tom', isCorrect: false },
          { id: 'o4', label: 'Tom - Tom - Tom - Tom - Tom - Tom - Tom', isCorrect: false }
        ]
      },
      {
        id: 'q8-2',
        type: 'theory-quiz',
        prompt: 'Na escala de Dó Maior (C - D - E - F - G - A - B), qual nota é a DOMINANTE (Grau V)?',
        explanation: 'Contando a partir de C (I): C=I, D=II, E=III, F=IV, G=V (Dominante). A dominante gera a tensão harmônica mais importante da música tonal.',
        options: [
          { id: 'o1', label: 'Sol (G)', isCorrect: true },
          { id: 'o2', label: 'Mi (E)', isCorrect: false },
          { id: 'o3', label: 'Fá (F)', isCorrect: false },
          { id: 'o4', label: 'Lá (A)', isCorrect: false }
        ]
      },
      {
        id: 'q8-3',
        type: 'theory-quiz',
        prompt: 'Quantas notas possui uma Escala PENTATÔNICA e por que ela é tão usada no improviso?',
        explanation: 'Possui 5 notas (penta). Por não possuir intervalos de semitom tenso, ela soa naturalmente agradável em quase qualquer contexto harmônico.',
        options: [
          { id: 'o1', label: '5 notas — evita atritos de semitom e soa consonante', isCorrect: true },
          { id: 'o2', label: '7 notas — apenas para instrumentos de sopro', isCorrect: false },
          { id: 'o3', label: '12 notas — todas as notas cromáticas reunidas', isCorrect: false },
          { id: 'o4', label: '3 notas — apenas as pontas do piano', isCorrect: false }
        ]
      },
      {
        id: 'q8-4',
        type: 'play-note-on-piano',
        prompt: 'Toque a TÔNICA da escala de Dó Maior: Dó 4 (C4).',
        targetNotes: [{ note: 'C', octave: 4 }],
        explanation: 'Perfeito! O Dó é a tônica, o centro de gravidade e repouso da escala.',
        options: []
      }
    ]
  },
  {
    id: 'lesson-9',
    number: 9,
    category: 'harmonia',
    title: 'O que é Harmonia? Melodia, Ritmo, Consonância & Funções',
    description: 'Compreenda a trindade da música (Melodia, Harmonia e Ritmo), a física da consonância vs dissonância e as 3 funções harmônicas (T-S-D).',
    iconName: 'Sparkles',
    xpReward: 240,
    theoryContent: [
      {
        title: 'Os 3 Pilares Fundamentais da Música',
        paragraphs: [
          'A música é constituída por três pilares inseparáveis:',
          '1. Melodia (Dimensão Horizontal): notas tocadas uma após a outra no tempo. É a linha condutora que cantamos e assobiamos.',
          '2. Harmonia (Dimensão Vertical): duas ou mais notas soando simultaneamente. Cria o ambiente emocional, a cor, a profundidade e o suporte da melodia.',
          '3. Ritmo (Dimensão Temporal): a distribuição dos sons e silêncios no tempo através de pulsos, andamentos e compassos.'
        ],
        tips: [
          'Pense na melodia como o personagem de um livro, na harmonia como o cenário e a atmosfera, e no ritmo como o tempo da narrativa!'
        ]
      },
      {
        title: 'Consonância vs Dissonância',
        paragraphs: [
          'Consonância: sensação de estabilidade, repouso, clareza e relaxamento acústico. Exemplos: oitavas (C-C), quintas justas (C-G) e terças maiores (C-E). As ondas sonoras vibram em proporções matemáticas simples.',
          'Dissonância: sensação de tensão, atrito acústico e instabilidade. Exemplos: segunda menor (C-C#) e o famoso Trítono (3 tons, C-F#). A dissonância não é um "erro" — ela é o motor que cria emoção, drama e a necessidade vital de RESOLUÇÃO harmônica!'
        ],
        tips: [
          'A música ocidental é uma dança contínua entre criar tensão (dissonância) e encontrar a paz (consonância).'
        ]
      },
      {
        title: 'As 3 Grandes Funções Harmônicas (T - S - D)',
        paragraphs: [
          'Em qualquer tonalidade, os acordes exercem papéis psicológicos nos nossos ouvidos:',
          '• TÔNICA (Grau I): traz repouso absoluto, estabilidade e sensação de "chegar em casa".',
          '• SUBDOMINANTE (Grau IV): traz afastamento sutil, transição e movimento.',
          '• DOMINANTE (Grau V ou V7): possui máxima tensão e instabilidade, criando uma atração irresistível que "puxa" de volta para a Tônica.'
        ],
        tips: [
          'A cadência mais clássica da história da música é I -> IV -> V -> I (Tônica -> Subdominante -> Dominante -> Tônica).'
        ]
      }
    ],
    questions: [
      {
        id: 'q9-1',
        type: 'theory-quiz',
        prompt: 'Qual é a diferença essencial entre MELODIA e HARMONIA?',
        explanation: 'A Melodia é horizontal (sons sucessivos um após o outro), enquanto a Harmonia é vertical (sons simultâneos combinados no mesmo instante).',
        options: [
          { id: 'o1', label: 'Melodia = sons sucessivos; Harmonia = sons simultâneos', isCorrect: true },
          { id: 'o2', label: 'Melodia é rápida e Harmonia é lenta', isCorrect: false },
          { id: 'o3', label: 'Melodia é cantada e Harmonia não usa notas', isCorrect: false },
          { id: 'o4', label: 'São exatamente a mesma coisa com nomes diferentes', isCorrect: false }
        ]
      },
      {
        id: 'q9-2',
        type: 'theory-quiz',
        prompt: 'Qual é o papel da função DOMINANTE (Grau V) na harmonia musical?',
        explanation: 'A Dominante acumula a maior tensão harmônica da escala, criando uma atração indispensável para resolver e repousar na Tônica.',
        options: [
          { id: 'o1', label: 'Gerar tensão que pede resolução imediata na Tônica', isCorrect: true },
          { id: 'o2', label: 'Terminar a música sem nenhuma emoção', isCorrect: false },
          { id: 'o3', label: 'Substituir o metrônomo do regente', isCorrect: false },
          { id: 'o4', label: 'Silenciar todos os outros instrumentos', isCorrect: false }
        ]
      },
      {
        id: 'q9-3',
        type: 'ear-chord',
        prompt: 'Ouça o acorde de Dó Menor (C - E♭ - G). Como se classifica a sensação harmônica da terça menor?',
        audioTarget: {
          notes: [{ note: 'C', octave: 4 }, { note: 'D#', octave: 4 }, { note: 'G', octave: 4 }],
          type: 'chord'
        },
        explanation: 'A terça menor traz uma sonoridade suave, introspectiva, tensa ou melancólica, contrastando com o brilho da terça maior.',
        options: [
          { id: 'o1', label: 'Acorde Menor (Melancólico / Introspectivo)', isCorrect: true },
          { id: 'o2', label: 'Acorde Maior (Aberto / Triunfante)', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'lesson-10',
    number: 10,
    category: 'instrumentos',
    title: 'Organologia: As Famílias de Instrumentos Musicais',
    description: 'Explore como cada instrumento produz seu som: Cordas (friccionadas, dedilhadas, percutidas), Madeiras, Metais, Percussão e Teclas.',
    iconName: 'Award',
    xpReward: 250,
    theoryContent: [
      {
        title: 'O que é Organologia?',
        paragraphs: [
          'A Organologia é a ciência que estuda a classificação, história, anatomia e acústica dos instrumentos musicais.',
          'Os instrumentos são divididos pelo modo como o som inicial é produzido e amplificado pelo corpo acústico do instrumento.'
        ],
        tips: [
          'Na orquestra sinfônica tradicional, os instrumentos agrupam-se em 4 grandes seções: Cordas, Madeiras, Metais e Percussão.'
        ]
      },
      {
        title: '1. Família das Cordas (Cordofones)',
        paragraphs: [
          'O som nasce da vibração mecânica de uma corda esticada tensionada sobre uma caixa de ressonância de madeira:',
          '• Friccionadas (com arco de crina de cavalo): Violino (soprano agudo), Viola (contralto veludoso), Violoncelo (tenor expressivo) e Contrabaixo (baixo profundo).',
          '• Dedilhadas (com dedos ou palheta): Violão clássico, Harpa, Guitarra elétrica, Cavaquinho e Alaúde.',
          '• Percutidas: O Piano acústico! Ao pressionar uma tecla, um martelo coberto de feltro atinge as cordas de aço internas.'
        ],
        tips: [
          'O piano é tecnicamente um instrumento de cordas percutidas com mecanismo de teclado!'
        ]
      },
      {
        title: '2. Madeiras & 3. Metais (Aerofones)',
        paragraphs: [
          'Os aerofones produzem som pela vibração de uma coluna de ar em um tubo acústico:',
          '• MADEIRAS (Woodwinds): o som é iniciado por uma embocadura de bisel (Flauta transversal, Flautim — sem palheta) ou pela vibração de uma palheta de cana (Clarinete e Saxofone = palheta simples; Oboé e Fagote = palheta dupla). Mesmo que a flauta moderna e o sax sejam feitos de metal, pertencem à família das madeiras por seu princípio acústico!',
          '• METAIS (Brass): o som é produzido pela vibração dos próprios LÁBIOS do instrumentista contra um bocal de metal em forma de taça! Exemplos: Trompete (brilhante), Trompa (aveludada), Trombone (com vara deslizante) e Tuba (graves monumentais).'
        ],
        tips: [
          'Atenção ao saxofone: feito de latão dourado, mas é uma madeira porque produz som com uma palheta de bambu!'
        ]
      },
      {
        title: '4. Percussão & 5. Teclas e Eletrônicos',
        paragraphs: [
          '• Percussão de Altura Definida (Afinada): produz notas musicais específicas que tocam melodias. Exemplos: Tímpanos orquestrais, Marimba, Xilofone, Vibrafone e Carrilhão.',
          '• Percussão de Altura Indeterminada: foca em ritmo e timbre puro. Exemplos: Caixa, Bumbo, Pratos, Triângulo, Pandeiro e Bateria completa.',
          '• Teclas e Eletrofones: Órgão de tubos (aerofone gigante acionado por ar), Cravo (cordas pinçadas por bicos de pena), Sintetizadores analógicos e digitais (geradores eletrônicos de ondas senoidais, quadradas e dente de serra).'
        ],
        tips: [
          'A marimba usa teclas de jacarandá e tubos ressonadores de alumínio para um som ressonante e quente.'
        ]
      }
    ],
    questions: [
      {
        id: 'q10-1',
        type: 'theory-quiz',
        prompt: 'A que família pertence o SAXOFONE e por qual motivo técnico?',
        explanation: 'O saxofone pertence à família das MADEIRAS porque o seu som é gerado pela vibração de uma palheta de cana (madeira), e não pela vibração labial em bocal de metal.',
        options: [
          { id: 'o1', label: 'Madeiras — porque produz som através de uma palheta de cana', isCorrect: true },
          { id: 'o2', label: 'Metais — porque o corpo externo é feito de latão dourado', isCorrect: false },
          { id: 'o3', label: 'Percussão — porque as chaves batem no tubo', isCorrect: false },
          { id: 'o4', label: 'Cordas — porque possui molas internas', isCorrect: false }
        ]
      },
      {
        id: 'q10-2',
        type: 'theory-quiz',
        prompt: 'Qual destes instrumentos de percussão possui ALTURA DEFINIDA (consegue tocar notas e melodias)?',
        explanation: 'A Marimba, o Xilofone e os Tímpanos possuem afinação definida em notas musicais precisas (Dó, Ré, Mi...). O triângulo, o bumbo e os pratos são de altura indeterminada.',
        options: [
          { id: 'o1', label: 'Marimba (e Xilofone)', isCorrect: true },
          { id: 'o2', label: 'Bumbo de orquestra', isCorrect: false },
          { id: 'o3', label: 'Pratos de choque', isCorrect: false },
          { id: 'o4', label: 'Triângulo', isCorrect: false }
        ]
      },
      {
        id: 'q10-3',
        type: 'theory-quiz',
        prompt: 'Como os instrumentos da família dos METAIS (trompete, trombone, trompa, tuba) produzem seu som inicial?',
        explanation: 'Nos metais, o som nasce da vibração direta dos lábios do instrumentista pressionados contra o bocal metálico (lip buzz).',
        options: [
          { id: 'o1', label: 'Pela vibração dos próprios lábios do músico contra o bocal', isCorrect: true },
          { id: 'o2', label: 'Por cordas de aço friccionadas por arco', isCorrect: false },
          { id: 'o3', label: 'Por palhetas duplas de bambu', isCorrect: false },
          { id: 'o4', label: 'Por eletricidade pura sem coluna de ar', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'lesson-11',
    number: 11,
    category: 'timbre',
    title: 'Timbre, Acústica e a Série Harmônica',
    description: 'Entenda a "impressão digital" de cada som: por que um violino soa diferente de uma flauta na mesma nota, a Série Harmônica e o Envelope ADSR.',
    iconName: 'Activity',
    xpReward: 260,
    theoryContent: [
      {
        title: 'O que é o Timbre?',
        paragraphs: [
          'Se você fechar os olhos e ouvir uma nota Lá tocada por um Violino, por uma Flauta e por um Piano na mesmíssima altura (440 Hz) e no mesmo volume, você saberá instantaneamente qual é qual.',
          'Essa qualidade única que distingue a personalidade e cor de dois sons com a mesma frequência e intensidade chama-se TIMBRE (a "voz" ou a "impressão digital" sonora do instrumento).'
        ],
        tips: [
          'O timbre é determinado por dois fatores acústicos essenciais: a Série Harmônica e o Envelope Dinâmico ADSR.'
        ]
      },
      {
        title: 'A Série Harmônica da Natureza',
        paragraphs: [
          'Na natureza, nenhuma nota acústica é uma onda pura e solitária. Quando uma corda ou coluna de ar vibra na frequência f (chamada Frequência Fundamental), ela também vibra simultaneamente em múltiplos inteiros dessa frequência: 2f, 3f, 4f, 5f...',
          'Essas frequências sobrepostas são os HARMÔNICOS. Cada formato e material de instrumento (madeira envernizada, metal cônico, tubo cilíndrico) amplifica certos harmônicos e atenua outros, pintando o timbre único daquele instrumento!'
        ],
        tips: [
          'A flauta transversal tem quase apenas a fundamental (som doce e límpido). O oboé e o violino são riquíssimos em harmônicos agudos (som brilhante e penetrante).'
        ]
      },
      {
        title: 'O Envelope Acústico: ADSR',
        paragraphs: [
          'Como o volume do som evolui do silêncio ao fim da nota:',
          '• A (Attack - Ataque): o tempo que o som leva para atingir seu pico máximo de energia (piano e marimba têm ataque percussivo ultrarrápido; violino e flauta têm ataque gradual).',
          '• D (Decay - Decaimento): a queda suave imediata após o impacto.',
          '• S (Sustain - Sustentação): o nível em que a nota se mantém estável enquanto a tecla é mantida pressionada ou o sopro continua.',
          '• R (Release - Relaxamento/Extinção): o tempo que o som leva para se extinguir no ar após soltar a tecla ou corda.'
        ],
        tips: [
          'Dinâmica na partitura: pp (pianissimo - muito suave) | p (piano - suave) | mp (mezzo-piano) | mf (mezzo-forte) | f (forte) | ff (fortissimo - com grande potência).'
        ]
      }
    ],
    questions: [
      {
        id: 'q11-1',
        type: 'theory-quiz',
        prompt: 'O que permite ao ouvido humano distinguir um Piano de um Violino tocando a mesma nota e volume?',
        explanation: 'O Timbre é a propriedade do som (definida pela série harmônica e envelope acústico) que permite diferenciar as fontes sonoras.',
        options: [
          { id: 'o1', label: 'O Timbre (a série harmônica e o envelope de cada som)', isCorrect: true },
          { id: 'o2', label: 'Apenas a velocidade da luz na sala', isCorrect: false },
          { id: 'o3', label: 'A cor da tinta pintada na parede', isCorrect: false },
          { id: 'o4', label: 'A quantidade de páginas da partitura', isCorrect: false }
        ]
      },
      {
        id: 'q11-2',
        type: 'theory-quiz',
        prompt: 'No envelope acústico ADSR, o que representa a letra "A" (Attack)?',
        explanation: 'Attack (Ataque) é o tempo inicial que o som leva para sair do repouso e atingir seu pico máximo de volume e impacto.',
        options: [
          { id: 'o1', label: 'O tempo inicial para o som atingir seu volume máximo', isCorrect: true },
          { id: 'o2', label: 'O momento em que a música é cancelada', isCorrect: false },
          { id: 'o3', label: 'A velocidade dos passos do público', isCorrect: false },
          { id: 'o4', label: 'A afinação mais grave da orquestra', isCorrect: false }
        ]
      },
      {
        id: 'q11-3',
        type: 'theory-quiz',
        prompt: 'O que é a SÉRIE HARMÔNICA gerada por uma corda ou coluna de ar em vibração?',
        explanation: 'É o conjunto de frequências múltiplas inteiras da fundamental (f, 2f, 3f...) que vibram simultaneamente e colorem o som.',
        options: [
          { id: 'o1', label: 'Frequências múltiplas naturais que vibram junto com a nota fundamental', isCorrect: true },
          { id: 'o2', label: 'Uma gravação de rádio pirateada', isCorrect: false },
          { id: 'o3', label: 'Um erro de digitação na pauta', isCorrect: false },
          { id: 'o4', label: 'O número de cadeiras no teatro', isCorrect: false }
        ]
      }
    ]
  }
];

export const ACHIEVEMENTS = [
  {
    id: 'first_lesson',
    title: 'Primeiros Passos',
    description: 'Complete sua primeira aula teórica e prática.',
    icon: 'Award'
  },
  {
    id: 'ear_master_5',
    title: 'Ouvido Absoluto Jr.',
    description: 'Acerte 5 desafios de percepção auditiva seguidos.',
    icon: 'Headphones'
  },
  {
    id: 'speed_100',
    title: 'Leitor Veloz',
    description: 'Atinja mais de 100 pontos no Speed Note Reader.',
    icon: 'Zap'
  },
  {
    id: 'mic_singer',
    title: 'Canto & Afinação',
    description: 'Acerte uma nota usando sua voz ou instrumento no microfone.',
    icon: 'Mic'
  },
  {
    id: 'all_clefs',
    title: 'Biclavista',
    description: 'Domine a Clave de Sol e a Clave de Fá.',
    icon: 'BookOpen'
  },
  {
    id: 'streak_3',
    title: 'Músico Dedicado',
    description: 'Mantenha uma sequência de 3 dias de estudo musical.',
    icon: 'Flame'
  },
  {
    id: 'scale_master',
    title: 'Mestre das Escalas',
    description: 'Domine a fórmula Tom-Tom-Semitom e a escala pentatônica.',
    icon: 'Compass'
  },
  {
    id: 'orchestra_maestro',
    title: 'Maestro Orquestral',
    description: 'Aprenda todas as famílias de instrumentos musicais da orquestra.',
    icon: 'Sparkles'
  }
];
