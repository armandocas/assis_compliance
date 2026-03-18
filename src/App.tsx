import { useState } from 'react';
import type { ComponentType } from 'react';
import type { ChecklistResposta } from './types';
import { categorias, checklistLGPD, checklistCDC, checklistBoasPraticas, checklistMarketplace } from './data/checklists';
import { ChecklistCategoria } from './components/ChecklistCategoria';
import { Dashboard } from './components/Dashboard';
import { downloadRelatorio, downloadRelatorioPDF } from './utils/exportarRelatorio';
import { IconLock, IconScale, IconCheckCircle, IconStore, IconChart } from './icons';

type Tab = 'lgpd' | 'cdc' | 'boas_praticas' | 'marketplace' | 'dashboard';

const tabs: { id: Tab; label: string; Icon: ComponentType }[] = [
  { id: 'lgpd', label: 'LGPD', Icon: IconLock },
  { id: 'cdc', label: 'CDC', Icon: IconScale },
  { id: 'boas_praticas', label: 'Boas Práticas', Icon: IconCheckCircle },
  { id: 'marketplace', label: 'Marketplace', Icon: IconStore },
  { id: 'dashboard', label: 'Resultados', Icon: IconChart },
];

const STORAGE_RESPOSTAS = 'advocacia-compliance-respostas';
const STORAGE_EMPRESA = 'advocacia-compliance-empresa';

