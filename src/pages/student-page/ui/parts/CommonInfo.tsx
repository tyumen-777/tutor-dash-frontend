import { TStudent } from "@/shared/student";
import { Badge } from "@/shared/ui/kit/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/kit/card";
import dayjs from "dayjs";
import { Calendar, Mail, Mars, Phone } from "lucide-react";

type TCommonInfoProps = {
  data?: TStudent;
};


export const CommonInfo = ({ data }: TCommonInfoProps) => {
  return (
    <Card className="border-border bg-card w-fit min-w-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle>Общая информация</CardTitle>
          <Badge className="bg-success text-success-foreground capitalize">
            Активный
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          <div className="flex items-center gap-3 text-sm">
            <Mail className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">Email</span>
            <span className="ml-auto text-card-foreground">{data?.email}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Phone className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">Телефон</span>
            <span className="ml-auto text-card-foreground">{data?.phone}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">Дата рождения</span>
            <span className="ml-auto text-card-foreground">
              {data?.birthDate
                ? dayjs(data.birthDate).format("DD.MM.YYYY")
                : "-"}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Mars className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">Пол</span>
            <span className="ml-auto text-card-foreground">
              {data?.gender === "MALE" ? "Мужской" : "Женский"}
            </span>
          </div>
        </div>
      </CardContent>
      {/* <ItemContent>
        
        <ItemContent>
          <ItemTitle>Статус</ItemTitle>
          <ItemDescription>123</ItemDescription>
        </ItemContent>
        <ItemContent>
          <ItemTitle>Возраст</ItemTitle>
          <ItemDescription>
            {data?.birthDate
              ? `${dayjs(data.birthDate).format("DD.MM.YYYY")} (${dayjs().diff(dayjs(data.birthDate), "year")} лет)`
              : "-"}
          </ItemDescription>
        </ItemContent>
        <ItemContent>
          <ItemTitle>Пол</ItemTitle>
          <ItemDescription>
            {data?.gender === "MALE" ? "Мужской" : "Женский"}
          </ItemDescription>
        </ItemContent>
      </ItemContent>
      <ItemSeparator />
      <ItemContent>
        <ItemHeader>Контакты</ItemHeader>
        <ItemContent>
          <ItemTitle>Email</ItemTitle>
          <ItemDescription>{data?.email}</ItemDescription>
        </ItemContent>
        <ItemContent>
          <ItemTitle>Мобильный телефон</ItemTitle>
          <ItemDescription>{data?.phone}</ItemDescription>
        </ItemContent>
      </ItemContent> */}
    </Card>
  );
};
