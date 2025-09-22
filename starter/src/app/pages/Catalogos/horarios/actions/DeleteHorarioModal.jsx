import { useState } from "react";
import { ConfirmModal } from "components/shared/ConfirmModal";
import { toast } from "sonner";
import PropTypes from "prop-types";

const customMessages = {
  pending: {
    title: "¿Estás seguro?",
    description: "¿Estás seguro de que deseas eliminar este horario? Una vez eliminado, no se puede recuperar.",
    actionText: "Eliminar"
  },
  success: {
    title: "Horario Eliminado",
    description: "El horario ha sido eliminado correctamente.",
    actionText: "Hecho"
  },
  error: {
    title: "Error al Eliminar",
    description: "Ocurrió un error al intentar eliminar el horario.",
    actionText: "Reintentar"
  }
};

export function DeleteHorarioAction({ onDelete, onClose, isOpen }) {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("pending");

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await onDelete();
      setStatus("success");
      toast.success("Horario eliminado correctamente");
      // NO cerramos el modal aquí, dejamos que el usuario vea el mensaje de éxito
    } catch (error) {
      console.error("Error eliminando horario:", error);
      setStatus("error");
      toast.error("OOPS! Ocurrió un error al eliminar el horario");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
      // Reset status después de un pequeño delay para permitir la animación de cierre
      setTimeout(() => setStatus("pending"), 300);
    }
  };

  const handleOk = () => {
    if (status === "pending") {
      handleDelete();
    } else if (status === "error") {
      handleDelete(); // Retry
    } else if (status === "success") {
      // En estado de éxito, el botón "Hecho" cierra el modal
      handleClose();
    }
  };

  return (
    <ConfirmModal
      show={isOpen}
      onClose={handleClose}
      onOk={handleOk}
      confirmLoading={isLoading}
      state={status}
      messages={customMessages}
    />
  );
}

DeleteHorarioAction.propTypes = {
  onDelete: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired
};