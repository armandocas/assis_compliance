export type ChecklistStatus = 'sim' | 'nao' | 'parcial' | 'nao_aplicavel';

export interface ChecklistItem {
  id: string;
  pergunta: string;
  categoria: string;
  referencia?: string;
  orientacao?: string;
}

export interface ChecklistResposta {
  itemId: string;
  status: ChecklistStatus;
  observacao?: string;
}

export interface ChecklistCategoria {
  id: string;
  nome: string;
  descricao: string;
  icone: string;
  cor: string;
}

export type ChecklistTipo = 'lgpd' | 'cdc' | 'boas_praticas' | 'marketplace';
