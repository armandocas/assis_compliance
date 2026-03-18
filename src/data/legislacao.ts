export const LEGISLACAO_URLS: Record<string, string> = {
  lgpd: 'https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm',
  cdc: 'https://www.planalto.gov.br/ccivil_03/leis/l8078.htm',
};

export function obterUrlLegislacao(referencia: string): string | undefined {
  if (!referencia) return undefined;
  const ref = referencia.toLowerCase();
  if (ref.includes('lgpd') || ref.includes('lei 13.709')) return LEGISLACAO_URLS.lgpd;
  if (ref.includes('cdc') || ref.includes('lei 8.078') || ref.includes('decreto 7.962')) return LEGISLACAO_URLS.cdc;
  return undefined;
}
