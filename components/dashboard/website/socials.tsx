import { Website } from '@/lib/interface';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Avatar, Button, Input, Link } from '@nextui-org/react';
import { IconPlus } from '@tabler/icons-react';
import { useFormik } from 'formik';
import slugify from 'slugify';
import { toast } from 'sonner';

interface Props {
  website: Website;
}

export default function Socials({ website }: Props) {
  const formik = useFormik({
    initialValues: {
      socials: website.socials
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
      } catch (error) {
        console.error(error);
        toast.error('Something went wrong');
      }
    }
  });

  const handleAddSocial = () => {
    formik.setFieldValue('socials', [
      ...formik.values.socials,
      { name: '', src: '', url: '' }
    ]);
  };

  const handleDeleteSocial = (index: number) => {
    formik.setFieldValue(
      'socials',
      formik.values.socials.filter((_, i) => i !== index)
    );
  };

  return (
    <>
      <div>
        <div className="px-4 sm:px-0">
          <h3 className="text-base font-semibold leading-7 text-gray-900">
            Socials
          </h3>
          <p className="max-w-2xl text-sm leading-6 text-gray-500">
            Update your website socials media links.
          </p>
        </div>
        <form onSubmit={formik.handleSubmit} className="mt-6">
          <div className="flex flex-col gap-4">
            {formik.values.socials.map((item, index) => (
              <div
                key={index}
                className="relative flex items-center gap-2 pt-4"
              >
                <img
                  className="aspect-square size-[40px] rounded-full object-cover"
                  src={`https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${item.url}&size=64`}
                />
                <div className="grid w-full grid-cols-2 gap-2">
                  <Input
                    name={`socials[${index}].name`}
                    value={item.name}
                    onChange={formik.handleChange}
                    label="Name"
                  />
                  <Input
                    name={`socials[${index}].url`}
                    value={item.url}
                    onChange={formik.handleChange}
                    label="URL"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Button
                    variant="flat"
                    as={Link}
                    size="sm"
                    href={item.url}
                    target="_blank"
                  >
                    Visit
                  </Button>
                  <Button
                    variant="flat"
                    color="danger"
                    onClick={() => handleDeleteSocial(index)}
                    size="sm"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
            <div className="relative col-span-full mb-8 flex h-16 w-full flex-col items-center justify-between rounded-2xl border border-dashed border-default-500">
              <Button
                variant="flat"
                color="primary"
                onClick={handleAddSocial}
                isIconOnly
                radius="full"
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform"
              >
                <IconPlus size={24} />
              </Button>
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
