import Cookies from "js-cookie";
import {
  MsgRefreshTokenNotFound,
  MsgUnauthorized,
} from "../constants/Messages";
import {
  AccessTokenKey,
  RefreshTokenKey,
} from "../constants/Key";
import type { ILoginRes } from "../interfaces/Account";
import type { IValidatedAccount } from "../interfaces/Token";
import { getDeviceId } from "./DeviceId";

export async function Login(
  email: string,
  password: string
): Promise<ILoginRes> {
  const url = import.meta.env.VITE_AUTH_BASE_URL + "/v1/account/login";
  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Device-Info": import.meta.env.VITE_DEVICE_INFO,
      "X-Device-Id": getDeviceId(),
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  };

  let response: Response;

  try {
    response = await fetch(url, options);
  } catch (error) {
    throw new Error("server is offline");
  }

  const responseData = await response.json();

  if (!response.ok || !responseData.success) {
    throw new Error(`failed to login, ${responseData.message}`);
  }

  const data: ILoginRes = responseData.data;

  Cookies.set(AccessTokenKey, data.access_token.token, {
    expires: new Date(data.access_token.expired_at * 1000),
  });
  Cookies.set(RefreshTokenKey, data.refresh_token.token, {
    expires: new Date(data.refresh_token.expired_at * 1000),
  });

  return data;
}

export async function ValidateAccount(): Promise<IValidatedAccount> {
  const url = import.meta.env.VITE_MAIN_BASE_URL + "/v1/auth/validate-account";

  let accessToken = Cookies.get(AccessTokenKey);

  if (!accessToken) {
    await HandleRefreshToken();

    accessToken = Cookies.get(AccessTokenKey);
  }

  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Device-Info": import.meta.env.VITE_DEVICE_INFO,
      "Authorization": "Bearer " + accessToken,
      "X-Device-Id": getDeviceId(),
    },
  };

  let response: Response;

  try {
    response = await fetch(url, options);
  } catch (error) {
    throw new Error("server is offline");
  }

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message);
  }

  return responseData.data;
}

export async function HandleRefreshToken() {
  const url = import.meta.env.VITE_AUTH_BASE_URL + "/v1/auth/refresh-token";

  const refreshToken = Cookies.get(RefreshTokenKey);

  if (!refreshToken) {
    throw new Error(MsgRefreshTokenNotFound);
  }

  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Device-Info": import.meta.env.VITE_DEVICE_INFO,
      "X-Device-Id": getDeviceId(),
    },
    body: JSON.stringify({
      refresh_token: refreshToken,
    }),
  };

  let response: Response;

  try {
    response = await fetch(url, options);
  } catch (error) {
    throw new Error("server is offline");
  }

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(MsgUnauthorized + ", " + responseData.message);
  }

  const data: ILoginRes = responseData.data;

  Cookies.set(AccessTokenKey, data.access_token.token, {
    expires: new Date(data.access_token.expired_at * 1000),
  });
}

export async function HandleGet<T>(
  url: string,
  withAccessToken?: boolean
): Promise<T> {
  let bearerToken = "";
  let accessToken = Cookies.get(AccessTokenKey);

  if (withAccessToken) {
    if (!accessToken) {
      await HandleRefreshToken();

      accessToken = Cookies.get(AccessTokenKey);
    }

    bearerToken = `Bearer ${accessToken}`;
  }

  const options: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: bearerToken,
      "Device-Info": import.meta.env.VITE_DEVICE_INFO,
      "X-Device-Id": getDeviceId(),
    },
  };

  let response: Response;

  try {
    response = await fetch(url, options);
  } catch (error) {
    throw new Error("server is offline");
  }

  const responseData = await response.json();

  if (!response.ok) {
    console.log(responseData.message);

    if (response.status == 401) {
      throw new Error(MsgUnauthorized);
    }

    throw new Error(`failed to fetch data`);
  }

  return responseData.data;
}

export async function HandlePatch(
  url: string,
  body: string | FormData,
  withAccessToken?: boolean
) {
  let bearerToken = "";
  let accessToken = Cookies.get(AccessTokenKey);

  if (withAccessToken) {
    if (!accessToken) {
      await HandleRefreshToken();

      accessToken = Cookies.get(AccessTokenKey);
    }

    bearerToken = `Bearer ${accessToken}`;
  }

  if (withAccessToken && !accessToken) {
    return;
  }

  const headers: HeadersInit =
    typeof body === "string"
      ? {
        "Content-Type": "application/json",
        Authorization: bearerToken,
      }
      : {
        Authorization: bearerToken,
      };

  const options: RequestInit = {
    method: "PATCH",
    headers: headers,
    body: body,
  };

  let response: Response;

  try {
    response = await fetch(url, options);
  } catch (error) {
    throw new Error("server is offline");
  }

  const responseData = await response.json();

  if (!response.ok) {
    console.log(responseData.message);

    if (response.status == 401) {
      throw new Error(MsgUnauthorized);
    }

    throw new Error(`failed to fetch data`);
  }

  return responseData.data;
}

export async function HandlePost<T>(
  url: string,
  body: string | FormData,
  withAccessToken?: boolean
): Promise<T> {
  let bearerToken = "";
  let accessToken = Cookies.get(AccessTokenKey);

  if (withAccessToken) {
    if (!accessToken) {
      await HandleRefreshToken();

      accessToken = Cookies.get(AccessTokenKey);
    }

    bearerToken = `Bearer ${accessToken}`;
  }

  const headers: HeadersInit =
    typeof body === "string"
      ? {
        "Content-Type": "application/json",
        Authorization: bearerToken,
      }
      : {
        Authorization: bearerToken,
      };

  const options: RequestInit = {
    method: "POST",
    headers: headers,
    body: body,
  };

  let response: Response;

  try {
    response = await fetch(url, options);
  } catch (error) {
    throw new Error("server is offline");
  }

  const responseData = await response.json();

  if (!response.ok) {
    console.log(responseData.message);

    if (response.status == 401) {
      throw new Error(MsgUnauthorized);
    }

    throw new Error(`failed to post data`);
  }

  return responseData.data;
}