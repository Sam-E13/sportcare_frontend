import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import PropTypes from 'prop-types';
import { Button } from 'components/ui';
import { updateResponsable } from './api/responsable.api';

export function EditResponsableModal({ responsable, isOpen, onClose, onSuccess }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      nombre: responsable?.nombre || '',
      parentesco: responsable?.parentesco || '',
      telefono: responsable?.telefono || ''
    }
  });

  const onSubmit = async (data) => {
    try {
      const updatedResponsable = await updateResponsable(responsable.id, data);
      toast.success("Responsable actualizado correctamente");
      onSuccess(updatedResponsable);
      onClose();
    } catch (error) {
      toast.error(error.message || "Error al actualizar el responsable");
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-dark-700 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 dark:text-dark-100"
                >
                  Editar Responsable
                </Dialog.Title>

                <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-1">
                      Nombre
                    </label>
                    <input
                      type="text"
                      {...register('nombre', { required: 'Nombre es requerido' })}
                      className="w-full rounded-lg border border-gray-300 dark:border-dark-500 px-3 py-2 bg-white dark:bg-dark-800 text-gray-800 dark:text-dark-100"
                    />
                    {errors.nombre && (
                      <p className="mt-1 text-sm text-error dark:text-error-light">
                        {errors.nombre.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-1">
                      Parentesco
                    </label>
                    <input
                      type="text"
                      {...register('parentesco', { required: 'Parentesco es requerido' })}
                      className="w-full rounded-lg border border-gray-300 dark:border-dark-500 px-3 py-2 bg-white dark:bg-dark-800 text-gray-800 dark:text-dark-100"
                    />
                    {errors.parentesco && (
                      <p className="mt-1 text-sm text-error dark:text-error-light">
                        {errors.parentesco.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-1">
                      Teléfono
                    </label>
                    <input
                      type="text"
                      {...register('telefono')}
                      className="w-full rounded-lg border border-gray-300 dark:border-dark-500 px-3 py-2 bg-white dark:bg-dark-800 text-gray-800 dark:text-dark-100"
                    />
                  </div>

                  <div className="flex justify-end space-x-3 mt-6">
                    <Button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2"
                      variant="outline"
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      className="px-4 py-2"
                    >
                      Guardar Cambios
                    </Button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

EditResponsableModal.propTypes = {
  responsable: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired
};