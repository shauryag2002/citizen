import notify from "./notifier";

const success = (title: string, text: string): void => {
  notify(title, text, "success");
};

const error = (title: string, text: string): void => {
  notify(title, text, "error");
};

const notice = (title: string, text: string): void => {
  notify(title, text, "notice");
};

export { success, error, notice };
