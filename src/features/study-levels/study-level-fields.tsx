'use client'

import { Controller, type UseFormReturn } from 'react-hook-form'

import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

import type { StudyLevelFormValues } from './study-level-form-schema'
import { type ApiError, hasMessage } from '@/api/errors'

/**
 * Code and name inputs shared by the create form and the edit dialog.
 */
export function StudyLevelFields({
	form,
	idPrefix
}: {
	form: UseFormReturn<StudyLevelFormValues>
	idPrefix: string
}) {
	return (
		<>
			<Controller
				name='code'
				control={form.control}
				render={({ field, fieldState }) => (
					<Field data-invalid={fieldState.invalid}>
						<FieldLabel htmlFor={`${idPrefix}-code`}>
							Обозначение
						</FieldLabel>
						<Input
							{...field}
							id={`${idPrefix}-code`}
							placeholder='A1'
							maxLength={20}
							autoComplete='off'
							aria-invalid={fieldState.invalid}
							className='h-10'
						/>
						<FieldError errors={[fieldState.error]} />
					</Field>
				)}
			/>
			<Controller
				name='name'
				control={form.control}
				render={({ field, fieldState }) => (
					<Field data-invalid={fieldState.invalid}>
						<FieldLabel htmlFor={`${idPrefix}-name`}>
							Название
						</FieldLabel>
						<Input
							{...field}
							id={`${idPrefix}-name`}
							placeholder='Beginner'
							maxLength={100}
							autoComplete='off'
							aria-invalid={fieldState.invalid}
							className='h-10'
						/>
						<FieldError errors={[fieldState.error]} />
					</Field>
				)}
			/>
		</>
	)
}

/**
 * Puts a backend error on the field it belongs to. Returns false when the
 * caller should show it as a general error.
 */
export function setStudyLevelFieldError(
	form: UseFormReturn<StudyLevelFormValues>,
	error: ApiError
) {
	if (error.status === 409) {
		form.setError('code', {
			message: 'Уровень с таким обозначением уже есть'
		})
		return true
	}

	if (error.status === 400 && hasMessage(error, 'code')) {
		form.setError('code', { message: 'Проверьте обозначение' })
		return true
	}

	if (error.status === 400 && hasMessage(error, 'name')) {
		form.setError('name', { message: 'Проверьте название' })
		return true
	}

	return false
}
