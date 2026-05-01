import { useForm } from '@inertiajs/react';
import { TemplatePicker, getDefaultColumns } from '@/components/boards/template-picker';
import { ListInput } from '@/components/ui/list-input';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { index, store } from '@/routes/boards';
import type { BoardTemplate } from '@/types';

type Props = {
    templates: BoardTemplate[];
};

export function CreateBoardForm({ templates }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        template: 'custom' as BoardTemplate,
        columns: getDefaultColumns('custom'),
    });

    function handleTemplateChange(template: BoardTemplate) {
        setData({ ...data, template, columns: getDefaultColumns(template) });
    }

    function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        post(store.url());
    }

    return (
        <form onSubmit={submit} className="space-y-6">
            <div className="space-y-2">
                <Label>Template</Label>
                <TemplatePicker
                    templates={templates}
                    selected={data.template}
                    onChange={handleTemplateChange}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    value={data.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('name', e.target.value)}
                    placeholder="eg. Sprint 14"
                    autoFocus
                />
                <InputError message={errors.name} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    value={data.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('description', e.target.value)}
                    placeholder="eg. Two week sprint focused on UX and accessibility."
                    rows={4}
                />
                <InputError message={errors.description} />
            </div>

            <div className="space-y-2">
                <Label>Columns</Label>
                <ListInput value={data.columns} onChange={(columns) => setData('columns', columns)} placeholder="Add a column…" />
                <InputError message={errors.columns} />
            </div>

            <div className="flex items-center gap-3">
                <Button variant="outline" asChild>
                    <a href={index.url()}>Cancel</a>
                </Button>
                <Button type="submit" disabled={processing}>
                    Create
                </Button>
            </div>
        </form>
    );
}
