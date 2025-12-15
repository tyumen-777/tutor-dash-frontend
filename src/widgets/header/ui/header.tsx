import { APP_ROUTES } from "@/shared/model/routes";
import { Link } from "react-router-dom";

export const Header = () => {
  
  return (
    <header className="shadow-md py-3 px-4 bg-light-green rounded-md my-2 sticky top-0 z-20">
      <div>
        <Link to={APP_ROUTES.HOME}>
        <span className="font-bold text-2xl uppercase tracking-wider">Tutor Dash</span>
        </Link>
      </div>
    </header>
  );
};
