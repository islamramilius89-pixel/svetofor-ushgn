import { wellFormSchema, type WellFormInput } from '@/layers/domain/wells/well'
import { createWell, updateWell } from '@/layers/infrastructure/wells/wells-api'
import { submitForm } from '@/layers/use-cases/forms/submit-form'

/** Создание новой скважины (id не задан) или изменение существующей. */
export function saveWell(input: WellFormInput, id?: number) {
  return submitForm(wellFormSchema, input, (form) => (id ? updateWell(id, form) : createWell(form)))
}
