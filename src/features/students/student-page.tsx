import { type Student, columns } from './columns'
import { DataTable } from './data-table'

async function getData(): Promise<Student[]> {
	return [
		{
			id: 'student-001',
			fullName: 'Анна Смирнова',
			age: 12,
			teacher: 'Мария Иванова',
			level: 'Elementary'
		},
		{
			id: 'student-002',
			fullName: 'Михаил Кузнецов',
			age: 15,
			teacher: 'Алексей Петров',
			level: 'Pre-Intermediate'
		},
		{
			id: 'student-003',
			fullName: 'София Орлова',
			age: 10,
			teacher: 'Мария Иванова',
			level: 'Beginner'
		},
		{
			id: 'student-004',
			fullName: 'Даниил Волков',
			age: 17,
			teacher: 'Екатерина Соколова',
			level: 'Intermediate'
		}
	]
}

export default async function StudentPage() {
	const data = await getData()

	return (
		<div className='container mx-auto py-10'>
			<DataTable columns={columns} data={data} />
		</div>
	)
}
