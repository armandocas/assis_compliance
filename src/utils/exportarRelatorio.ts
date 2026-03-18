import type { ChecklistResposta } from '../types';
import { categorias, todosItens } from '../data/checklists';
import { jsPDF } from 'jspdf';

const statusLabels: Record<string, string> = {
  sim: 'Sim',
  parcial: 'Parcial',
  nao: 'Não',
  nao_aplicavel: 'N/A',
};

function obterNomeArquivoDataBR(): string {
  const now = new Date();
  const dia = String(now.getDate()).padStart(2, '0');
  const mes = String(now.getMonth() + 1).padStart(2, '0');
  const ano = now.getFullYear();
  return `${dia}-${mes}-${ano}`;
}

function sanitizarNomeArquivo(nome: string): string {
  return nome
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase()
    .slice(0, 50) || 'avaliacao';
}

const sugestoesAdvocaticias: Record<string, string> = {
  lgpd_1: 'Recomenda-se revisar a Política de Privacidade para incluir identificação do controlador e DPO, sob pena de sanções da ANPD (Art. 52 LGPD).',
  lgpd_2: 'Sugere-se detalhar na Política todos os dados coletados por categoria e finalidade, em conformidade com o Art. 9º LGPD.',
  lgpd_3: 'Recomenda-se especificar cada finalidade de tratamento, evitando termos genéricos que podem ser considerados vagos pela ANPD.',
  lgpd_4: 'Sugere-se documentar formalmente o compartilhamento com terceiros, incluindo base legal e finalidades (Art. 7º, V LGPD).',
  lgpd_5: 'Recomenda-se definir prazos de retenção por categoria de dado e descrever medidas de segurança na Política.',
  lgpd_6: 'Sugere-se implementar banner de cookies com opção de aceitar/recusar antes da coleta, em conformidade com o Art. 8º LGPD.',
  lgpd_7: 'Recomenda-se informar ao usuário tipo, finalidade e duração de cada categoria de cookie.',
  lgpd_8: 'Sugere-se criar canal (e-mail ou formulário) para exercício dos direitos do Art. 18, com prazo de 15 dias para resposta.',
  lgpd_9: 'Recomenda-se garantir que a revogação do consentimento seja tão acessível quanto sua concessão.',
  lgpd_10: 'Sugere-se elaborar procedimento interno para notificação à ANPD e titulares em até 72h em caso de incidente.',
  lgpd_11: 'Recomenda-se manter Registro das Atividades de Tratamento (RAT) ou documento equivalente.',
  lgpd_12: 'Sugere-se auditar a coleta de dados e eliminar aqueles não estritamente necessários.',
  cdc_1: 'Recomenda-se revisar descrições, fotos e preços para evitar vício de informação (Art. 6º, III CDC).',
  cdc_2: 'Sugere-se exibir o valor total incluindo frete e taxas antes da conclusão da compra.',
  cdc_3: 'Recomenda-se estabelecer prazo claro de entrega e política para atrasos, conforme Art. 18 CDC.',
  cdc_4: 'Sugere-se revisar Termos de Uso com advogado para eliminar cláusulas abusivas e garantir linguagem clara.',
  cdc_5: 'Recomenda-se informar explicitamente o direito de arrependimento em 7 dias (Art. 49 CDC).',
  cdc_6: 'Sugere-se informar a garantia legal de 90 dias para bens duráveis de forma visível.',
  cdc_7: 'Recomenda-se implementar ou reforçar SAC com prazo de resposta de até 5 dias úteis.',
  cdc_8: 'Sugere-se documentar o fluxo de reclamações e resolução de disputas.',
  bp_1: 'Recomenda-se ativar certificado SSL (HTTPS) imediatamente para segurança e credibilidade.',
  bp_2: 'Sugere-se simplificar o checkout reduzindo etapas desnecessárias.',
  bp_3: 'Recomenda-se publicar política de frete com prazos, valores e regiões de atendimento.',
  bp_4: 'Sugere-se informar claramente métodos de pagamento aceitos e condições de parcelamento.',
  bp_5: 'Recomenda-se enviar e-mail de confirmação com itens, valores, prazo e dados de rastreio.',
  bp_6: 'Sugere-se garantir que o site funcione adequadamente em dispositivos móveis.',
  mp_1: 'Recomenda-se exibir razão social e CNPJ do vendedor de forma visível (Decreto 7.962/2013).',
  mp_2: 'Sugere-se diferenciar visualmente vendas da plataforma e de terceiros para transparência.',
  mp_3: 'Recomenda-se formalizar contrato com vendedores incluindo cláusula de regresso (Art. 25, §1º CDC).',
  mp_4: 'Sugere-se documentar base legal e informar titulares sobre compartilhamento com vendedores.',
  mp_5: 'Recomenda-se incluir DPA ou cláusulas de proteção de dados nos contratos com vendedores.',
  mp_6: 'Sugere-se definir no processo de disputa quem responde ao consumidor e em qual prazo.',
  mp_7: 'Recomenda-se tornar transparentes comissões e taxas nos termos com vendedores.',
  mp_8: 'Sugere-se atualizar Política de Privacidade especificando dados compartilhados com vendedores.',
  mp_9: 'Recomenda-se disponibilizar endereço e contato do vendedor ao consumidor (Art. 42-A CDC).',
  mp_10: 'Sugere-se implementar processo de onboarding que verifique CNPJ e documentação dos vendedores.',
};

