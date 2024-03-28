
import { toast } from "react-toastify";
import ToastSuccess from '../Toast/success'
import ToastError from '../Toast/error'
import ToastWarning from '../Toast/warning'
import ToastPending from '../Toast/pending'
import CloseButton from "../Toast/close-button";

const g_style = {
  padding: 0,
  borderRadius: '12px',
}

const g_options = {
  progressStyle: {
    height: '4px',
    background: '#fff',
  }
}

export const optionsSuccess = {
  style: {
    ...g_style,
    border: '1px solid rgba(89, 210, 115, 1)',
    background: 'rgb(39 79 48)'
  },
  closeButton: <CloseButton />
}

export const toastSuccess = (title) => {
  return toast(<ToastSuccess title={title} />, { ...g_options, ...optionsSuccess })
}

export const optionsError = {
  style: {
    ...g_style,
    border: '1px solid #F35A58',
    background: '#662626'
  },
  closeButton: <CloseButton />
}

export const toastError = (title) => {
  return toast(<ToastError title={title} />, { ...g_options, ...optionsError })
}

export const optionsWarning = {
  style: {
    ...g_style,
    border: '1px solid #FFD479',
    background: '#62512f'
  },
  closeButton: <CloseButton />
}

export const toastWarning = (title) => {
  return toast(<ToastWarning title={title} />, { ...g_options, ...optionsWarning })
}

export const optionsPending = {
  style: {
    ...g_style,
    border: '1px solid #ffffff',
    background: '#000'
  },
  closeButton: <CloseButton />
}

export const toastPending = (title) => {

  return toast(<ToastPending title={title} />, { ...g_options, ...optionsPending, autoClose: false })
}

export const toastUpdateSuccess = (loading, title) => {
  toast.update(
    loading,
    { render: <ToastSuccess title={title} />, ...g_options, ...optionsSuccess, autoClose: 5000 },
  );
}

export const toastUpdateError = (loading, title) => {
  toast.update(
    loading,
    { render: <ToastError title={title} />, ...g_options, ...optionsError, autoClose: 5000 },
  );
}

export const toastUpdateWarning = (loading, title) => {
  toast.update(
    loading,
    { render: <ToastWarning title={title} />, ...g_options, ...optionsWarning, autoClose: 5000 },
  );
}