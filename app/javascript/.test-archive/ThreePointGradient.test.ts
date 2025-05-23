import { fireEvent, render, screen } from '@testing-library/svelte';

import ThreePointGradient from '@components/sidebar/ThreePointGradient.svelte';
import { mapRange, threePointGradientState } from '@store';

const mapMin = 100;
const mapMax = 1000;
const defaultSeverityLevels = 5;
const defaultSeverityRows = defaultSeverityLevels * 2 - 1;

let userMinInput;
let userMiddleMinInput;
let userMiddleMaxInput;
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
    threePointGradientState.set({} as any);

    render(ThreePointGradient);

    userMinInput = screen.getByTestId('userMinInput');
    userMiddleMinInput = screen.getByTestId('userMiddleMinInput');
    userMiddleMaxInput = screen.getByTestId('userMiddleMaxInput');
    userMaxInput = screen.getByTestId('userMaxInput');
    addButton = screen.getByTestId('addButton');
    minusButton = screen.getByTestId('minusButton');
    updateButton = screen.getByTestId('updateButton');
    resetButton = screen.getByTestId('resetButton');
  });

  describe('sets up initial state', () => {
    test('defaults to 5 severity levels', () => {
      expect(screen.getAllByTestId('severity-row').length).toEqual(defaultSeverityRows);
    });

    test('starts with buttons enabled', () => {
      expect(addButton.disabled).toEqual(false);
      expect(updateButton.disabled).toEqual(false);
      expect(resetButton.disabled).toEqual(false);
      expect(minusButton.disabled).toEqual(false);
    });

    test('sets initial input values based on map range', () => {
      const x = (mapMax - mapMin) / defaultSeverityRows;
      expect(userMinInput.value).toEqual(`${to_tenths(mapMin + x)}`);
      expect(userMiddleMinInput.value).toEqual(`${to_tenths((mapMin + mapMax) / 2 - x / 2)}`);
      expect(userMiddleMaxInput.value).toEqual(`${to_tenths((mapMin + mapMax) / 2 + x / 2)}`);
      expect(userMaxInput.value).toEqual(`${to_tenths(mapMax - x)}`);
    });

    test('generates intermediate values divided between min and middle min', async () => {
      const min = Number(userMinInput.value);
      const middleMin = Number(userMiddleMinInput.value);
      const x = (middleMin - min) / (defaultSeverityLevels - 2);
      expect(screen.queryAllByTestId('severity-row')[1].textContent).toEqual(
        ` ${min} - ${to_tenths(min + x)}`,
      );
      expect(screen.queryAllByTestId('severity-row')[2].textContent).toEqual(
        ` ${min + x} - ${to_tenths(min + x * 2)}`,
      );
    });

    test('generates intermediate values divided between middle max and max', async () => {
      const middleMax = Number(userMiddleMaxInput.value);
      const max = Number(userMaxInput.value);
      const x = to_tenths((max - middleMax) / (defaultSeverityLevels - 2));
      expect(screen.queryAllByTestId('severity-row')[defaultSeverityRows - 3].textContent).toEqual(
        ` ${max - x * 2} - ${max - x}`,
      );
      expect(screen.queryAllByTestId('severity-row')[defaultSeverityRows - 2].textContent).toEqual(
        ` ${max - x} - ${max}`,
      );
    });
  });

  describe('can change severity levels', () => {
    test('adds and decrements severity levels', async () => {
      await fireEvent.click(addButton);
      await fireEvent.click(addButton);
      expect(screen.queryAllByTestId('severity-row').length).toEqual(defaultSeverityRows + 4);
      await fireEvent.click(minusButton);
      await fireEvent.click(minusButton);
      expect(screen.queryAllByTestId('severity-row').length).toEqual(defaultSeverityRows);
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
      const min = Number(userMinInput.value);
      const middleMin = Number(userMiddleMinInput.value);
      const x = to_tenths((middleMin - min) / (defaultSeverityLevels - 2));
      expect(screen.queryAllByTestId('severity-row')[1].textContent).toEqual(
        ` ${min} - ${min + x}`,
      );

      await fireEvent.click(addButton);
      const newSeverityLevels = defaultSeverityLevels + 1;
      const y = to_tenths((middleMin - min) / (newSeverityLevels - 2));
      expect(screen.queryAllByTestId('severity-row')[1].textContent).toEqual(
        ` ${min} - ${min + y}`,
      );
    });
  });

  describe('validates user values', () => {
    test('disables buttons when min is less than zero', async () => {
      const newMin = -1;
      await fireEvent.change(userMinInput, { target: { value: newMin } });
      expect(userMinInput.validationMessage).toBeTruthy;
      expect(userMiddleMinInput.validationMessage).toBeFalsy;
      expect(userMiddleMaxInput.validationMessage).toBeFalsy;
      expect(userMaxInput.validationMessage).toBeFalsy;
      expect(updateButton.disabled).toEqual(true);
      expect(screen.getByTestId('validation-msg').innerHTML).toEqual(
        'Minimum value must be greater than zero.',
      );
    });

    test('disables buttons when min is greater than middle min', async () => {
      const newMin = Number(userMiddleMinInput.value) + 1;
      await fireEvent.change(userMinInput, { target: { value: newMin } });
      expect(userMinInput.validationMessage).toBeTruthy;
      expect(userMiddleMinInput.validationMessage).toBeTruthy;
      expect(userMiddleMaxInput.validationMessage).toBeFalsy;
      expect(userMaxInput.validationMessage).toBeFalsy;
      expect(updateButton.disabled).toEqual(true);
      expect(screen.getByTestId('validation-msg').innerHTML).toEqual(
        'All values must be in ascending order.',
      );
    });

    test('disables buttons when middle min is less than the min', async () => {
      const newMiddleMin = Number(userMinInput.value) - 1;
      await fireEvent.change(userMiddleMinInput, { target: { value: newMiddleMin } });
      expect(userMinInput.validationMessage).toBeTruthy;
      expect(userMiddleMinInput.validationMessage).toBeTruthy;
      expect(userMiddleMaxInput.validationMessage).toBeFalsy;
      expect(userMaxInput.validationMessage).toBeFalsy;
      expect(updateButton.disabled).toEqual(true);
      expect(screen.getByTestId('validation-msg').innerHTML).toEqual(
        'All values must be in ascending order.',
      );
    });

    test('disables buttons when middle min is greater than the middle max', async () => {
      const newMiddleMin = Number(userMiddleMaxInput.value) + 1;
      await fireEvent.change(userMiddleMinInput, { target: { value: newMiddleMin } });
      expect(userMinInput.validationMessage).toBeFalsy;
      expect(userMiddleMinInput.validationMessage).toBeTruthy;
      expect(userMiddleMaxInput.validationMessage).toBeTruthy;
      expect(userMaxInput.validationMessage).toBeFalsy;
      expect(updateButton.disabled).toEqual(true);
      expect(screen.getByTestId('validation-msg').innerHTML).toEqual(
        'All values must be in ascending order.',
      );
    });

    test('disables buttons when middle max is greater than the max', async () => {
      const newMiddleMax = Number(userMaxInput.value) + 1;
      await fireEvent.change(userMiddleMaxInput, { target: { value: newMiddleMax } });
      expect(userMinInput.validationMessage).toEqual('');
      expect(userMiddleMinInput.validationMessage).toEqual('');
      expect(userMiddleMaxInput.validationMessage).toBeTruthy;
      expect(userMaxInput.validationMessage).toBeTruthy;
      expect(updateButton.disabled).toEqual(true);
      expect(screen.getByTestId('validation-msg').innerHTML).toEqual(
        'All values must be in ascending order.',
      );
    });
  });

  describe('updates intermediate values when inputs change', () => {
    test('updates intermediate values when min changes', async () => {
      const min = Number(userMinInput.value);
      const middleMin = Number(userMiddleMinInput.value);
      const x = to_tenths((middleMin - min) / (defaultSeverityLevels - 2));
      expect(screen.queryAllByTestId('severity-row')[1].textContent).toEqual(
        ` ${min} - ${min + x}`,
      );

      const newMin = min - 100;
      await fireEvent.change(userMinInput, { target: { value: newMin } });
      const y = to_tenths((middleMin - newMin) / (defaultSeverityLevels - 2));
      expect(screen.queryAllByTestId('severity-row')[1].textContent).toEqual(
        ` ${newMin} - ${newMin + y}`,
      );
    });

    test('updates intermediate values when middle min changes', async () => {
      const min = Number(userMinInput.value);
      const middleMin = Number(userMiddleMinInput.value);
      const x = to_tenths((middleMin - min) / (defaultSeverityLevels - 2));
      expect(screen.queryAllByTestId('severity-row')[1].textContent).toEqual(
        ` ${min} - ${min + x}`,
      );

      const newMiddleMin = middleMin - 100;
      await fireEvent.change(userMiddleMinInput, { target: { value: newMiddleMin } });
      const y = to_tenths((newMiddleMin - min) / (defaultSeverityLevels - 2));
      expect(screen.queryAllByTestId('severity-row')[1].textContent).toEqual(
        ` ${min} - ${min + y}`,
      );
    });

    test('updates intermediate values when middle max changes', async () => {
      const middleMax = Number(userMiddleMaxInput.value);
      const max = Number(userMaxInput.value);
      const x = to_tenths((max - middleMax) / (defaultSeverityLevels - 2));
      expect(screen.queryAllByTestId('severity-row')[defaultSeverityRows - 2].textContent).toEqual(
        ` ${max - x} - ${max}`,
      );

      const newMiddleMax = middleMax + 150;
      await fireEvent.change(userMiddleMaxInput, { target: { value: newMiddleMax } });
      const y = to_tenths((max - newMiddleMax) / (defaultSeverityLevels - 2));
      expect(screen.queryAllByTestId('severity-row')[defaultSeverityRows - 2].textContent).toEqual(
        ` ${max - y} - ${max}`,
      );
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
  const severityLevels = 6;
  const userValues = [250, 350, 450, 550];

  beforeEach(() => {
    mapRange.set({ min: mapMin, max: mapMax });
    threePointGradientState.set({
      severityLevels: severityLevels,
      userValues: userValues,
      mapMin: mapMin,
      mapMax: mapMax,
    } as any);

    render(ThreePointGradient);

    userMinInput = screen.getByTestId('userMinInput');
    userMiddleMinInput = screen.getByTestId('userMiddleMinInput');
    userMiddleMaxInput = screen.getByTestId('userMiddleMaxInput');
    userMaxInput = screen.getByTestId('userMaxInput');
  });

  test('saves state', () => {
    expect(userMinInput.value).toEqual(userValues[0].toString());
    expect(userMiddleMinInput.value).toEqual(userValues[1].toString());
    expect(userMiddleMaxInput.value).toEqual(userValues[2].toString());
    expect(userMaxInput.value).toEqual(userValues[3].toString());
    expect(screen.queryAllByTestId('severity-row').length).toEqual(defaultSeverityRows + 2);
  });
});
