import { Website } from '@/lib/interface';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Button, Textarea } from '@nextui-org/react';
import { useFormik } from 'formik';
import { toast } from 'sonner';

interface Props {
  website: Website;
}

export default function About({ website }: Props) {
  const formik = useFormik({
    initialValues: {
      about: website.about
    },
    onSubmit: async (values) => {
      try {
        await fetch(`/api/website`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values)
        }).then(() => {
          toast.success('Hotel updated successfully');
        });
      } catch (e) {
        console.error(e);
        toast.error('Something went wrong');
      }
    }
  });
  return (
    <>
      <div>
        <div className="px-4 sm:px-0">
          <h3 className="text-base font-semibold leading-7 text-gray-900">
            About
          </h3>
          <p className="max-w-2xl text-sm leading-6 text-gray-500">
            Update your website about section.
          </p>
        </div>
        <form onSubmit={formik.handleSubmit} className="mt-6">
          <div className="flex flex-col items-center justify-center gap-4 py-4">
            <Textarea
              name="about.shortDescription"
              value={formik.values.about.shortDescription}
              onChange={formik.handleChange}
              variant="bordered"
              label="Short Description"
              description="This will be displayed on the homepage. You can also use HTML."
            />
            <Textarea
              name="about.longDescription"
              value={formik.values.about.longDescription}
              onChange={formik.handleChange}
              variant="bordered"
              label="Long Description"
              description="This will be displayed on the about page. You can also use HTML."
            />
          </div>
          <div className="flex w-full items-center justify-end py-4">
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