function App() {
  const [tabAtiva, setTabAtiva] = useState<Tab>('lgpd');
  const [respostas, setRespostas] = useState<Record<string, ChecklistResposta>>(() => {
    const salvo = localStorage.getItem(STORAGE_RESPOSTAS);
    return salvo ? JSON.parse(salvo) : {};
  });
  const [nomeEmpresa, setNomeEmpresa] = useState<string>(() => {
    return localStorage.getItem(STORAGE_EMPRESA) || '';
  });

  const handleResposta = (itemId: string, status: ChecklistResposta['status'], observacao?: string) => {
    const existente = respostas[itemId];
    const obsValor = observacao !== undefined ? (observacao.trim() || undefined) : existente?.observacao;
    const novas = {
      ...respostas,
      [itemId]: { itemId, status, ...(obsValor !== undefined && { observacao: obsValor }) },
    };
    setRespostas(novas);
    localStorage.setItem(STORAGE_RESPOSTAS, JSON.stringify(novas));
  };

  const handleNomeEmpresaChange = (valor: string) => {
    setNomeEmpresa(valor);
    localStorage.setItem(STORAGE_EMPRESA, valor);
  };

  const handleReset = () => {
    if (window.confirm('Deseja iniciar uma nova avaliação? Todas as respostas e o nome da empresa serão apagados.')) {
      setRespostas({});
      setNomeEmpresa('');
      localStorage.removeItem(STORAGE_RESPOSTAS);
      localStorage.removeItem(STORAGE_EMPRESA);
    }
  };

  const handleExportarTxt = () => downloadRelatorio(respostas, nomeEmpresa);
  const handleExportarPdf = () => downloadRelatorioPDF(respostas, nomeEmpresa);

  const lgpdCategorias = ['lgpd_politica', 'lgpd_consentimento', 'lgpd_direitos', 'lgpd_seguranca'];
  const cdcCategorias = ['cdc_informacao', 'cdc_vendas', 'cdc_pos_venda'];
  const bpCategorias = ['boas_praticas'];
  const marketplaceCategorias = ['marketplace_responsabilidade', 'marketplace_vendedores', 'marketplace_lgpd'];

  const getCategoriasEItens = () => {
    if (tabAtiva === 'lgpd') return { categoriasIds: lgpdCategorias, itens: checklistLGPD };
    if (tabAtiva === 'cdc') return { categoriasIds: cdcCategorias, itens: checklistCDC };
    if (tabAtiva === 'boas_praticas') return { categoriasIds: bpCategorias, itens: checklistBoasPraticas };
    if (tabAtiva === 'marketplace') return { categoriasIds: marketplaceCategorias, itens: checklistMarketplace };
    return { categoriasIds: [] as string[], itens: [] };
  };

  const renderConteudo = () => {
    if (tabAtiva === 'dashboard') {
      return (
        <Dashboard
          respostas={respostas}
          nomeEmpresa={nomeEmpresa}
          onExportarTxt={handleExportarTxt}
          onExportarPdf={handleExportarPdf}
          onReset={handleReset}
        />
      );
    }

    const { categoriasIds, itens } = getCategoriasEItens();

    return (
      <div className="space-y-6 sm:space-y-10">
        {categoriasIds.map((catId) => {
          const cat = categorias[catId];
          const itensCat = itens.filter((i) => i.categoria === catId);
          if (!cat || itensCat.length === 0) return null;
          return (
            <ChecklistCategoria
              key={catId}
              categoria={cat}
              itens={itensCat}
              respostas={respostas}
              onResposta={handleResposta}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="glass-bg-wrapper">
      <header className="sticky top-0 z-20 glass-subtle border-b border-white/[0.06] safe-area-padding">
        <div className="max-w-4xl mx-auto px-3 sm:px-6 py-3 sm:py-4 w-full">
          <div className="flex flex-col gap-4 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="min-w-0">
                <h1 className="font-serif text-lg sm:text-xl font-semibold text-white tracking-tight truncate">
                  Assistente de Compliance
                </h1>
                <p className="text-xs text-neutral-400 truncate">E-commerce e Marketplace • LGPD • CDC</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
                <input
                  type="text"
                  value={nomeEmpresa}
                  onChange={(e) => handleNomeEmpresaChange(e.target.value)}
                  placeholder="Nome da empresa"
                  aria-label="Nome da empresa em análise"
                  className="touch-target w-full sm:w-48 px-3 py-3 sm:py-2.5 rounded-lg glass-subtle border border-white/10 text-base sm:text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-legal-gold/50 focus:border-legal-gold/50"
                />
                <button
                  type="button"
                  onClick={handleReset}
                  aria-label="Iniciar nova avaliação"
                  className="touch-target px-4 py-3 sm:py-2.5 rounded-lg glass-subtle border border-white/10 text-neutral-400 text-sm font-medium hover:text-legal-gold hover:border-legal-gold/30 transition-colors"
                >
                  Nova avaliação
                </button>
              </div>
            </div>
          <nav className="flex flex-wrap sm:flex-nowrap gap-2 overflow-x-auto sm:overflow-x-visible pb-1 -mx-1 px-1 scrollbar-hide sm:snap-x sm:snap-mandatory min-w-0 w-full" role="tablist">
            {tabs.map((tab) => {
              const Icon = tab.Icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={tabAtiva === tab.id}
                  aria-label={`Aba ${tab.label}`}
                  onClick={() => setTabAtiva(tab.id)}
                  className={`
                    touch-target sm:snap-start px-3 sm:px-4 py-3 sm:py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2 min-w-[44px] flex-shrink-0
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-legal-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f1419]
                    ${tabAtiva === tab.id
                      ? 'bg-legal-gold/15 text-legal-gold border border-legal-gold/30'
                      : 'glass-subtle text-neutral-500 border border-white/10 hover:text-neutral-300 hover:bg-white/5'
                    }
                  `}
                >
                  <Icon />
                  {tab.label}
                </button>
              );
            })}
          </nav>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-8 safe-area-bottom" role="main">
        {tabAtiva !== 'dashboard' && (
          <div className="mb-6 sm:mb-8 p-3 sm:p-4 rounded-xl glass-subtle border border-white/[0.06]">
            <p className="text-neutral-400 text-sm">
              {tabAtiva === 'lgpd' && 'Avalie a conformidade do e-commerce com a Lei Geral de Proteção de Dados (Lei 13.709/2018).'}
              {tabAtiva === 'cdc' && 'Verifique a adequação às normas do Código de Defesa do Consumidor (Lei 8.078/1990).'}
              {tabAtiva === 'boas_praticas' && 'Confira as boas práticas recomendadas para lojas virtuais.'}
              {tabAtiva === 'marketplace' && 'Avalie requisitos específicos de marketplaces: responsabilidade solidária, identificação de vendedores, Decreto 7.962/2013 e LGPD para compartilhamento de dados.'}
            </p>
          </div>
        )}
        {renderConteudo()}
      </main>

      <footer className="relative z-10 mt-12 sm:mt-16 glass-subtle border-t border-white/[0.06] safe-area-bottom">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-5 sm:py-6 text-center text-xs text-neutral-500">
          <p>Ferramenta de apoio para escritórios de advocacia • E-commerce e Marketplace</p>
          <p className="mt-1">As orientações não substituem consultoria jurídica especializada.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
