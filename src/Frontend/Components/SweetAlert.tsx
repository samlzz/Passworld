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
    Swal.fire({
        title: 'Error',
        text: error.response?.statusText,
        icon: 'error',
        background: '#141B2F',
        color: '#FFFFFFCC',
    });
}

export function CatchErrorAlert(error: AxiosError) {
    const data = error.response?.data as { err: string };
    if (data?.err) {
        console.warn(error);
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
export function GoodSignIn() {
    Toast.fire({
        icon: 'success',
        title: 'Signed in successfully',
        background: '#141B2F',
        color: '#FFFFFFCC',
    });
}
