const FreteService = require('../src/services/FreteService');

describe('FreteService.calcular', () => {
  const base = {
    distanciaKm:     100,
    valorPedagio:    50,
    pesoKg:          5000,
    capacidadeCarga: 10000,
    tipoMercadoria:  'GERAL',
  };

  it('calcula frete básico corretamente', () => {
    const r = FreteService.calcular(base);
    // fatorPeso = 5000/10000 = 0.5
    // valorBase = 100 * 2.5 * 1.5 = 375
    // adicional = 0 (GERAL)
    // total = 375 + 50 + 0 = 425
    expect(r.valorBase).toBe(375);
    expect(r.valorPedagio).toBe(50);
    expect(r.adicionalCarga).toBe(0);
    expect(r.valorTotal).toBe(425);
  });

  it('aplica adicional 30% para carga PERIGOSA', () => {
    const r = FreteService.calcular({ ...base, tipoMercadoria: 'PERIGOSA' });
    expect(r.adicionalCarga).toBe(Number((375 * 0.30).toFixed(2)));
    expect(r.valorTotal).toBe(Number((375 + 50 + 375 * 0.30).toFixed(2)));
  });

  it('aplica adicional 20% para carga PERECIVEL', () => {
    const r = FreteService.calcular({ ...base, tipoMercadoria: 'PERECIVEL' });
    expect(r.adicionalCarga).toBe(Number((375 * 0.20).toFixed(2)));
  });

  it('aplica adicional 15% para carga FRAGIL', () => {
    const r = FreteService.calcular({ ...base, tipoMercadoria: 'FRAGIL' });
    expect(r.adicionalCarga).toBe(Number((375 * 0.15).toFixed(2)));
  });

  it('aplica adicional 5% para carga GRANEL', () => {
    const r = FreteService.calcular({ ...base, tipoMercadoria: 'GRANEL' });
    expect(r.adicionalCarga).toBe(Number((375 * 0.05).toFixed(2)));
  });

  it('limita fatorPeso a 1 quando peso excede capacidade', () => {
    const r = FreteService.calcular({ ...base, pesoKg: 15000, capacidadeCarga: 10000 });
    // fatorPeso = min(15000/10000, 1) = 1
    // valorBase = 100 * 2.5 * 2 = 500
    expect(r.valorBase).toBe(500);
  });

  it('sem pedágio retorna valorPedagio zero', () => {
    const r = FreteService.calcular({ ...base, valorPedagio: 0 });
    expect(r.valorPedagio).toBe(0);
  });
});