export function obterItensComSugestao(respostas: Record<string, ChecklistResposta>) {
  return todosItens.filter((item) => {
    const resp = respostas[item.id];
    return resp && (resp.status === 'nao' || resp.status === 'parcial') && sugestoesAdvocaticias[item.id];
  });
}

export function obterSugestao(itemId: string): string | undefined {
  return sugestoesAdvocaticias[itemId];
}

export function gerarRelatorioTexto(respostas: Record<string, ChecklistResposta>, nomeEmpresa = ''): string {
  const data = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  let relatorio = `RELATÓRIO DE COMPLIANCE - E-COMMERCE E MARKETPLACE\n`;
  relatorio += `=====================================\n`;
  if (nomeEmpresa.trim()) relatorio += `Empresa: ${nomeEmpresa.trim()}\n`;
  relatorio += `Data da avaliação: ${data}\n\n`;

  const itensPorCategoria = todosItens.reduce<Record<string, typeof todosItens>>((acc, item) => {
    if (!acc[item.categoria]) acc[item.categoria] = [];
    acc[item.categoria].push(item);
    return acc;
  }, {});

  for (const [catId, itens] of Object.entries(itensPorCategoria)) {
    const cat = categorias[catId];
    if (!cat) continue;

    relatorio += `\n## ${cat.nome}\n`;
    relatorio += `${cat.descricao}\n\n`;

    for (const item of itens) {
      const resp = respostas[item.id];
      const status = resp ? statusLabels[resp.status] : '-';
      relatorio += `[${status}] ${item.pergunta}\n`;
      if (item.referencia) relatorio += `    Ref: ${item.referencia}\n`;
      if (resp?.observacao) relatorio += `    Obs: ${resp.observacao}\n`;
      relatorio += `\n`;
    }
  }

  const total = todosItens.length;
  const respondidos = Object.keys(respostas).length;
  const sim = Object.values(respostas).filter((r) => r.status === 'sim').length;
  const parcial = Object.values(respostas).filter((r) => r.status === 'parcial').length;
  const nao = Object.values(respostas).filter((r) => r.status === 'nao').length;

  relatorio += `\n=====================================\n`;
  relatorio += `RESUMO\n`;
  relatorio += `Itens respondidos: ${respondidos}/${total}\n`;
  relatorio += `Conformes (Sim): ${sim}\n`;
  relatorio += `Parciais: ${parcial}\n`;
  relatorio += `Não conformes: ${nao}\n\n`;

  const itensComSugestao = todosItens.filter((item) => {
    const resp = respostas[item.id];
    return resp && (resp.status === 'nao' || resp.status === 'parcial') && sugestoesAdvocaticias[item.id];
  });
  if (itensComSugestao.length > 0) {
    relatorio += `SUGESTÕES ADVOCATÍCIAS\n`;
    relatorio += `-------------------------------------\n`;
    itensComSugestao.forEach((item, idx) => {
      const resp = respostas[item.id];
      relatorio += `\n${idx + 1}. [${resp ? statusLabels[resp.status] : '-'}] ${item.pergunta}\n`;
      relatorio += `   * ${sugestoesAdvocaticias[item.id]}\n`;
    });
    relatorio += `\n`;
  }

  relatorio += `\n---\n`;
  relatorio += `Gerado por Assistente de Compliance E-commerce e Marketplace\n`;

  return relatorio;
}

