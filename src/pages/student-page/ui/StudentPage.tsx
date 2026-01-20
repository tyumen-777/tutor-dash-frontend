import { useParams } from "react-router-dom";
import { getStudent } from "../api";
import { useQuery } from "@tanstack/react-query";
import { CommonInfo } from "./parts/CommonInfo";

const Student = () => {
  const { id } = useParams();
  const { data: studentInfo } = useQuery({
    queryKey: ["student", id],
    queryFn: () => getStudent(Number(id)),
  });

  return (
    <div className="pt-2">
      <span className="text-2xl font-bold">
        {studentInfo?.data?.firstName} {studentInfo?.data?.lastName}
      </span>
      <CommonInfo data={studentInfo?.data} />
    </div>
  );
};

export const Component = Student;
