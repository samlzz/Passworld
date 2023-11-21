/* eslint-disable no-param-reassign */
import { AxiosError } from 'axios';
import Swal from 'sweetalert2';

export function ErrorAlert(text: string) {
    Swal.fire({
        title: 'Error',
        text,
        icon: 'error',
        background: '#141B2F',
        color: '#FFFFFFCC',
    });
}

export function AxiosErrAlert(error: AxiosError) {
    console.warn(error);
    if (error.response?.statusText)
        Swal.fire({
            title: 'Error',
            text: error.response?.statusText,
            icon: 'error',
            background: '#141B2F',
            color: '#FFFFFFCC',
        });
    else
        Swal.fire({
            title: 'Error',
            text: error.message,
            icon: 'error',
            background: '#141B2F',
            color: '#FFFFFFCC',
        });
}

export function CatchErrorAlert(error: AxiosError) {
    console.log(error);
    const data = error.response?.data as { err: string };
    if (data?.err) {
        ErrorAlert(data.err);
    } else {
        AxiosErrAlert(error);
    }
}

const Toast = Swal.mixin({
    toast: true,
    position: 'bottom-start',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
    },
});
export function GoodAlert(title: string) {
    Toast.fire({
        icon: 'success',
        title,
        background: '#141B2F',
        color: '#FFFFFFCC',
    });
}

const Tist = Swal.mixin({
    toast: true,
    position: 'bottom-start',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
    },
});
export function BadAlert(title: string) {
    Tist.fire({
        icon: 'error',
        title,
        background: '#141B2F',
        color: '#FFFFFFCC',
    });
}
