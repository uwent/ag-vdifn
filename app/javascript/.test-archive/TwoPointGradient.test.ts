import { fireEvent, render, screen } from '@testing-library/svelte';

import TwoPointGradient from '@components/sidebar/TwoPointGradient.svelte';
import { mapRange, twoPointGradientState } from '@store';

const mapMin = 300;
const mapMax = 800;
const defaultSeverityLevels = 5;

let userMinInput;
let userMaxInput;
let addButton;
let minusButton;
let updateButton;
let resetButton;

function to_tenths(x: number) {
  return Math.round(x * 10) / 10;
}

describe('without save state', () => {
  beforeEach(() => {
    mapRange.set({ min: mapMin, max: mapMax });
    twoPointGradientState.set({} as any);

    render(TwoPointGradient);

    userMinInput = screen.getByTestId('userMinInput');
    userMaxInput = screen.getByTestId('userMaxInput');
    addButton = screen.getByTestId('addButton');
    minusButton = screen.getByTestId('minusButton');
    updateButton = screen.getByTestId('updateButton');
    resetButton = screen.getByTestId('resetButton');
  });

  describe('sets up in initial state', () => {
    test('defaults to 5 severity levels', () => {
      expect(screen.queryAllByTestId('severity-row').length).toEqual(defaultSeverityLevels);
    });

    test('starts with buttons enabled', () => {
      expect(addButton.disabled).toEqual(false);
      expect(updateButton.disabled).toEqual(false);
      expect(resetButton.disabled).toEqual(false);
      expect(minusButton.disabled).toEqual(false);
    });

    test('sets initial input values based on map range', () => {
      const x = to_tenths((mapMax - mapMin) / defaultSeverityLevels);
      expect(userMinInput.value).toEqual(`${mapMin + x}`);
      expect(userMaxInput.value).toEqual(`${mapMax - x}`);
    });

    test('generates intermediate values divided between userMin and userMax', async () => {
      const userMin = Number(userMinInput.value);
      const userMax = Number(userMaxInput.value);
      const x = to_tenths((userMax - userMin) / (defaultSeverityLevels - 2));
      expect(screen.queryAllByTestId('severity-row')[1].textContent).toEqual(
        ` ${userMin} - ${userMin + x}`,
      );
    });
  });

  describe('can change severity levels', () => {
    test('adds and decrements severity levels', async () => {
      await fireEvent.click(addButton);
      await fireEvent.click(addButton);
      expect(screen.queryAllByTestId('severity-row').length).toEqual(7);
      await fireEvent.click(minusButton);
      await fireEvent.click(minusButton);
      expect(screen.queryAllByTestId('severity-row').length).toEqual(5);
    });

    test('cannot decrement when there are 3 severity levels', async () => {
      await fireEvent.click(minusButton);
      await fireEvent.click(minusButton);
      expect(minusButton.disabled).toEqual(true);
    });

    test('cannot add when there are 8 levels', async () => {
      await fireEvent.click(addButton);
      await fireEvent.click(addButton);
      await fireEvent.click(addButton);
      expect(addButton.disabled).toEqual(true);
    });

    test('updates intermediate values when severity levels change', async () => {
      const userMin = Number(userMinInput.value);
      const userMax = Number(userMaxInput.value);
      const x = to_tenths((userMax - userMin) / (defaultSeverityLevels - 2));
      expect(screen.queryAllByTestId('severity-row')[1].textContent).toEqual(
        ` ${userMin} - ${userMin + x}`,
      );
      await fireEvent.click(addButton);
      const severityLevels = defaultSeverityLevels + 1;
      const y = to_tenths((userMax - userMin) / (severityLevels - 2));
      expect(screen.queryAllByTestId('severity-row')[1].textContent).toEqual(
        ` ${userMin} - ${userMin + y}`,
      );
    });
  });

  describe('validates user min and max values', () => {
    test('disables buttons when min is less than zero', async () => {
      const newMin = -10;
      await fireEvent.change(userMinInput, { target: { value: newMin } });
      expect(userMinInput.validationMessage).toBeTruthy;
      expect(userMaxInput.validationMessage).toBeFalsy;
      expect(updateButton.disabled).toEqual(true);
      expect(screen.getByTestId('validation-msg').innerHTML).toEqual(
        'Minimum must be greater than zero.',
      );
    });

    test('disables buttons when min is greater than max', async () => {
      const newMin = 1000;
      await fireEvent.change(userMinInput, { target: { value: newMin } });
      expect(userMinInput.validationMessage).toBeTruthy;
      expect(userMaxInput.validationMessage).toBeTruthy;
      expect(updateButton.disabled).toEqual(true);
      expect(screen.getByTestId('validation-msg').innerHTML).toEqual(
        'Minimum must be less than maximum. Maximum must be greater than the minimum.',
      );
    });

    test('disables buttons when min is greater than max', async () => {
      const newMax = -10;
      await fireEvent.change(userMaxInput, { target: { value: newMax } });
      expect(userMinInput.validationMessage).toBeTruthy;
      expect(userMaxInput.validationMessage).toBeTruthy;
      expect(updateButton.disabled).toEqual(true);
      expect(screen.getByTestId('validation-msg').innerHTML).toEqual(
        'Minimum must be less than maximum. Maximum must be greater than the minimum.',
      );
    });
  });

  describe('updates intermediate values when user inputs change', () => {
    test('updates intermediate values when userMin is changed', async () => {
      const newMin = 200;
      const userMax = Number(userMaxInput.value);
      await fireEvent.change(userMinInput, { target: { value: newMin } });
      const x = to_tenths((userMax - newMin) / (defaultSeverityLevels - 2));
      expect(screen.queryAllByTestId('severity-row')[1].textContent).toEqual(
        ` ${newMin} - ${newMin + x}`,
      );
    });

    test('updates intermediate values when userMax is changed', async () => {
      const newMax = 1000;
      const userMin = Number(userMinInput.value);
      await fireEvent.change(userMaxInput, { target: { value: newMax } });
      const x = to_tenths((newMax - userMin) / (defaultSeverityLevels - 2));
      expect(
        screen.queryAllByTestId('severity-row')[defaultSeverityLevels - 2].textContent,
      ).toEqual(` ${newMax - x} - ${newMax}`);
    });
  });

  describe('resets user values', () => {
    test('resets values to default when reset is pushed', async () => {
      const oldMax = userMaxInput.value;
      const newMax = 1000;
      await fireEvent.change(userMaxInput, { target: { value: newMax } });
      expect(userMaxInput.value).toEqual(newMax.toString());
      await fireEvent.click(resetButton);
      expect(userMaxInput.value).toEqual(oldMax);
    });
  });
});

describe('saving valid state', () => {
  const severityLevels = 4;
  const userValues = [350, 650];

  beforeEach(() => {
    mapRange.set({ min: mapMin, max: mapMax });
    twoPointGradientState.set({
      severityLevels: severityLevels,
      userValues: userValues,
      mapMax: mapMax,
      mapMin: mapMin,
      gradient: {},
    });

    render(TwoPointGradient);

    userMinInput = screen.getByTestId('userMinInput');
    userMaxInput = screen.getByTestId('userMaxInput');
  });

  test('saves state', () => {
    expect(userMinInput.value).toEqual(userValues[0].toString());
    expect(userMaxInput.value).toEqual(userValues[1].toString());
    expect(screen.queryAllByTestId('severity-row').length).toEqual(severityLevels);
  });
});
