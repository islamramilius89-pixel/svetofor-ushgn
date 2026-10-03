import { useState } from 'react'
import {
  useDeleteWellMutation,
  useNgdusQuery,
  useSaveWellMutation,
  useWellsQuery,
} from '@/interactions/wells'
import type { Well, WellFormInput } from '@/layers/domain/wells/well'
import { fieldErrorsOf, generalErrorOf } from '@/layers/use-cases/forms/submit-form'
import { useDebouncedCallback } from './use-debounced-callback'

const ADMIN_PAGE_SIZE = 20

type Editor = { mode: 'create' } | { mode: 'edit'; well: Well } | null

const emptyForm: WellFormInput = { number: '', ngduId: '', deviation: '', note: '' }

/** Управление скважинами в админке: поиск, создание, редактирование и удаление. */
export function useAdminWellsFlow() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [editor, setEditor] = useState<Editor>(null)
  const [form, setForm] = useState<WellFormInput>(emptyForm)
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)

  const wellsQuery = useWellsQuery({ search: search || undefined, sort: 'number', page, pageSize: ADMIN_PAGE_SIZE })
  const ngdusQuery = useNgdusQuery()
  const saveMutation = useSaveWellMutation()
  const deleteMutation = useDeleteWellMutation()

  const changeSearch = useDebouncedCallback((value: string) => {
    setSearch(value.trim())
    setPage(1)
  })

  function openCreate() {
    saveMutation.reset()
    setForm(emptyForm)
    setEditor({ mode: 'create' })
  }

  function openEdit(well: Well) {
    saveMutation.reset()
    setForm({ number: well.number, ngduId: well.ngdu.id, deviation: well.deviation, note: well.note })
    setEditor({ mode: 'edit', well })
  }

  function updateField<K extends keyof WellFormInput>(field: K, value: WellFormInput[K]) {
    setForm((current) => ({ ...current, [field]: value }))
    if (saveMutation.isError) saveMutation.reset()
  }

  function save() {
    const id = editor?.mode === 'edit' ? editor.well.id : undefined
    saveMutation.mutate({ input: form, id }, { onSuccess: () => setEditor(null) })
  }

  function confirmDelete(id: number) {
    deleteMutation.mutate(id, { onSuccess: () => setConfirmDeleteId(null) })
  }

  return {
    changeSearch,
    page,
    setPage,
    pageSize: ADMIN_PAGE_SIZE,
    wells: wellsQuery.data,
    isLoading: wellsQuery.isPending,
    error: wellsQuery.error?.message ?? null,
    retry: () => void wellsQuery.refetch(),
    ngdus: ngdusQuery.data ?? [],

    editor,
    openCreate,
    openEdit,
    closeEditor: () => setEditor(null),
    form,
    updateField,
    save,
    isSaving: saveMutation.isPending,
    fieldErrors: fieldErrorsOf(saveMutation.error),
    saveError: generalErrorOf(saveMutation.error),

    confirmDeleteId,
    askDelete: setConfirmDeleteId,
    cancelDelete: () => setConfirmDeleteId(null),
    confirmDelete,
    deletingId: deleteMutation.isPending ? deleteMutation.variables : undefined,
    deleteError: deleteMutation.error?.message ?? null,
  }
}

export type AdminWellsFlow = ReturnType<typeof useAdminWellsFlow>
