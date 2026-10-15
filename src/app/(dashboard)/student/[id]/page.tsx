import StudentProfilePage from '@/features/student/student-profile-page'

export default async function StudentPage({
	params
}: {
	params: Promise<{ id: string }>
}) {
	const { id } = await params

	return <StudentProfilePage studentId={id} />
}
