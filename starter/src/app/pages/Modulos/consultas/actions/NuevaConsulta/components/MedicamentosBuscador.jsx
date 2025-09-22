import { useState, Fragment } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Button } from "components/ui";

// Componente para la búsqueda de medicamentos en OpenFDA 
const MedicamentosBuscador = ({ onSelectMedicamento }) => { 
  const [query, setQuery] = useState(''); 
  const [resultados, setResultados] = useState([]); 
  const [cargando, setCargando] = useState(false);
  const [traduciendo, setTraduciendo] = useState(false);
  const [error, setError] = useState(null); 
  const [medicamentoSeleccionado, setMedicamentoSeleccionado] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  // Función para traducir texto de español a inglés usando Lingva local
  const traducirEsAEn = async (texto) => {
    if (!texto || texto === 'No disponible') return texto;
    
    try {
      setTraduciendo(true);
      // Usar localhost en lugar del nombre del contenedor
      const url = `http://lingva-translate:3001/api/v1/es/en/${encodeURIComponent(texto)}`;
      const respuesta = await fetch(url);
      
      if (!respuesta.ok) {
        throw new Error(`Error HTTP: ${respuesta.status}`);
      }
      
      const datos = await respuesta.json();
      return datos.translation || texto;
    } catch (error) {
      console.error('Error al traducir al inglés:', error);
      setError(`Error al traducir al inglés: ${error.message}`);
      return texto; // En caso de error, devolver el texto original
    } finally {
      setTraduciendo(false);
    }
  };

  // Función para traducir texto de inglés a español usando Lingva local
  const traducirEnAEs = async (texto) => {
    if (!texto || texto === 'No disponible') return texto;
    
    try {
      setTraduciendo(true);
      // Usar localhost en lugar del nombre del contenedor
      const url = `http://lingva-translate:3001/api/v1/en/es/${encodeURIComponent(texto)}`;
      const respuesta = await fetch(url);
      
      if (!respuesta.ok) {
        throw new Error(`Error HTTP: ${respuesta.status}`);
      }
      
      const datos = await respuesta.json();
      return datos.translation || texto;
    } catch (error) {
      console.error('Error al traducir al español:', error);
      setError(`Error al traducir al español: ${error.message}`);
      return texto; // En caso de error, devolver el texto original
    } finally {
      setTraduciendo(false);
    }
  };

  // Función para buscar medicamentos tanto en inglés como en español
  const buscarMedicamentos = async () => { 
    if (!query.trim()) return; 
    
    setCargando(true); 
    setError(null); 
    setResultados([]);
    
    try {
      // Intentar primero con la consulta original
      let resultadosEncontrados = await buscarEnOpenFDA(query);
      
      // Si no hay resultados, traducir y volver a intentar
      if (resultadosEncontrados.length === 0) {
        setError("Buscando alternativas...");
        const queryEnIngles = await traducirEsAEn(query);
        console.log('Traducción de consulta:', query, '->', queryEnIngles);
        
        if (queryEnIngles && queryEnIngles !== query) {
          resultadosEncontrados = await buscarEnOpenFDA(queryEnIngles);
        }
      }
      
      if (resultadosEncontrados.length > 0) {
        setResultados(resultadosEncontrados);
        setError(null);
      } else {
        setResultados([]);
        setError('No se encontraron medicamentos con ese nombre');
      }
    } catch (err) { 
      console.error('Error al buscar medicamentos:', err); 
      setError('Error al conectar con la API de OpenFDA o el servicio de traducción'); 
      setResultados([]); 
    } finally { 
      setCargando(false); 
    } 
  };
  
  // Función para buscar en OpenFDA
  const buscarEnOpenFDA = async (terminoBusqueda) => {
    
    let url = `https://api.fda.gov/drug/label.json?search=openfda.brand_name:"${encodeURIComponent(terminoBusqueda)}"&limit=5`; 
    
    let respuesta = await fetch(url);
    let datos = await respuesta.json();
    
   
    if (!datos.results || datos.results.length === 0) {
      url = `https://api.fda.gov/drug/label.json?search=openfda.brand_name:${encodeURIComponent(terminoBusqueda)}&limit=5`;
      respuesta = await fetch(url);
      datos = await respuesta.json();
    }
    
    if (datos.error) { 
      setError(await traducirEnAEs(datos.error.message)); 
      return [];
    } else if (datos.results && datos.results.length > 0) { 
      // Transformar y traducir los resultados
      const medicamentosPromesas = datos.results.map(async med => {
        // Extraer datos
        const nombre = med.openfda.brand_name?.[0] || 'Nombre no disponible';
        const generico = med.openfda.generic_name?.[0] || 'No disponible';
        const fabricante = med.openfda.manufacturer_name?.[0] || 'No disponible';
        const dosis = med.dosage_and_administration?.[0] || 'No disponible';
        const advertencias = med.warnings?.[0] || 'No disponible';
        const efectosAdversos = med.adverse_reactions?.[0] || 'No disponible';
        const contraindicaciones = med.contraindications?.[0] || 'No disponible';
        const interacciones = med.drug_interactions?.[0] || 'No disponible';
        const usoEnEmbarazo = med.pregnancy?.[0] || 'No disponible';
        const mecanismoDeAccion = med.mechanism_of_action?.[0] || 'No disponible';
        
        // Traducir los campos principales
        const [
          nombreTrad,
          genericoTrad,
          fabricanteTrad,
          dosisTrad,
          advertenciasTrad,
          efectosAdversosTrad,
          contraindicacionesTrad,
          interaccionesTrad,
          usoEnEmbarazoTrad,
          mecanismoDeAccionTrad
        ] = await Promise.all([
          traducirEnAEs(nombre),
          traducirEnAEs(generico),
          traducirEnAEs(fabricante),
          traducirEnAEs(dosis),
          traducirEnAEs(advertencias),
          traducirEnAEs(efectosAdversos),
          traducirEnAEs(contraindicaciones),
          traducirEnAEs(interacciones),
          traducirEnAEs(usoEnEmbarazo),
          traducirEnAEs(mecanismoDeAccion)
        ]);
        
        return { 
          id: med.id || med.openfda.application_number?.[0] || Math.random().toString(36).substring(7), 
          nombre: nombreTrad,
          generico: genericoTrad,
          fabricante: fabricanteTrad,
          dosis: dosisTrad,
          advertencias: advertenciasTrad,
          efectosAdversos: efectosAdversosTrad,
          contraindicaciones: contraindicacionesTrad,
          interacciones: interaccionesTrad,
          usoEnEmbarazo: usoEnEmbarazoTrad,
          mecanismoDeAccion: mecanismoDeAccionTrad,
          // Guardar también las versiones originales para referencia
          nombreOriginal: nombre
        }; 
      });
      
      return await Promise.all(medicamentosPromesas);
    } 
    
    return [];
  };

  const verDetalles = (medicamento) => {
    setMedicamentoSeleccionado(medicamento);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    // Esperar un poco antes de limpiar el medicamento seleccionado para evitar parpadeos
    setTimeout(() => {
      setMedicamentoSeleccionado(null);
    }, 300);
  };

  const agregarMedicamento = () => {
    if (medicamentoSeleccionado) {
      // Crear un objeto con solo el nombre y valores vacíos para las demás propiedades
      const medicamentoParaAgregar = {
        nombre: medicamentoSeleccionado.nombre,
        generico: "",
        fabricante: "",
        dosis: ""
      };
      
      // Pasar el objeto estructurado
      onSelectMedicamento(medicamentoParaAgregar);
      
      setModalAbierto(false);
      // Esperar un poco antes de limpiar el medicamento seleccionado para evitar parpadeos
      setTimeout(() => {
        setMedicamentoSeleccionado(null);
      }, 300);
    }
  };

  // Indicador de carga para mostrar durante la búsqueda
  const IndicadorCarga = () => (
    <div className="flex items-center justify-center py-4">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      <span className="ml-2 text-sm text-gray-600">Cargando...</span>
    </div>
  );

  return ( 
    <div className="mt-4 p-3 border rounded-md bg-gray-50 dark:bg-dark-800"> 
      <h4 className="text-sm font-medium mb-2">Buscar Medicamentos (OpenFDA)</h4> 
      <div className="flex gap-2 mb-3"> 
        <input 
          type="text" 
          value={query} 
          onChange={(e) => setQuery(e.target.value)} 
          placeholder="Nombre del medicamento..." 
          className="flex-1 px-3 py-2 border rounded-md dark:bg-dark-700 dark:border-dark-500" 
          onKeyPress={(e) => e.key === 'Enter' && buscarMedicamentos()} 
        /> 
        <Button 
          onClick={buscarMedicamentos} 
          disabled={cargando || traduciendo || !query.trim()} 
          loading={cargando}
          color="primary" 
          className="whitespace-nowrap" 
        > 
          {cargando ? 'Buscando...' : 'Buscar'} 
        </Button> 
      </div> 
      
      {error && error !== "Buscando alternativas..." && ( 
        <div className="text-error text-sm mb-3 p-2 bg-error/10 rounded-md"> 
          {error} 
        </div> 
      )} 
      
      {cargando && (
        <div className="text-sm mb-3 p-2 bg-primary/10 rounded-md">
          <IndicadorCarga />
        </div>
      )}
      
      {error === "Buscando alternativas..." && (
        <div className="text-sm mb-3 p-2 bg-warning/10 rounded-md">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-warning mr-2"></div>
            <span>Buscando alternativas...</span>
          </div>
        </div>
      )}
      
      {traduciendo && !cargando && (
        <div className="text-sm mb-3 p-2 bg-info/10 rounded-md">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-info mr-2"></div>
            <span>Traduciendo información...</span>
          </div>
        </div>
      )}
      
      {resultados.length > 0 && !cargando && !traduciendo && ( 
        <div className="border rounded-md overflow-hidden"> 
          <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-500"> 
            <thead className="bg-gray-100 dark:bg-dark-700"> 
              <tr> 
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-dark-300 uppercase tracking-wider">Nombre</th> 
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-dark-300 uppercase tracking-wider">Fabricante</th> 
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 dark:text-dark-300 uppercase tracking-wider">Acciones</th> 
              </tr> 
            </thead> 
            <tbody className="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-dark-500"> 
              {resultados.map((med) => ( 
                <tr key={med.id} className="hover:bg-gray-50 dark:hover:bg-dark-700/50"> 
                  <td className="px-3 py-2 whitespace-nowrap text-sm">
                    <div>
                      <div className="font-medium">{med.nombre}</div>
                      <div className="text-xs text-gray-500">{med.generico}</div>
                    </div>
                  </td> 
                  <td className="px-3 py-2 whitespace-nowrap text-sm">{med.fabricante}</td> 
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-center"> 
                    <button 
                      onClick={() => verDetalles(med)} 
                      className="px-3 py-1 bg-primary/10 text-primary rounded-md hover:bg-primary/20 text-sm font-medium" 
                    > 
                      Ver detalles 
                    </button> 
                  </td> 
                </tr> 
              ))} 
            </tbody> 
          </table> 
        </div> 
      )} 
      
      {/* Modal de detalles del medicamento */}
      <Transition appear show={modalAbierto} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5" onClose={cerrarModal}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="absolute inset-0 bg-gray-900/50 backdrop-blur transition-opacity dark:bg-black/30" />
          </TransitionChild>

          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel className="relative flex w-full max-w-2xl origin-top flex-col overflow-hidden rounded-lg bg-white transition-all duration-300 dark:bg-dark-700">
              <div className="flex items-center justify-between rounded-t-lg bg-gray-200 px-4 py-3 dark:bg-dark-800 sm:px-5">
                <DialogTitle as="h3" className="text-base font-medium text-gray-800 dark:text-dark-100">
                  {medicamentoSeleccionado?.nombre || 'Detalles del Medicamento'}
                </DialogTitle>
                <Button
                  onClick={cerrarModal}
                  variant="flat"
                  isIcon
                  className="size-7 rounded-full ltr:-mr-1.5 rtl:-ml-1.5"
                >
                  <XMarkIcon className="size-4.5" />
                </Button>
              </div>

              <div className="flex flex-col overflow-y-auto px-4 py-4 sm:px-5 max-h-[70vh]">
                {medicamentoSeleccionado ? (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-dark-100">Información General</h4>
                      <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Nombre</p>
                          <p className="mt-1 font-medium">{medicamentoSeleccionado.nombre}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Nombre Genérico</p>
                          <p className="mt-1 font-medium">{medicamentoSeleccionado.generico}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Fabricante</p>
                          <p className="mt-1 font-medium">{medicamentoSeleccionado.fabricante}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-dark-100">Dosificación</h4>
                      <p className="mt-1 text-sm whitespace-pre-line">{medicamentoSeleccionado.dosis}</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-dark-100">Advertencias</h4>
                      <p className="mt-1 text-sm whitespace-pre-line">{medicamentoSeleccionado.advertencias}</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-dark-100">Efectos Adversos</h4>
                      <p className="mt-1 text-sm whitespace-pre-line">{medicamentoSeleccionado.efectosAdversos}</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-dark-100">Contraindicaciones</h4>
                      <p className="mt-1 text-sm whitespace-pre-line">{medicamentoSeleccionado.contraindicaciones}</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-dark-100">Interacciones Medicamentosas</h4>
                      <p className="mt-1 text-sm whitespace-pre-line">{medicamentoSeleccionado.interacciones}</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-dark-100">Uso en Embarazo</h4>
                      <p className="mt-1 text-sm whitespace-pre-line">{medicamentoSeleccionado.usoEnEmbarazo}</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-dark-100">Mecanismo de Acción</h4>
                      <p className="mt-1 text-sm whitespace-pre-line">{medicamentoSeleccionado.mecanismoDeAccion}</p>
                    </div>
                  </div>
                ) : (
                  <IndicadorCarga />
                )}
              </div>

              <div className="flex justify-end space-x-3 px-4 py-4 sm:px-5">
                <Button
                  onClick={cerrarModal}
                  variant="outlined"
                  className="min-w-[7rem] rounded-full"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={agregarMedicamento}
                  color="primary"
                  className="min-w-[7rem] rounded-full"
                >
                  Agregar al Tratamiento
                </Button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </Dialog>
      </Transition>
    </div> 
  ); 
}; 

export default MedicamentosBuscador;