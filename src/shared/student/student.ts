export type TStudent = {
    id: number;
    firstName: string;
    lastName: string;
    phone: string;
    birthDate: Date;
    email: string;
    gender: "MALE" | "FEMALE";
    studentsInfo: TStudentInfo;
    role: "STUDENT";
  };

  export type TStudentInfo = {
    languageLevel: string;
    teacherId: number
  }