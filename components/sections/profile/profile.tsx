/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
// import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'
'use client';

import { Button, Input, Textarea } from '@nextui-org/react';
import { useFormik } from 'formik';

export default function Example() {
  const formik = useFormik({
    initialValues: {},
    onSubmit: async (values) => {}
  });
  return (
    <form className="mx-auto max-w-6xl p-4" onSubmit={formik.handleSubmit}>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7">
            Personal Information
          </h2>
          <p className="mt-1 text-sm leading-6">
            Use a permanent address where you can receive mail.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <Input
                label="Name"
                name="name"
                type="text"
                autoComplete="given-name"
                labelPlacement="outside"
                placeholder="John Doe"
                variant="bordered"
              />
            </div>

            <div className="sm:col-span-3">
              <Input
                label="Email Address"
                name="email"
                type="text"
                autoComplete="email"
                labelPlacement="outside"
                placeholder="john@example.com"
                variant="bordered"
                isDisabled={true}
              />
            </div>
            <div className="sm:col-span-3">
              <Input
                label="Email Address"
                name="email"
                type="text"
                autoComplete="email"
                labelPlacement="outside"
                placeholder="john@example.com"
                variant="bordered"
                isDisabled={true}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <Button>Cancel</Button>
        <Button type="submit" color="primary" isLoading={formik.isSubmitting}>
          Save
        </Button>
      </div>
    </form>
  );
}
