import React from 'react';
import { Hotel } from '@/lib/interface';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Button, Input, Link, Textarea } from '@nextui-org/react';
import { IconPlus, IconX } from '@tabler/icons-react';
import { useFormik } from 'formik';
import { toast } from 'sonner';

interface Props {
  hotel: Hotel;
}

export default function WhenToVisit({ hotel }: Props) {
  const formik = useFormik({
    initialValues: {
      whenToVisit: hotel.whenToVisit
    },
    onSubmit: async (values) => {
      try {
        await fetch(`/api/hotels/id/${hotel._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values)
        });
        toast.success('Hotel updated successfully');
      } catch (error) {
        console.error(error);
        toast.error('Something went wrong');
      }
    }
  });

  const handleAddItem = () => {
    formik.setFieldValue('whenToVisit.timing', [
      ...formik.values.whenToVisit.timing,
      {
        title: '',
        description: ''
      }
    ]);
  };

  const handleDeleteItem = (index: number) => {
    const updatedItem = formik.values.whenToVisit.timing.filter(
      (_, i) => i !== index
    );
    formik.setFieldValue('whenToVisit.timing', updatedItem);
  };

  return (
    <>
      <div>
        <div className="px-4 sm:px-0">
          <h3 className="text-base font-semibold leading-7 text-gray-900">
            When to Visit
          </h3>
          <p className="max-w-2xl text-sm leading-6 text-gray-500">
            When to visit the hotel.
          </p>
        </div>
        <form onSubmit={formik.handleSubmit} className="mt-6">
          <Textarea
            label="Description"
            value={formik.values.whenToVisit.text}
            onChange={formik.handleChange}
            name="whenToVisit.text"
            description={
              <>
                You can use HTML for formatting{' '}
                <a
                  href="https://editorhtmlonline.com"
                  target="_blank"
                  className="underline"
                >
                  Click here to format
                </a>
              </>
            }
          />
          <h3 className="mt-8 text-base font-semibold leading-7 text-gray-900">
            Timings
          </h3>
          <div className="mt-4 grid gap-8 md:grid-cols-2">
            {formik.values.whenToVisit.timing.map((item, index) => (
              <div key={index} className="group relative flex flex-col gap-2">
                <Button
                  variant="flat"
                  color="danger"
                  size="sm"
                  className="absolute -right-2 -top-2 z-50 hidden group-hover:flex"
                  onClick={() => handleDeleteItem(index)}
                  isIconOnly
                  radius="full"
                >
                  <IconX size={18} />
                </Button>
                <Textarea
                  label="Title"
                  value={item.title}
                  onChange={formik.handleChange}
                  name={`whenToVisit.timing[${index}].title`}
                />
                <Textarea
                  label="Description"
                  value={item.description}
                  onChange={formik.handleChange}
                  name={`whenToVisit.timing[${index}].description`}
                />
              </div>
            ))}
            <div className="relative flex min-h-36 w-full flex-col rounded-2xl border border-dashed border-default-500">
              <div className="ga-2 absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 transform flex-col items-center justify-center">
                <Button
                  variant="flat"
                  color="primary"
                  size="lg"
                  onClick={handleAddItem}
                  isIconOnly
                  radius="full"
                >
                  <IconPlus size={24} />
                </Button>
                <Link className="whitespace-nowrap text-center">Add New</Link>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end py-4">
            <Button
              type="submit"
              color="primary"
              endContent={<Icon icon="tabler:check" />}
              isLoading={formik.isSubmitting}
              onPress={() => {
                formik.handleSubmit();
              }}
            >
              Update
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
