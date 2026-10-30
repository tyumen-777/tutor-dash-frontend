type StudyLevel = { code: string; name: string }

/**
 * "A1 — Beginner"; just the code when the name repeats it (levels moved
 * from the old free-text field have both equal).
 */
export function formatStudyLevel(level: StudyLevel) {
	return level.name === level.code
		? level.code
		: `${level.code} — ${level.name}`
}
