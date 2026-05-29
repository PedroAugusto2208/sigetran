const VALOR_KM = 2.50;

const ADICIONAL_TIPO = {
  PERIGOSA:  0.30,
  PERECIVEL: 0.20,
  FRAGIL:    0.15,
  GRANEL:    0.05,
  GERAL:     0.00,
};

function calcular({ distanciaKm, valorPedagio, pesoKg, capacidadeCarga, tipoMercadoria }) {
  const fatorPeso   = Math.min(pesoKg / capacidadeCarga, 1);
  const valorBase   = distanciaKm * VALOR_KM * (1 + fatorPeso);
  const pedagio     = Number(valorPedagio) || 0;
  const adicional   = valorBase * (ADICIONAL_TIPO[tipoMercadoria] || 0);
  const valorTotal  = valorBase + pedagio + adicional;

  return {
    valorBase:      Number(valorBase.toFixed(2)),
    valorPedagio:   Number(pedagio.toFixed(2)),
    adicionalCarga: Number(adicional.toFixed(2)),
    valorTotal:     Number(valorTotal.toFixed(2)),
  };
}

module.exports = { calcular, VALOR_KM, ADICIONAL_TIPO };
