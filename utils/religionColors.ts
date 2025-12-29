import { Religions } from '@/types';

/**
 * Mapeamento de religiões para cores frias (tons de azul, verde, roxo, ciano)
 */
export const religionColorMap: Record<Religions, string> = {
  [Religions.CATOLICA]: '#3b82f6',        // Blue-500
  [Religions.EVANGELICA]: '#8b5cf6',      // Violet-500
  [Religions.ESPIRITA]: '#06b6d4',        // Cyan-500
  [Religions.MATRIZ_AFRICANA]: '#10b981', // Emerald-500
  [Religions.JUDAICA]: '#6366f1',         // Indigo-500
  [Religions.BUDDISTA]: '#14b8a6',        // Teal-500
  [Religions.MUÇULMANA]: '#0ea5e9',       // Sky-500
  [Religions.OUTRAS]: '#64748b',          // Slate-500
};

/**
 * Retorna a cor associada a uma religião específica
 * @param religion - A religião para obter a cor
 * @returns A cor hexadecimal associada à religião
 */
export const getReligionColor = (religion: Religions | string): string => {
  return religionColorMap[religion as Religions] || religionColorMap[Religions.OUTRAS];
};
