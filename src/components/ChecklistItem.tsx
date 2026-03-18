import { useState, useEffect } from 'react';
import type { ChecklistItem as ItemType, ChecklistStatus } from '../types';
import { IconLightbulb } from '../icons';
import { obterUrlLegislacao } from '../data/legislacao';

interface Props {
  item: ItemType;
  status: ChecklistStatus | null;
  observacao?: string;
  onResposta: (itemId: string, status: ChecklistStatus, observacao?: string) => void;
}

const statusOptions: { value: ChecklistStatus; label: string; active: string; inactive: string }[] = [
  { value: 'sim', label: 'Sim', active: 'border-legal-gold/50 text-legal-gold bg-legal-gold/10', inactive: 'border-white/10 text-neutral-500' },
  { value: 'parcial', label: 'Parcial', active: 'border-amber-500/40 text-amber-400 bg-amber-500/10', inactive: 'border-white/10 text-neutral-500' },
  { value: 'nao', label: 'Não', active: 'border-rose-500/40 text-rose-400 bg-rose-500/10', inactive: 'border-white/10 text-neutral-500' },
  { value: 'nao_aplicavel', label: 'N/A', active: 'border-neutral-600 text-neutral-400 bg-neutral-500/10', inactive: 'border-white/10 text-neutral-500' },
];

export function ChecklistItem({ item, status, observacao = '', onResposta }: Props) {
  const [obsLocal, setObsLocal] = useState(observacao);
  useEffect(() => {
    setObsLocal(observacao);
  }, [observacao]);
  const mostraObservacao = status && (status === 'parcial' || status === 'nao');
  const urlLegislacao = item.referencia ? obterUrlLegislacao(item.referencia) : undefined;

  const handleStatusClick = (optStatus: ChecklistStatus) => {
    onResposta(item.id, optStatus, obsLocal.trim() || undefined);
  };

  const handleObservacaoBlur = () => {
    if (status) onResposta(item.id, status, obsLocal.trim() || undefined);
  };

  return (
    <div className="group p-4 sm:p-5 rounded-xl glass-subtle border border-white/[0.06] hover:border-legal-gold/20 transition-all duration-200">
      <div className="flex flex-col gap-3 sm:gap-4">
        <p className="text-neutral-200 font-medium leading-relaxed text-[15px] sm:text-base">{item.pergunta}</p>
        {(item.referencia || item.orientacao) && (
          <div className="text-sm space-y-1">
            {item.referencia && (
              <p className="text-neutral-500 font-mono text-xs">
                {urlLegislacao ? (
                  <a
                    href={urlLegislacao}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-legal-gold/80 hover:text-legal-gold underline underline-offset-2"
                  >
                    {item.referencia}
                  </a>
                ) : (
                  item.referencia
                )}
              </p>
            )}
            {item.orientacao && (
              <p className="text-neutral-500 flex items-start gap-2">
                <IconLightbulb className="w-4 h-4 flex-shrink-0 mt-0.5 text-legal-gold/70" />
                {item.orientacao}
              </p>
            )}
          </div>
        )}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
          {statusOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleStatusClick(opt.value)}
              aria-pressed={status === opt.value}
              aria-label={`Marcar como ${opt.label}`}
              className={`
                touch-target px-4 py-3 sm:py-2.5 rounded-full text-sm font-medium border transition-all
                active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-legal-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f1419]
                ${status === opt.value ? opt.active : opt.inactive}
              `}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {mostraObservacao && (
          <div className="mt-1">
            <label htmlFor={`obs-${item.id}`} className="block text-xs text-neutral-500 mb-1.5">
              Observação (opcional)
            </label>
            <textarea
              id={`obs-${item.id}`}
              value={obsLocal}
              onChange={(e) => setObsLocal(e.target.value)}
              onBlur={handleObservacaoBlur}
              placeholder="Ex.: Em revisão pela equipe jurídica"
              rows={2}
              className="w-full px-3 py-2 rounded-lg glass-subtle border border-white/10 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-legal-gold/50 focus:border-legal-gold/50 resize-none"
            />
          </div>
        )}
      </div>
    </div>
  );
}
