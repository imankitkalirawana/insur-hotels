import { Website } from '@/lib/interface';
import { useFormik } from 'formik';
import {
  Button,
  Image,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Progress
} from '@nextui-org/react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { IconPencil, IconTrash, IconPlus, IconX } from '@tabler/icons-react';
import { toast } from 'sonner';
import React from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  website: Website;
}

export default function Testimonials({ website }: Props) {
  const [stepCount, setStepCount] = React.useState(0);
  const [progressMessage, setProgressMessage] = React.useState('');
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      testimonials: website.testimonials
    },
    onSubmit: async (values) => {
      try {
        if (values.testimonials.length > 0) {
          setProgressMessage('Uploading files...');
          for (let i = 0; i < values.testimonials.length; i++) {
            if (values.testimonials[i].preview) {
              let filename = `website/testimonials/testimonial-${i}.${values.testimonials[i].file?.name.split('.').pop()}`;
              const formData = new FormData();
              formData.append('file', values.testimonials[i].file);
              formData.append('filename', filename);
              await fetch(`/api/s3-upload`, {
                method: 'POST',
                body: formData
              }).then(async (res) => {
                const data = await res.json();
                values.testimonials[i].src = data.url;
                setStepCount((prev) => prev + 1);
              });
            }
          }
        }
        await fetch(`/api/website`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values)
        });
        toast.success('Website updated successfully');
      } catch (error) {
        console.error(error);
        toast.error('Something went wrong');
      }
    }
  });

  const handleAddTestimonial = () => {
    formik.setFieldValue('testimonials', [
      ...formik.values.testimonials,
      { name: '', comment: '', src: '' }
    ]);
  };

  const handleDeleteTestimonial = async (index: number) => {
    const updatedTestimonials = formik.values.testimonials.filter(
      (_, i) => i !== index
    );
    formik.setFieldValue('testimonials', updatedTestimonials);
    if (formik.values.testimonials[index].src) {
      const filename =
        formik.values.testimonials[index].src.split('amazonaws.com/')[1];
      await fetch(`/api/s3-upload`, {
        method: 'DELETE',
        body: JSON.stringify({ filename })
      })
        .then(async (res) => {
          const data = await res.json();
          console.log(data);
        })
        .catch((error) => {
          console.error(error);
          toast.error('Something went wrong');
        });
    }
  };

  return (
    <>
      <div>
        <div className="px-4 sm:px-0">
          <h3 className="text-base font-semibold leading-7 text-gray-900">
            Testimonials
          </h3>
          <p className="max-w-2xl text-sm leading-6 text-gray-500">
            Update your website testimonials
          </p>
        </div>
        <form onSubmit={formik.handleSubmit} className="mt-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
            {formik.values.testimonials.map((item, index) => (
              <div
                key={index}
                className="group relative flex max-w-xs flex-col"
              >
                <Button
                  variant="flat"
                  color="danger"
                  size="sm"
                  className="absolute -right-2 -top-2 z-50 hidden group-hover:flex"
                  onClick={() => handleDeleteTestimonial(index)}
                  isIconOnly
                  radius="full"
                >
                  <IconX size={18} />
                </Button>
                <div className="relative w-full rounded-2xl bg-default">
                  <input
                    id={`testimonial-photo-${index}`}
                    name={`testimonial-photo-${index}`}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const selectedFile: File = e.target.files[0];
                        const reader = new FileReader();
                        reader.onload = () => {
                          const imageData = reader.result as string;
                          formik.setFieldValue(
                            `testimonials[${index}].file`,
                            selectedFile
                          );
                          formik.setFieldValue(
                            `testimonials[${index}].preview`,
                            imageData
                          );
                        };
                        reader.readAsDataURL(selectedFile);
                      }
                    }}
                  />
                  {formik.values.testimonials[index].src ||
                  formik.values.testimonials[index].preview ? (
                    <>
                      <Image
                        src={
                          formik.values.testimonials[index].preview
                            ? formik.values.testimonials[index].preview
                            : item.src
                        }
                        className="aspect-square rounded-2xl object-cover"
                        alt="testimonial"
                      />
                      <label
                        htmlFor={`testimonial-photo-${index}`}
                        className="absolute inset-0 z-10 flex h-full w-full items-center justify-center rounded-2xl opacity-0 transition-all hover:bg-black/30 hover:opacity-100"
                      >
                        <IconPencil size={36} className="text-white" />
                      </label>
                    </>
                  ) : (
                    <label
                      htmlFor={`testimonial-photo-${index}`}
                      className="inset-0 z-10 flex aspect-square w-full items-center justify-center rounded-2xl border border-dashed border-default bg-white transition-all"
                    >
                      <Link as={'span'}>Select an image</Link>
                    </label>
                  )}
                </div>
                <div className="mt-4 flex flex-col gap-2">
                  <Input
                    label="Title"
                    value={formik.values.testimonials[index].name}
                    name="name"
                    size="sm"
                    onChange={(e) => {
                      formik.setFieldValue(
                        `testimonials[${index}].name`,
                        e.target.value
                      );
                    }}
                  />
                  <Input
                    label="Description"
                    value={formik.values.testimonials[index].comment}
                    name="comment"
                    onChange={(e) => {
                      formik.setFieldValue(
                        `testimonials[${index}].comment`,
                        e.target.value
                      );
                    }}
                  />
                </div>
              </div>
            ))}
            {formik.values.testimonials.length < 15 && (
              <div className="relative flex aspect-square w-full max-w-xs flex-col rounded-2xl border border-dashed border-default-500">
                <div className="ga-2 absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 transform flex-col items-center justify-center">
                  <Button
                    variant="flat"
                    color="primary"
                    size="lg"
                    onClick={handleAddTestimonial}
                    isIconOnly
                    radius="full"
                  >
                    <IconPlus size={24} />
                  </Button>
                  <Link className="whitespace-nowrap text-center">Add New</Link>
                </div>
              </div>
            )}
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
      <Modal
        backdrop="blur"
        scrollBehavior="inside"
        isOpen={formik.isSubmitting}
        isDismissable={false}
        hideCloseButton
        isKeyboardDismissDisabled={false}
      >
        <ModalContent>
          <>
            <ModalHeader className="flex-col items-center">
              <Icon
                icon="tabler:cloud"
                fontSize={54}
                className="text-primary"
              />
              <h2 className="mt-4 max-w-xs text-center text-base">Uploading</h2>
            </ModalHeader>
            <ModalBody className="items-center text-sm">
              <Progress
                value={
                  (stepCount * 100) /
                  formik.values.testimonials.filter((item) => item.preview)
                    .length
                }
                className="mb-4"
              />
              <p>
                {progressMessage} {stepCount}/
                {
                  formik.values.testimonials.filter((item) => item.preview)
                    .length
                }
              </p>
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                onClick={() => {
                  formik.setSubmitting(false);
                  router.refresh();
                }}
                fullWidth
                variant="bordered"
                className="hidden"
              >
                Cancel
              </Button>
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>
    </>
  );
}
