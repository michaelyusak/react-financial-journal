import React, { useState, type FormEvent } from "react";
import Input from "./Input";
import type { IInputField } from "../interfaces/InputField";

type FormProps = {
  inputFields: IInputField[];
  submitButtonText: string;
  onSubmit: (inputValues: {
    [key: string]: { value: string; error: string; file?: File };
  }) => void;
};

const Form = ({
  inputFields,
  submitButtonText,
  onSubmit,
}: FormProps): React.ReactElement => {
  const [inputValues, setInputValues] = useState<{
    [key: string]: { value: string; error: string; file?: File };
  }>({});

  const [disableSubmit, setDisableSubmit] = useState<boolean>(true);

  function handleSetInputValues(
    key: string,
    value: string,
    error: string,
    file?: File
  ) {
    setInputValues((prevInputValues) => {
      const updatedValue = {
        ...prevInputValues,
        [key]: { value, error, file },
      };
      handleSetDisableSubmit(updatedValue);

      return updatedValue;
    });
  }

  function handleSetDisableSubmit(value: {
    [key: string]: { value: string; error: string; file?: File };
  }) {
    let allClear = true;

    inputFields.forEach((inputField) => {
      if (!value[inputField.name]) {
        allClear = false;
      }

      if (value[inputField.name]?.error != "") {
        allClear = false;
      }
    });

    setDisableSubmit(!allClear);
  }

  function handleInputOnChange(
    key: string,
    value: string,
    error: string,
    file?: File
  ) {
    handleSetInputValues(key, value, error, file);
  }

  function handleOnSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    onSubmit(inputValues);
  }

  return (
    <>
      <form
        className="flex flex-col gap-1.25 w-full"
        onSubmit={(e) => handleOnSubmit(e)}
      >
        {inputFields.map((inputField) => (
          <Input
            key={inputField.name}
            inputField={inputField}
            value={inputValues[inputField.name]?.value}
            isError={inputValues[inputField.name]?.error.length > 0}
            onChange={(value, error, file) =>
              handleInputOnChange(inputField.name, value, error, file)
            }
          ></Input>
        ))}

        <div className={`h-15`}>
          {inputFields.map(
            (inputField) =>
              inputField.name != "confirmPassword" &&
              inputValues[inputField.name]?.error.length > 0 && (
                <p
                  key={inputField.name}
                  className="text-[14px] font-medium leading-5"
                >
                  <strong className="text-danger font-semibold">*</strong>
                  {inputValues[inputField.name]?.error}
                </p>
              )
          )}
        </div>
        <button
          className="bg-blue-primary cursor-pointer text-neutral-bg font-semibold outline-0 border-0 w-27.5 h-8.25 rounded-[10px] disabled:opacity-65"
          disabled={disableSubmit}
        >
          {submitButtonText}
        </button>
      </form>
    </>
  );
};

export default Form;
