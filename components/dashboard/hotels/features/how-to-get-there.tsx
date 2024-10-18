import React from 'react';
import { Hotel } from '@/lib/interface';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Button, Input, Textarea } from '@nextui-org/react';
import { useFormik } from 'formik';
import { toast } from 'sonner';

interface Props {
  hotel: Hotel;
}

export default function HowToGetThere({ hotel }: Props) {
  const formik = useFormik({
    initialValues: {
      howToGetThere: hotel.howToGetThere
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

  return (
    <>
      <div>
        <div className="px-4 sm:px-0">
          <h3 className="text-base font-semibold leading-7 text-gray-900">
            How to Get There
          </h3>
        </div>
        <form
          onSubmit={formik.handleSubmit}
          className="mt-6 flex flex-col gap-4"
        >
          <Textarea
            label="Description"
            value={formik.values.howToGetThere?.text}
            onChange={formik.handleChange}
            name="howToGetThere.text"
            // can also use html for formatting
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

          <Input
            label="Google Maps URL"
            value={formik.values.howToGetThere?.location}
            onChange={formik.handleChange}
            name="howToGetThere.location"
          />
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
