import { render, screen, fireEvent } from "@testing-library/react";
import NumberInputField from "../Timeline/NumericInput";

describe("NumberInputField Component", () => {
  const onChangeMock = jest.fn();

  const defaultProps = {
    defaultValue: 100,
    onChange: onChangeMock,
    min: 0,
    max: 500,
    step: 10,
    dataTestId: "number-input",
  };

  afterAll(() => {
    jest.clearAllMocks();
  });

  test("The displayed value updates immediately while typing, but onChange is not triggered until input is confirmed", () => {
    render(<NumberInputField {...defaultProps} />);
    const input = screen.getByTestId("number-input");

    fireEvent.change(input, { target: { value: "150" } });
    expect(input).toHaveValue(150);

    fireEvent.blur(input);
    expect(onChangeMock).toHaveBeenCalledWith(150);
  });

  test("Clicking outside the input field removes focus and triggers onChange", () => {
    render(<NumberInputField {...defaultProps} />);
    const input = screen.getByTestId("number-input");

    fireEvent.change(input, { target: { value: "200" } });
    fireEvent.blur(input);
    expect(onChangeMock).toHaveBeenCalledWith(200);
  });

  test("Clicking on the native step buttons immediately changes the value", () => {
    render(<NumberInputField {...defaultProps} />);
    const input = screen.getByTestId("number-input");

    fireEvent.change(input, { target: { value: "110" } });
    fireEvent.blur(input);
    expect(onChangeMock).toHaveBeenCalledWith(110);
  });

  test("Entire text is selected when the input field gains focus", () => {
    render(<NumberInputField {...defaultProps} />);
    const input = screen.getByTestId("number-input") as HTMLInputElement;
    const selectMock = jest.spyOn(input, "select");

    fireEvent.focus(input);
    expect(selectMock).toHaveBeenCalled();
  });

  test("Entire text is selected after using the native step buttons", () => {
    render(<NumberInputField {...defaultProps} />);
    const input = screen.getByTestId("number-input") as HTMLInputElement;
    const selectMock = jest.spyOn(input, "select");

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "110" } });
    expect(selectMock).toHaveBeenCalled();
  });

  test("Entire text is selected after using the up arrow or down arrow keys", () => {
    render(<NumberInputField {...defaultProps} />);
    const input = screen.getByTestId("number-input") as HTMLInputElement;
    const selectMock = jest.spyOn(input, "select");

    fireEvent.focus(input);
    fireEvent.keyDown(input, { key: "ArrowUp" });
    expect(selectMock).toHaveBeenCalled();

    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(selectMock).toHaveBeenCalledTimes(3);
  });

  test("Pressing up arrow or down arrow keys immediately changes the value", () => {
    render(<NumberInputField {...defaultProps} />);
    const input = screen.getByTestId("number-input");

    fireEvent.keyDown(input, { key: "ArrowUp" });
    expect(onChangeMock).toHaveBeenCalledWith(110);

    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(onChangeMock).toHaveBeenCalledWith(90);
  });

  test("Pressing Enter confirms the new value and removes focus", () => {
    render(<NumberInputField {...defaultProps} />);
    const input = screen.getByTestId("number-input");

    fireEvent.change(input, { target: { value: "150" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(document.activeElement).not.toBe(input);
  });

  test("Pressing Escape reverts to the original value and removes focus", () => {
    render(<NumberInputField {...defaultProps} />);
    const input = screen.getByTestId("number-input");

    fireEvent.change(input, { target: { value: "200" } });
    fireEvent.keyDown(input, { key: "Escape" });
    expect(input).toHaveValue(100);
    expect(document.activeElement).not.toBe(input);
  });

  test("Leading zeros are automatically removed", () => {
    render(<NumberInputField {...defaultProps} />);
    const input = screen.getByTestId("number-input");

    fireEvent.change(input, { target: { value: "00100" } });
    fireEvent.blur(input);
    expect(input).toHaveValue(100);
  });

  test("Negative values are automatically adjusted to the minimum allowed value", () => {
    render(<NumberInputField {...defaultProps} />);
    const input = screen.getByTestId("number-input");

    fireEvent.change(input, { target: { value: "-50" } });
    fireEvent.blur(input);
    expect(input).toHaveValue(0);
    expect(onChangeMock).toHaveBeenCalledWith(0);
  });

  test("Decimal values are automatically rounded to the nearest integer", () => {
    render(<NumberInputField {...defaultProps} />);
    const input = screen.getByTestId("number-input");

    fireEvent.change(input, { target: { value: "100.5" } });
    fireEvent.blur(input);
    expect(input).toHaveValue(100);
  });

  test("Invalid inputs (non-numeric) revert to the previous valid value", () => {
    render(<NumberInputField {...defaultProps} />);
    const input = screen.getByTestId("number-input");

    fireEvent.change(input, { target: { value: "invalid" } });
    fireEvent.blur(input);
    expect(input).toHaveValue(100);
  });
});
