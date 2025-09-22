export const EstudiosList = ({ estudios, onRemove }) => {
    const tiposEstudio = [
        { value: "LAB", label: "Análisis de Laboratorio" },
        { value: "IMG", label: "Estudio de Imagen" },
        { value: "CAR", label: "Cardiología" },
        { value: "NEU", label: "Neurológico" },
        { value: "ODO", label: "Odontológico" },
        { value: "OFT", label: "Oftalmológico" },
        { value: "OTR", label: "Otros" },
      ];


    if (estudios.length === 0) {
      return (
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-4 text-center text-gray-500">
          No hay estudios agregados
        </div>
      );
    }
  
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Estudios Agregados ({estudios.length})</h3>
        <div className="space-y-3">
          {estudios.map((estudio) => ( // Changed index to estudio.id for key
            <div key={estudio.id} className="rounded-lg border p-4"> {/* Use client-side temporary ID */}
              <div className="flex justify-between">
                <div>
                  <h4 className="font-medium">
                    {estudio.tipo_estudio && tiposEstudio.find(t => t.value === estudio.tipo_estudio)?.label}
                    {estudio.nombre && ` - ${estudio.nombre}`}
                  </h4>
                  <p className="text-sm text-gray-500">
                    Fecha Realización: {estudio.fecha_realizacion}
                  </p>
                  {estudio.fecha_entrega && (
                     <p className="text-sm text-gray-500">
                        Fecha Entrega: {estudio.fecha_entrega}
                    </p>
                  )}
                   {estudio.archivo && (
                     <p className="text-sm text-gray-500">
                        Archivo: {estudio.archivo.name}
                        {estudio.archivo.isExisting && (
                          <span className="ml-2 text-xs text-blue-600">(Existente)</span>
                        )}
                        {estudio.archivo.url && estudio.archivo.isExisting && (
                          <a
                            href={estudio.archivo.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 text-xs text-blue-600 hover:text-blue-800 underline"
                          >
                            Ver archivo
                          </a>
                        )}
                    </p>
                  )}
                </div>
                <button 
                  onClick={() => onRemove(estudio.id)} // Pass ID for removal
                  className="text-red-500 hover:text-red-700"
                >
                  Eliminar
                </button>
              </div>
              {estudio.resultado && (
                <p className="mt-2 text-sm">{estudio.resultado}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };