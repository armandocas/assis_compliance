import type { ChecklistCategoria as CategoriaType, ChecklistItem, ChecklistResposta } from '../types';
import { ChecklistItem as ItemComponent } from './ChecklistItem';
import { CategoriaIcon } from '../icons';

interface Props {
  categoria: CategoriaType;
  itens: ChecklistItem[];
  respostas: Record<string, ChecklistResposta>;
  onResposta: (itemId: string, status: ChecklistResposta['status'], observacao?: string) => void;
}

export function ChecklistCategoria({ categoria, itens, respostas, onResposta }: Props) {
  const respondidos = itens.filter((i) => respostas[i.id]).length;
  const total = itens.length;

  return (
    <section className="rounded-xl sm:rounded-2xl glass-subtle border border-white/[0.08] overflow-hidden">
      <div className="flex items-start sm:items-center gap-2 sm:gap-3 p-3 sm:p-5 border-b border-white/[0.06] bg-white/[0.02]">
        <CategoriaIcon name={categoria.icone} className="w-5 h-5 flex-shrink-0 text-legal-gold" />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm sm:text-lg text-white">{categoria.nome}</h3>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">{categoria.descricao}</p>
        </div>
        <span className="text-sm font-medium text-neutral-500 font-mono flex-shrink-0">
          {respondidos}/{total}
        </span>
      </div>
      <div className="p-3 sm:p-5 space-y-3 sm:space-y-4">
        {itens.map((item) => (
          <ItemComponent
            key={item.id}
            item={item}
            status={respostas[item.id]?.status ?? null}
            observacao={respostas[item.id]?.observacao}
            onResposta={onResposta}
          />
        ))}
      </div>
    </section>
  );
}
