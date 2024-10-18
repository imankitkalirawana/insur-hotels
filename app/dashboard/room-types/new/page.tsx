'use client';

import { Icon } from '@iconify/react/dist/iconify.js';
import { Button, Input } from '@nextui-org/react';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import slugify from 'slugify';
import { toast } from 'sonner';

export default function Page() {
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      name: '',
      ridPreview: ''
    },
    onSubmit: async (values) => {
      try {
        await fetch(`/api/rooms/type`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values)
        }).then(() => {
          toast.success('Room type added successfully');
          router.push('/dashboard/room-types');
        });
      } catch (error) {
        console.error(error);
        toast.error('Something went wrong');
      }
    }
  });
  return (
    <>
      <div>
        <form onSubmit={formik.handleSubmit} className="mt-6">
          <dl>
            <div className="mt-4 px-4 sm:px-0">
              <h3 className="text-base font-semibold leading-7 text-gray-900">
                Add New Room Type
              </h3>
              <p className="max-w-2xl text-sm leading-6 text-gray-500">
                Add a new room type to your hotel.
              </p>
            </div>
          </dl>
          <dl>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Room Type</dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                <Input
                  name="name"
                  value={formik.values.name}
                  onChange={(e) => {
                    formik.setFieldValue('name', e.target.value);
                    formik.setFieldValue(
                      'ridPreview',
                      slugify(e.target.value.toLowerCase())
                    );
                  }}
                  placeholder="eg: Luxury, Deluxe, Standard"
                  isInvalid={
                    formik.touched.name && formik.errors.name ? true : false
                  }
                  errorMessage={formik.errors.name}
                  description={
                    <>
                      {formik.values.ridPreview && (
                        <span>
                          Room ID: <b>{formik.values.ridPreview}</b>. It cannot
                          be changed later.
                        </span>
                      )}
                    </>
                  }
                />
              </dd>
            </div>
          </dl>
          <div className="flex items-center justify-end py-4">
            <Button
              type="submit"
              color="primary"
              endContent={<Icon icon="tabler:check" />}
              isLoading={formik.isSubmitting}
            >
              Add Type
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
