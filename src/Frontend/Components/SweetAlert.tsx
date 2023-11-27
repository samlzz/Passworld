/* eslint-disable no-param-reassign */
import Swal from 'sweetalert2';
import { ErrOfPW } from '../Utils/type';

export function ErrorAlert(text: string) {
    Swal.fire({
        title: 'Error',
        text,
        icon: 'error',
        background: '#141B2F',
        color: '#FFFFFFCC',
    });
}

export function AxiosErrAlert(error: ErrOfPW) {
    if (error.response?.statusText)
        Swal.fire({
            title: 'Error',
            text: error.response.statusText,
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

export function CatchErrorAlert(error: ErrOfPW) {
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

export function ResetResp(
    responseIsTrue: boolean = false,
    validTxt: string = 'Your data is safe :)'
) {
    if (responseIsTrue)
        Swal.fire({
            title: 'Deleted!',
            text: validTxt,
            icon: 'success',
            background: '#111727',
            color: '#FFFFFFCC',
        });
    else
        Swal.fire({
            title: 'Cancelled',
            text: validTxt,
            icon: 'info',
            background: '#111727',
            color: '#FFFFFFCC',
        });
}

export const ResetAlerte = () => {
    return Swal.fire({
        title: 'Are you sure?',
        text: 'All your passwords and your category will be deleted!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#453AE4',
        cancelButtonColor: '#7B2E34',
        confirmButtonText: 'Yes, delete it!',
        background: '#111727',
        color: '#FFFFFFCC',
    });
};
