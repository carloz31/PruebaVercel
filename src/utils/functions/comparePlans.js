// comparePlans.js
const comparePlans = (gruposOriginales, gruposEditados) => {
  const seQuedan = [];
  const seModifican = [];
  const seEliminan = [];
  const seCrean = [];

  const findCompromisoById = (compromisos, id) =>
    compromisos.find((compromiso) => compromiso.id === id);

  // Verificar grupos originales vs grupos editados
  gruposOriginales.forEach((grupoOriginal) => {
    const grupoEditado = gruposEditados.find(
      (grupo) => grupo.id === grupoOriginal.id,
    );

    if (!grupoEditado) {
      seEliminan.push(grupoOriginal);
    } else if (JSON.stringify(grupoOriginal) !== JSON.stringify(grupoEditado)) {
      const compromisosSeQuedan = [];
      const compromisosSeModifican = [];
      const compromisosSeEliminan = [];
      const compromisosSeCrean = [];

      // Comparar compromisos dentro del grupo
      grupoOriginal.compromisos.forEach((compromisoOriginal) => {
        const compromisoEditado = findCompromisoById(
          grupoEditado.compromisos,
          compromisoOriginal.id,
        );
        if (!compromisoEditado) {
          compromisosSeEliminan.push(compromisoOriginal);
        } else if (
          JSON.stringify(compromisoOriginal) !==
          JSON.stringify(compromisoEditado)
        ) {
          compromisosSeModifican.push(compromisoEditado);
        } else {
          compromisosSeQuedan.push(compromisoEditado);
        }
      });

      grupoEditado.compromisos.forEach((compromisoEditado) => {
        if (
          !findCompromisoById(grupoOriginal.compromisos, compromisoEditado.id)
        ) {
          compromisosSeCrean.push(compromisoEditado);
        }
      });

      seModifican.push({
        grupo: grupoEditado,
        compromisosSeQuedan,
        compromisosSeModifican,
        compromisosSeEliminan,
        compromisosSeCrean,
      });
    } else {
      seQuedan.push(grupoEditado);
    }
  });

  // Verificar grupos creados
  gruposEditados.forEach((grupoEditado) => {
    if (!gruposOriginales.find((grupo) => grupo.id === grupoEditado.id)) {
      seCrean.push(grupoEditado);
    }
  });

  return { seQuedan, seModifican, seEliminan, seCrean };
};

export default comparePlans;
