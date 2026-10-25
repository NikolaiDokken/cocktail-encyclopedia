"use client";

import { useState, useTransition, type FormEvent } from "react";

// Like useActionState, but keeps the typed values after a failed submit:
// React resets forms that submit through the `action` prop.
export function useFormSubmit(
  submit: (formData: FormData) => Promise<string | undefined>,
) {
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isPending, startTransition] = useTransition();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isPending) return;
    const formData = new FormData(event.currentTarget);
    startTransition(async () => {
      const message = await submit(formData);
      startTransition(() => setErrorMessage(message));
    });
  }

  return { errorMessage, onSubmit, isPending };
}
