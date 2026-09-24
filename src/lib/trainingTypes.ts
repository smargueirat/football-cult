// Tipos reales de equipamiento de entrenamiento, en el mismo orden en que
// se muestran los chips del filtro. Espeja TRAINING_LEAVES de
// scripts/gear-mining/mine_gear.py (que es quien los asigna desde la hoja
// de categoría real del feed) -- si se agrega un tipo allá, va acá también.
export const TRAINING_TYPES = [
  "petos",
  "conos",
  "elasticos",
  "material",
  "redes",
  "marcadores",
  "silbatos",
  "aros",
  "infladores",
  "tactica",
  "escaleras",
  "vallas",
  "porterias",
] as const;

export type TrainingType = (typeof TRAINING_TYPES)[number];
