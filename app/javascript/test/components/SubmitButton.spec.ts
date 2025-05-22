import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import Button from '@components/common/SubmitButton.svelte';

describe('Button', () => {
  it('renders with default text', async () => {
    render(Button, { props: { click: vi.fn() } });
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Submit');
  });

  it('renders with custom text', async () => {
    render(Button, {
      props: {
        click: vi.fn(),
        text: 'Save',
      },
    });
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Save');
  });

  it('sets title attribute', async () => {
    render(Button, {
      props: {
        click: vi.fn(),
        title: 'Save Changes',
      },
    });
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('title', 'Save Changes');
  });

  it('uses text as title if title is not provided', async () => {
    render(Button, {
      props: {
        click: vi.fn(),
        text: 'Cancel',
      },
    });
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('title', 'Cancel');
  });

  it('calls the click handler when clicked', async () => {
    const handleClick = vi.fn();
    render(Button, { props: { click: handleClick } });
    const button = screen.getByRole('button');

    await fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('sets the disabled attribute when disabled prop is true', async () => {
    render(Button, {
      props: {
        click: vi.fn(),
        disabled: true,
      },
    });
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('does not call click handler when disabled', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(Button, {
      props: {
        click: handleClick,
        disabled: true,
      },
    });

    const button = screen.getByRole('button');
    await user.click(button);

    // Click handler shouldn't be called on a disabled button
    expect(handleClick).not.toHaveBeenCalled();
  });
});
