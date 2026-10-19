import TeacherProfilePage from '@/features/teacher/teacher-profile-page'

export default async function TeacherPage({
	params
}: {
	params: Promise<{ id: string }>
}) {
	const { id } = await params

	return <TeacherProfilePage teacherId={id} />
}