export function downloadRelatorio(respostas: Record<string, ChecklistResposta>, nomeEmpresa = '') {
  const conteudo = gerarRelatorioTexto(respostas, nomeEmpresa);
  const blob = new Blob([conteudo], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const sufixo = nomeEmpresa.trim() ? `${sanitizarNomeArquivo(nomeEmpresa)}-` : '';
  a.download = `relatorio-compliance-${sufixo}${obterNomeArquivoDataBR()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadRelatorioPDF(respostas: Record<string, ChecklistResposta>, nomeEmpresa = '') {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const margin = 20;
  const footerHeight = 15;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const maxWidth = pageWidth - margin * 2;
  let y = 20;

  const data = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  // Header com accent dourado (legal-gold)
  const gold = { r: 201, g: 162, b: 39 };
  doc.setDrawColor(gold.r, gold.g, gold.b);
  doc.setLineWidth(1.5);
  doc.line(margin, 14, pageWidth - margin, 14);

  // Ícone de compliance: badge escuro com checkmark dourado (conformidade)
  const iconX = margin;
  const iconY = 18;
  const iconSize = 10;
  doc.setFillColor(15, 15, 22);
  doc.rect(iconX, iconY, iconSize, iconSize, 'F');
  doc.setDrawColor(gold.r, gold.g, gold.b);
  doc.setLineWidth(1.2);
  doc.setLineCap('round');
  doc.setLineJoin('round');
  doc.line(iconX + 2.5, iconY + 5, iconX + 4.5, iconY + 7.5);
  doc.line(iconX + 4.5, iconY + 7.5, iconX + 7.5, iconY + 2.5);

  // Título ao lado do ícone
  const titleX = iconX + iconSize + 6;
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('RELATÓRIO DE COMPLIANCE', titleX, y);
  y += 8;
  doc.setFontSize(14);
  doc.text('E-COMMERCE E MARKETPLACE', titleX, y);
  y += 8;

  // Segunda linha dourada fechando o bloco do título
  doc.setDrawColor(gold.r, gold.g, gold.b);
  doc.setLineWidth(0.8);
  doc.line(margin, y + 2, pageWidth - margin, y + 2);
  y += 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  if (nomeEmpresa.trim()) {
    doc.text(`Empresa: ${nomeEmpresa.trim()}`, margin, y);
    y += 6;
  }
  doc.text(`Data da avaliação: ${data}`, margin, y);
  doc.setTextColor(0, 0, 0);
  y += 15;

  const itensPorCategoria = todosItens.reduce<Record<string, typeof todosItens>>((acc, item) => {
    if (!acc[item.categoria]) acc[item.categoria] = [];
    acc[item.categoria].push(item);
    return acc;
  }, {});

  const addPageIfNeeded = (needed: number) => {
    if (y + needed > pageHeight - margin - footerHeight) {
      doc.addPage();
      y = margin;
    }
  };

  for (const [catId, itens] of Object.entries(itensPorCategoria)) {
    const cat = categorias[catId];
    if (!cat) continue;

    addPageIfNeeded(25);

    // Cabeçalho da categoria com accent dourado
    doc.setFillColor(gold.r, gold.g, gold.b);
    doc.rect(margin, y - 4, 2, 6, 'F');
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(cat.nome, margin + 5, y);
    y += 6;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    const descLines = doc.splitTextToSize(cat.descricao, maxWidth);
    doc.text(descLines, margin, y);
    y += descLines.length * 5 + 4;
    doc.setTextColor(0, 0, 0);

    for (const item of itens) {
      addPageIfNeeded(15);

      const resp = respostas[item.id];
      const status = resp ? statusLabels[resp.status] : '-';
      const textoCompleto = `[${status}] ${item.pergunta}`;

      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      const perguntaLines = doc.splitTextToSize(textoCompleto, maxWidth);
      doc.text(perguntaLines, margin, y);
      doc.setFont('helvetica', 'normal');
      y += perguntaLines.length * 5 + 2;

      if (item.referencia) {
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text(`Ref: ${item.referencia}`, margin, y);
        doc.setTextColor(0, 0, 0);
        y += 5;
      }
      if (resp?.observacao) {
        doc.setFontSize(8);
        doc.setTextColor(80, 80, 80);
        const obsLines = doc.splitTextToSize(`Obs: ${resp.observacao}`, maxWidth);
        doc.text(obsLines, margin, y);
        doc.setTextColor(0, 0, 0);
        y += obsLines.length * 4 + 2;
      }
      y += 3;
    }
    y += 5;
  }

  // Resumo (separador e accent dourado)
  addPageIfNeeded(40);
  y += 5;
  doc.setDrawColor(gold.r, gold.g, gold.b);
  doc.setLineWidth(0.8);
  doc.line(margin, y, pageWidth - margin, y);
  y += 10;

  doc.setFillColor(gold.r, gold.g, gold.b);
  doc.rect(margin, y - 4, 2, 6, 'F');
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('RESUMO', margin + 5, y);
  y += 8;

  const total = todosItens.length;
  const respondidos = Object.keys(respostas).length;
  const sim = Object.values(respostas).filter((r) => r.status === 'sim').length;
  const parcial = Object.values(respostas).filter((r) => r.status === 'parcial').length;
  const nao = Object.values(respostas).filter((r) => r.status === 'nao').length;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Itens respondidos: ${respondidos}/${total}`, margin, y);
  y += 6;
  doc.text(`Conformes (Sim): ${sim}`, margin, y);
  y += 6;
  doc.text(`Parciais: ${parcial}`, margin, y);
  y += 6;
  doc.text(`Não conformes: ${nao}`, margin, y);
  y += 12;

  const itensComSugestao = todosItens.filter((item) => {
    const resp = respostas[item.id];
    return resp && (resp.status === 'nao' || resp.status === 'parcial') && sugestoesAdvocaticias[item.id];
  });
  if (itensComSugestao.length > 0) {
    addPageIfNeeded(30);
    y += 8;
    doc.setFillColor(gold.r, gold.g, gold.b);
    doc.rect(margin, y - 4, 2, 6, 'F');
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('SUGESTÕES ADVOCATÍCIAS', margin + 5, y);
    y += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    itensComSugestao.forEach((item, idx) => {
      addPageIfNeeded(20);
      const resp = respostas[item.id];
      doc.setFont('helvetica', 'bold');
      const tituloSug = `${idx + 1}. [${resp ? statusLabels[resp.status] : '-'}] ${item.pergunta}`;
      const tituloLines = doc.splitTextToSize(tituloSug, maxWidth);
      doc.text(tituloLines, margin, y);
      y += tituloLines.length * 5 + 2;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(60, 60, 60);
      const sugestaoLines = doc.splitTextToSize(`- ${sugestoesAdvocaticias[item.id]}`, maxWidth);
      doc.text(sugestaoLines, margin, y);
      y += sugestaoLines.length * 5 + 2;
      if (resp?.observacao) {
        const obsLines = doc.splitTextToSize(`Obs: ${resp.observacao}`, maxWidth);
        doc.text(obsLines, margin, y);
        y += obsLines.length * 4 + 2;
      }
      doc.setTextColor(0, 0, 0);
      y += 6;
    });
    y += 4;
  }

  y += 8;
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text('Gerado por Assistente de Compliance E-commerce e Marketplace', margin, y);
  doc.text('As orientações não substituem consultoria jurídica especializada.', margin, y + 4);

  // Padrão visual em todas as páginas: linha dourada no topo, acima do rodapé e numeração
  const totalPaginas = doc.getNumberOfPages();
  for (let i = 1; i <= totalPaginas; i++) {
    doc.setPage(i);
    // Linha dourada no topo (reforça identidade em todas as páginas)
    doc.setDrawColor(gold.r, gold.g, gold.b);
    doc.setLineWidth(1.5);
    doc.line(margin, 14, pageWidth - margin, 14);
    // Linha dourada acima do rodapé
    doc.setLineWidth(0.6);
    doc.line(margin, pageHeight - 18, pageWidth - margin, pageHeight - 18);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(120, 120, 120);
    const textoPagina = `Página ${i} de ${totalPaginas}`;
    doc.text(textoPagina, pageWidth / 2, pageHeight - 10, { align: 'center' });
    if (nomeEmpresa.trim()) {
      doc.text(nomeEmpresa.trim(), margin, pageHeight - 10);
    }
    doc.setTextColor(0, 0, 0);
  }

  const sufixo = nomeEmpresa.trim() ? `${sanitizarNomeArquivo(nomeEmpresa)}-` : '';
  doc.save(`relatorio-compliance-${sufixo}${obterNomeArquivoDataBR()}.pdf`);
}
