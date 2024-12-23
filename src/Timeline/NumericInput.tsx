import React, { useCallback, useRef, useState, useEffect } from "react";

interface NumberInputFieldProps {
  defaultValue: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  dataTestId: string;
}
type FocusAction = "select" | "blur" | null;
enum Key {
  UP = "ArrowUp",
  DOWN = "ArrowDown",
  ENTER = "Enter",
  ESC = "Escape",
}

const NumberInputField: React.FC<NumberInputFieldProps> = ({
  defaultValue,
  onChange,
  min,
  max,
  step,
  dataTestId,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const isTyping = useRef<boolean | null>(null);
  const [value, setValue] = useState(defaultValue);
  const [focusAction, setFocusAction] = useState<FocusAction>(null);

  const clampValue = useCallback(
    (val: number) => {
      return Math.min(max, Math.max(min, Math.round(val / step) * step));
    },
    [min, max, step]
  );

  const validateAndApplyChange = useCallback(() => {
    const clampedValue = clampValue(value);
    if (clampedValue !== value) {
      setValue(clampedValue);
    }
    if (clampedValue !== defaultValue) {
      onChange(clampedValue);
    }
  }, [value]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = Number(e.target.value) || defaultValue;
      setValue(newValue);
      if (isTyping.current !== null && !isTyping.current) {
        onChange(newValue);
      }
    },
    [onChange]
  );

  const handleClick = useCallback(() => {
    isTyping.current = false;
    setFocusAction("select");
  }, []);

  const handleFocus = useCallback(() => {
    setFocusAction("select");
  }, []);

  const handleBlur = useCallback(() => {
    isTyping.current = false;
    validateAndApplyChange();
  }, [validateAndApplyChange]);

  const onHandleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        case Key.UP: {
          const incrementedValue = clampValue(value + step);
          onChange(incrementedValue);
          setFocusAction("select");
          break;
        }
        case Key.DOWN: {
          const decrementedValue = clampValue(value - step);
          onChange(decrementedValue);
          setFocusAction("select");
          break;
        }
        case Key.ENTER: {
          setFocusAction("blur");
          break;
        }
        case Key.ESC: {
          setValue(defaultValue);
          setFocusAction("blur");
          break;
        }
        default: {
          isTyping.current = true;
          break;
        }
      }
    },
    [clampValue, value, step, defaultValue, onChange]
  );

  useEffect(() => {
    if (defaultValue !== value) {
      setValue(defaultValue);
    }
  }, [defaultValue]);

  useEffect(() => {
    if (focusAction === "select") {
      inputRef.current?.select();
      setFocusAction(null);
    } else if (focusAction === "blur") {
      inputRef.current?.blur();
      setFocusAction(null);
    }
  }, [focusAction, value]);

  return (
    <input
      ref={inputRef}
      type="number"
      data-testid={dataTestId}
      className="bg-gray-700 px-1 rounded"
      min={min}
      max={max}
      step={step}
      value={value.toString()}
      onChange={handleInputChange}
      onClick={handleClick}
      onKeyDown={onHandleKeyDown}
      onFocus={handleFocus}
      onBlur={handleBlur}
    />
  );
};

export default NumberInputField;
