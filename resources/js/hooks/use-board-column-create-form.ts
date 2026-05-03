import { useForm } from '@inertiajs/react';

export function useBoardColumnCreateForm() {
    return useForm({
        name: '',
    });
}
