import { useState } from 'react';
import type { ChecklistResposta, ChecklistItem } from '../types';
import { categorias, todosItens } from '../data/checklists';
import { CategoriaIcon } from '../icons';
import { obterItensComSugestao, obterSugestao } from '../utils/exportarRelatorio';

interface Props {
  respostas: Record<string, ChecklistResposta>;
  nomeEmpresa: string;
  onExportarTxt: () => void;
  onExportarPdf: () => void;
  onReset: () => void;
}

function calcularPercentual(respostas: Record<string, ChecklistResposta>, tipo: 'sim' | 'parcial' | 'nao') {
  const vals = Object.values(respostas);
  if (vals.length === 0) return 0;
  const count = vals.filter((r) => r.status === tipo).length;
  return Math.round((count / vals.length) * 100);
}

export function Dashboard({ respostas, nomeEmpresa, onExportarTxt, onExportarPdf, onReset }: Props) {
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const totalItens = todosItens.length;
  const totalRespondidos = Object.keys(respostas).length;
  const pendentes = totalItens - totalRespondidos;

  const handleExportarTxt = () => {
    if (pendentes > 0 && !window.confirm(`${pendentes} itens ainda não foram respondidos. Deseja exportar mesmo assim?`)) return;
    onExportarTxt();
  };

  const handleExportarPdf = () => {
    if (pendentes > 0 && !window.confirm(`${pendentes} itens ainda não foram respondidos. Deseja exportar mesmo assim?`)) return;
    setIsExportingPdf(true);
    requestAnimationFrame(() => {
      onExportarPdf();
      requestAnimationFrame(() => setIsExportingPdf(false));
    });
  };
  const percentualCompleto = totalItens > 0 ? Math.round((totalRespondidos / totalItens) * 100) : 0;

  const sim = calcularPercentual(respostas, 'sim');
  const parcial = calcularPercentual(respostas, 'parcial');
  const nao = calcularPercentual(respostas, 'nao');

  const itensPorCategoria = todosItens.reduce<Record<string, typeof todosItens>>((acc, item) => {
    if (!acc[item.categoria]) acc[item.categoria] = [];
    acc[item.categoria].push(item);
    return acc;
  }, {});

  const itensComSugestao = obterItensComSugestao(respostas);

  return (
    <div className="space-y-6 sm:space-y-8">
      {nomeEmpresa && (
        <div className="p-3 sm:p-4 rounded-xl glass-subtle border border-white/[0.06]">
          <p className="text-sm text-neutral-400">
            Empresa em análise: <span className="font-semibold text-legal-gold">{nomeEmpresa}</span>
          </p>
        </div>
      )}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        <div className="p-3 sm:p-5 rounded-xl glass-subtle border border-legal-gold/20 bg-legal-gold/5">
          <p className="text-xs sm:text-sm text-neutral-500 font-medium">Progresso</p>
          <p className="text-2xl sm:text-3xl font-semibold text-legal-gold mt-1 tracking-tight">{percentualCompleto}%</p>
          <p className="text-sm text-neutral-500 mt-1">{totalRespondidos} de {totalItens} itens</p>
          <div className="mt-3 h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-legal-gold rounded-full transition-all duration-500"
              style={{ width: `${percentualCompleto}%` }}
            />
          </div>
        </div>
        <div className="p-3 sm:p-5 rounded-xl glass-subtle border border-emerald-500/20 bg-emerald-500/5">
          <p className="text-xs sm:text-sm text-neutral-500 font-medium">Conformes</p>
          <p className="text-2xl sm:text-3xl font-semibold text-emerald-400 mt-1 tracking-tight">{sim}%</p>
          <p className="text-sm text-neutral-500 mt-1">Itens atendidos</p>
        </div>
        <div className="p-3 sm:p-5 rounded-xl glass-subtle border border-amber-500/20 bg-amber-500/5">
          <p className="text-xs sm:text-sm text-neutral-500 font-medium">Parciais</p>
          <p className="text-2xl sm:text-3xl font-semibold text-amber-400 mt-1 tracking-tight">{parcial}%</p>
          <p className="text-sm text-neutral-500 mt-1">Requerem ajustes</p>
        </div>
        <div className="p-3 sm:p-5 rounded-xl glass-subtle border border-rose-500/20 bg-rose-500/5">
          <p className="text-xs sm:text-sm text-neutral-500 font-medium">Não conformes</p>
          <p className="text-2xl sm:text-3xl font-semibold text-rose-400 mt-1 tracking-tight">{nao}%</p>
          <p className="text-sm text-neutral-500 mt-1">Prioridade de correção</p>
        </div>
      </div>

      <div className="p-3 sm:p-5 rounded-xl glass-subtle border border-white/[0.06]">
        <h3 className="font-semibold text-base sm:text-lg text-white mb-3 sm:mb-4 tracking-tight">Resumo por Categoria</h3>
        <div className="space-y-3 sm:space-y-4">
          {Object.entries(itensPorCategoria).map(([catId, itens]) => {
            const cat = categorias[catId];
            if (!cat) return null;
            const resp = itens.filter((i) => respostas[i.id]);
            const conformes = resp.filter((r) => respostas[r.id]?.status === 'sim').length;
            const pct = resp.length > 0 ? Math.round((conformes / resp.length) * 100) : 0;
            return (
              <div key={catId} className="flex items-center gap-2 sm:gap-4 min-w-0">
                <CategoriaIcon name={cat.icone} className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-legal-gold/80" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-neutral-300 truncate text-sm sm:text-base">{cat.nome}</p>
                  <p className="text-xs sm:text-sm text-neutral-500">{resp.length}/{itens.length} respondidos</p>
                </div>
                <div className="w-12 sm:w-24 h-1.5 bg-white/5 rounded-full overflow-hidden flex-shrink-0">
                  <div
                    className="h-full bg-legal-gold/50 rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-xs sm:text-sm font-medium text-neutral-500 font-mono w-8 sm:w-10">{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {itensComSugestao.length > 0 && (
        <div className="p-3 sm:p-5 rounded-xl glass-subtle border border-amber-500/20 bg-amber-500/5">
          <h3 className="font-semibold text-base sm:text-lg text-white mb-3 sm:mb-4 tracking-tight">Sugestões advocatícias</h3>
          <div className="space-y-3">
            {itensComSugestao.map((item: ChecklistItem, idx: number) => {
              const resp = respostas[item.id];
              const sugestao = obterSugestao(item.id);
              if (!sugestao) return null;
              return (
                <div key={item.id} className="border-l-2 border-legal-gold/50 pl-3 py-1">
                  <p className="text-sm font-medium text-neutral-200">
                    {idx + 1}. {item.pergunta}
                  </p>
                  <p className="text-xs text-amber-200/90 mt-1">
                    [{resp?.status === 'nao' ? 'Não' : 'Parcial'}] {sugestao}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center gap-3">
        <button
          type="button"
          onClick={onReset}
          className="touch-target px-4 py-3 rounded-xl glass-subtle border border-white/10 text-neutral-400 text-sm font-medium hover:text-legal-gold hover:border-legal-gold/30 transition-colors"
        >
          Nova avaliação
        </button>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <button
          type="button"
          onClick={handleExportarTxt}
          className="touch-target px-4 sm:px-5 py-3 rounded-xl glass-subtle border border-legal-gold/40 text-legal-gold font-medium hover:bg-legal-gold/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Exportar TXT
        </button>
        <button
          type="button"
          onClick={handleExportarPdf}
          disabled={isExportingPdf}
          className="touch-target px-4 sm:px-5 py-3 rounded-xl bg-legal-gold text-legal-navy font-medium hover:bg-legal-gold/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm sm:text-base disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          {isExportingPdf ? 'Gerando...' : 'Exportar PDF'}
        </button>
        </div>
      </div>
    </div>
  );
}
