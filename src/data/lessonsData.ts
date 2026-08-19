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
    title: 'Acidentes: Sustenidos (♯) e Bemóis (♭)',
    description: 'Entenda os semitons, o que são as teclas pretas e como alterar as notas.',
    iconName: 'Hash',
    xpReward: 160,
    theoryContent: [
      {
        title: 'Semitom e Tom',
        paragraphs: [
          'O Semitom (meio-tom) é a menor distância entre duas notas na música tradicional (por exemplo, de Dó para a tecla preta logo ao lado: Dó#).',
          'Um Tom inteiro é a união de 2 Semitons (por exemplo, de Dó para Ré).'
        ],
        tips: [
          'Entre Mi e Fá, e entre Si e Dó NÃO existem teclas pretas — a distância natural entre elas já é de 1 semitom!'
        ]
      },
      {
        title: 'Sustenido (♯), Bemol (♭) e Bequadro (♮)',
        paragraphs: [
          'Sustenido (♯): eleva a nota em 1 semitom (meio-tom para cima / direita).',
          'Bemol (♭): abaixa a nota em 1 semitom (meio-tom para baixo / esquerda).',
          'Bequadro (♮): anula qualquer sustenido ou bemol e devolve a nota ao seu estado natural.'
        ],
        tips: [
          'Dó♯ e Ré♭ são a MESMA tecla e som físico! Isso se chama Enarmonia.'
        ]
      }
    ],
    questions: [
      {
        id: 'q5-1',
        type: 'theory-quiz',
        prompt: 'O que o símbolo Sustenido (♯) faz com a altura de uma nota musical?',
        explanation: 'O sustenido eleva a altura da nota em 1 semitom (meio tom para a direita no piano).',
        options: [
          { id: 'o1', label: 'Eleva a nota em 1 semitom (meio tom)', isCorrect: true },
          { id: 'o2', label: 'Abaixa a nota em 1 semitom', isCorrect: false },
          { id: 'o3', label: 'Dobra a duração de tempo da nota', isCorrect: false },
          { id: 'o4', label: 'Silencia a nota', isCorrect: false }
        ]
      },
      {
        id: 'q5-2',
        type: 'theory-quiz',
        prompt: 'Entre quais pares de notas naturais NÃO existe tecla preta (já é semitom natural)?',
        explanation: 'Entre Mi e Fá, e entre Si e Dó a distância natural já é de 1 semitom!',
        options: [
          { id: 'o1', label: 'Mi–Fá e Si–Dó', isCorrect: true },
          { id: 'o2', label: 'Dó–Ré e Fá–Sol', isCorrect: false },
          { id: 'o3', label: 'Sol–Lá e Lá–Si', isCorrect: false },
          { id: 'o4', label: 'Ré–Mi e Fá–Sol', isCorrect: false }
        ]
      },
      {
        id: 'q5-3',
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
          'Podem ser melódicos (tocados um após o outro) ou harmônicos (tocados simultaneamente).'
        ],
        tips: [
          '3ª Maior (4 semitons): som aberto, alegre e triunfante (ex: Dó para Mi).',
          '3ª Menor (3 semitons): som melancólico e suave (ex: Dó para Mi♭).',
          '5ª Justa (7 semitons): som muito estável e potente (ex: Dó para Sol - famoso "power chord").',
          '8ª Justa (12 semitons): a mesma nota em outro registro.'
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
          'A base fundamental são as Tríades, formadas por: Tônica (1ª), Terça (3ª) e Quinta (5ª).'
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
  }
];
