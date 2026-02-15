import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Navigate, Outlet } from "react-router-dom";
import {
  AccessTokenKey,
  RefreshTokenKey,
} from "../constants/Key";
import { ValidateAccount } from "../utils/API";
import { useToast } from "../contexts/ToastContext";

type protectedRouteProps = {
  acceptedRoles: string[];
};

const ProtectedRoute = ({ acceptedRoles }: protectedRouteProps) => {
  const { addToast } = useToast();

  const [isValid, setIsValid] = useState<boolean>();

  useEffect(() => {
    ValidateAccount()
      .then((data) => {
        let roleAccepted = false

        if (data.roles.some(role => acceptedRoles.includes(role))) {
          roleAccepted = true
        }

        if (!roleAccepted) {
          Cookies.remove(AccessTokenKey);
          Cookies.remove(RefreshTokenKey);
        }

        setIsValid(roleAccepted)
      })
      .catch((error: Error) => {
        addToast(`protectedRoute:failedValidateAccount:${Date.now()}`, error.message, false, true, 7000)

        setIsValid(false);
      });
  }, [acceptedRoles]);

  return (
    <>
      {isValid != undefined && (
        <>
          {isValid ? <Outlet></Outlet> : <Navigate to={"/logout"}></Navigate>}
        </>
      )}
    </>
  );
};

export default ProtectedRoute;
