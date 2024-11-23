import { Fetch } from "fetch";
import { Json } from "json";
import { Notification } from "../Notification";
import { PromiseUtils } from "../PromiseUtils";

type ApiError = {
  title: string;
  message: string;
};

const apiErrorTitle = (error: ApiError): string => {
  switch (error.title) {
    case "UnexpectedResponse":
      return error.message;
    default:
      return "An unexpected error occurred";
  }
};

const acceptOrRejectResponse = (response: Response): Promise<Json> => {
  if (response.ok || response.status === 422) {
    return response.json();
  } else {
    return Promise.reject({
      title: "UnexpectedResponse",
      message: response.status.toString(),
    });
  }
};

const handleResponseError = (error: ApiError): void => {
  const title = apiErrorTitle(error);
  Notification.error(
    title,
    "Our team has been notified of this error. Please reload the page and try again."
  );
};

const handleResponseJSON = (
  json: Json,
  responseCB: (json: Json) => void,
  errorCB: () => void,
  notify: boolean
): void => {
  const error = json.error;
  if (error) {
    if (notify) {
      Notification.error("Something went wrong!", error);
    }
    errorCB();
  } else {
    responseCB(json);
  }
};

const handleResponse = (
  responseCB: (json: Json) => void,
  errorCB: () => void,
  notify: boolean = true,
  promise: Promise<Response>
): void => {
  promise
    .then((response) => acceptOrRejectResponse(response))
    .then((json) => handleResponseJSON(json, responseCB, errorCB, notify))
    .catch((error) => {
      errorCB();
      console.log(error);
      if (notify) {
        handleResponseError(error);
      }
    });
};

const sendPayload = (
  url: string,
  payload: Record<string, any>,
  responseCB: (json: Json) => void,
  errorCB: () => void,
  method: string
): void => {
  const requestInit: RequestInit = {
    method: method,
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
  };
  const promise = fetch(url, requestInit);
  handleResponse(responseCB, errorCB, true, promise);
};

const sendFormData = (
  url: string,
  formData: FormData,
  responseCB: (json: Json) => void,
  errorCB: () => void
): void => {
  const requestInit: RequestInit = {
    method: "POST",
    body: formData,
    credentials: "same-origin",
  };
  const promise = fetch(url, requestInit);
  handleResponse(responseCB, errorCB, true, promise);
};

const get = (
  url: string,
  responseCB: (json: Json) => void,
  errorCB: () => void
): void => {
  const promise = fetch(url);
  handleResponse(responseCB, errorCB, true, promise);
};

const create = (
  url: string,
  payload: Record<string, any>,
  responseCB: (json: Json) => void,
  errorCB: () => void
): void => {
  sendPayload(url, payload, responseCB, errorCB, "POST");
};

const update = (
  url: string,
  payload: Record<string, any>,
  responseCB: (json: Json) => void,
  errorCB: () => void
): void => {
  sendPayload(url, payload, responseCB, errorCB, "PATCH");
};

const getWithToken = (
  url: string,
  token: string,
  responseCB: (json: Json) => void,
  errorCB: () => void
): void => {
  const requestInit: RequestInit = {
    method: "GET",
    headers: {
      authorization: `Bearer ${token}`,
    },
    credentials: "same-origin",
  };
  const promise = fetch(url, requestInit);
  handleResponse(responseCB, errorCB, true, promise);
};

export { get, create, update, getWithToken, sendFormData };
