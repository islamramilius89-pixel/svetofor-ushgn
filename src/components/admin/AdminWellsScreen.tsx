'use client'

import type { FormEvent } from 'react'
import { Button } from '@/common/ui/Button'
import { Card } from '@/common/ui/Card'
import { Dialog } from '@/common/ui/Dialog'
import { FormError, SelectField, TextAreaField, TextField } from '@/common/ui/FormFields'
import { Pagination } from '@/common/ui/Pagination'
import { EmptyState, ErrorState, LoadingState } from '@/common/ui/QueryState'
import { useAdminWellsFlow, type AdminWellsFlow } from '@/flows/use-admin-wells-flow'
import { statusFromDeviation } from '@/layers/domain/wells/well'
import { WellStatusBadge } from '@/components/wells/WellStatusBadge'

export function AdminWellsScreen() {
  const flow = useAdminWellsFlow()

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <label className="flex-1 min-w-48 max-w-sm">
          <span className="block text-sm font-semibold text-gray-700 mb-1">Поиск по номеру</span>
          <input
            type="search"
            onChange={(event) => flow.changeSearch(event.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:border-blue-600"
          />
        </label>
        <Button onClick={flow.openCreate}>+ Добавить скважину</Button>
      </div>

      {flow.deleteError && (
        <p role="alert" className="text-red-600">
          {flow.deleteError}
        </p>
      )}

      <Card>
        <WellsTable flow={flow} />
      </Card>

      <Dialog
        open={flow.editor !== null}
        onClose={flow.closeEditor}
        title={flow.editor?.mode === 'edit' ? `Скважина № ${flow.editor.well.number}` : 'Новая скважина'}
      >
        <WellForm flow={flow} />
      </Dialog>
    </>
  )
}

function WellsTable({ flow }: { flow: AdminWellsFlow }) {
  if (flow.isLoading) return <LoadingState />
  if (flow.error) return <ErrorState message={flow.error} onRetry={flow.retry} />
  if (!flow.wells || flow.wells.items.length === 0) return <EmptyState>Скважин не найдено.</EmptyState>

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="text-sm text-gray-500 border-b">
            <tr>
              <th className="py-2 pr-4">Номер</th>
              <th className="py-2 pr-4">НГДУ</th>
              <th className="py-2 pr-4">Отклонение</th>
              <th className="py-2 pr-4">Статус</th>
              <th className="py-2 text-right">Действия</th>
            </tr>
          </thead>
          <tbody>
            {flow.wells.items.map((well) => (
              <tr key={well.id} className="border-b last:border-0">
                <td className="py-3 pr-4 font-semibold">№ {well.number}</td>
                <td className="py-3 pr-4">{well.ngdu.name}</td>
                <td className="py-3 pr-4 tabular-nums">{well.deviation}%</td>
                <td className="py-3 pr-4">
                  <WellStatusBadge status={well.status} />
                </td>
                <td className="py-3 text-right whitespace-nowrap">
                  {flow.confirmDeleteId === well.id ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="text-sm text-red-700">Удалить вместе с заявками?</span>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => flow.confirmDelete(well.id)}
                        disabled={flow.deletingId === well.id}
                      >
                        Да
                      </Button>
                      <Button variant="secondary" size="sm" onClick={flow.cancelDelete}>
                        Нет
                      </Button>
                    </span>
                  ) : (
                    <span className="inline-flex gap-2">
                      <Button variant="secondary" size="sm" onClick={() => flow.openEdit(well)}>
                        Изменить
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => flow.askDelete(well.id)}>
                        Удалить
                      </Button>
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination page={flow.page} pageSize={flow.pageSize} total={flow.wells.total} onChange={flow.setPage} />
    </div>
  )
}

function WellForm({ flow }: { flow: AdminWellsFlow }) {
  const deviation = Number(flow.form.deviation)
  const previewStatus = flow.form.deviation !== '' && Number.isFinite(deviation) ? statusFromDeviation(deviation) : null

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    flow.save()
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextField
          label="Номер"
          value={flow.form.number}
          onChange={(event) => flow.updateField('number', event.target.value)}
          error={flow.fieldErrors.number}
          inputMode="numeric"
          autoFocus
        />
        <SelectField
          label="НГДУ"
          value={flow.form.ngduId}
          onChange={(event) => flow.updateField('ngduId', event.target.value)}
          error={flow.fieldErrors.ngduId}
          options={[{ value: '', label: 'Выберите НГДУ' }, ...flow.ngdus.map((ngdu) => ({ value: ngdu.id, label: ngdu.name }))]}
        />
      </div>
      <TextField
        label="Отклонение тока, %"
        type="number"
        step="0.1"
        min={0}
        max={100}
        value={flow.form.deviation}
        onChange={(event) => flow.updateField('deviation', event.target.value)}
        error={flow.fieldErrors.deviation}
        hint="Статус рассчитается автоматически"
      />
      {previewStatus && (
        <p className="flex items-center gap-2 text-gray-700">
          Статус после сохранения: <WellStatusBadge status={previewStatus} />
        </p>
      )}
      <TextAreaField
        label="Заметка"
        value={flow.form.note}
        onChange={(event) => flow.updateField('note', event.target.value)}
        error={flow.fieldErrors.note}
        rows={3}
      />
      <FormError message={flow.saveError} />
      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={flow.closeEditor}>
          Отмена
        </Button>
        <Button type="submit" disabled={flow.isSaving}>
          {flow.isSaving ? 'Сохраняем…' : 'Сохранить'}
        </Button>
      </div>
    </form>
  )
}
