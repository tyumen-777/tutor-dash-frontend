import { TStudent } from "@/shared/student";
import dayjs from "dayjs";

type TCommonInfoProps = {
  data?: TStudent;
};

export const CommonInfo = ({ data }: TCommonInfoProps) => {
  return (
    <div className="flex flex-col gap-2 border-light-grey border-1 w-fit rounded-md p-2 shadow-sm">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg bg-light-grey px-1 rounded-md">
          Общая информация
        </h2>
        <span className="text-sm">Статус</span>
        <div className="flex flex-col">
          <span className="text-sm">Возраст</span>
          <span className="text-md">
            {data?.birthDate
              ? `${dayjs(data.birthDate).format("DD.MM.YYYY")} (${dayjs().diff(dayjs(data.birthDate), "year")} лет)`
              : "-"}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm">Пол</span>
          <span className="text-md">
            {data?.gender === "MALE" ? "Мужской" : "Женский"}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <h2 className="text-lg bg-light-grey px-1 rounded-md">Контакты</h2>
        <div className="flex flex-col">
          <span className="text-sm">Email</span>
          <span className="text-md">{data?.email}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm">Мобильный телефон</span>
          <span className="text-md">{data?.phone}</span>
        </div>
      </div>
    </div>
  );
};
