import { Hotel } from '@/lib/interface';
import {
  Button,
  Link,
  Input,
  DatePicker,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Progress
} from '@nextui-org/react';
import { IconX, IconPencil, IconPlus } from '@tabler/icons-react';
import { useFormik } from 'formik';
import { Icon } from '@iconify/react/dist/iconify.js';
import { toast } from 'sonner';
import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { PHOTOMAXSIZE } from '@/lib/config';

interface Props {
  hotel: Hotel;
}

export default function Gallery({ hotel }: Props) {
  const [stepCount, setStepCount] = React.useState(0);
  const [progressMessage, setProgressMessage] = React.useState('');
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      gallery: hotel.gallery
    },
    onSubmit: async (values) => {
      try {
        if (values.gallery.length > 0) {
          setProgressMessage('Uploading files...');
          for (let i = 0; i < values.gallery.length; i++) {
            if (values.gallery[i].preview) {
              let filename = `hotels/${hotel.slug}/gallery/gallery-${i}.${values.gallery[i].file?.name.split('.').pop()}`;
              const previousFilename = `${values.gallery[i].src.split('amazonaws.com/')[1]}`;
              const formData = new FormData();
              formData.append('file', values.gallery[i].file);
              formData.append('filename', filename);
              await fetch(`/api/s3-upload`, {
                method: 'DELETE',
                body: JSON.stringify({ filename: previousFilename })
              });
              await fetch(`/api/s3-upload`, {
                method: 'POST',
                body: formData
              }).then(async (res) => {
                const data = await res.json();
                values.gallery[i].src = data.url;
                setStepCount((prev) => prev + 1);
              });
            }
          }
        }
        await fetch(`/api/hotels/id/${hotel._id}`, {
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

  console.log(formik.values.gallery);

  const handleAddItem = () => {
    formik.setFieldValue('gallery', [
      ...formik.values.gallery,
      {
        src: '',
        file: new File([''], '', { type: 'image/jpeg' }),
        preview: ''
      }
    ]);
  };

  const handleDeleteItem = async (index: number) => {
    const updatedItem = formik.values.gallery.filter((_, i) => i !== index);
    formik.setFieldValue('gallery', updatedItem);
    // Remove the image from the storage
    if (formik.values.gallery[index].src) {
      const filename =
        formik.values.gallery[index].src.split('amazonaws.com/')[1];
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
            Gallary
          </h3>
          <p className="max-w-2xl text-sm leading-6 text-gray-500">
            Manage photo gallery for {hotel.name}
          </p>
        </div>
        <form onSubmit={formik.handleSubmit} className="mt-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
            {formik.values.gallery.map((item, index) => (
              <div key={index} className="group relative flex flex-col">
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
                <div className="relative w-full rounded-2xl bg-default">
                  <input
                    id={`gallery-photo-${index}`}
                    name={`gallery-photo-${index}`}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const selectedFile: File = e.target.files[0];
                        if (selectedFile.size > PHOTOMAXSIZE) {
                          toast.error(`Image size should be less than 1MB`);
                          return;
                        }
                        const reader = new FileReader();
                        reader.onload = () => {
                          const imageData = reader.result as string;
                          formik.setFieldValue(
                            `gallery[${index}].file`,
                            selectedFile
                          );
                          formik.setFieldValue(
                            `gallery[${index}].preview`,
                            imageData
                          );
                        };
                        reader.readAsDataURL(selectedFile);
                      }
                    }}
                  />
                  {formik.values.gallery[index].src ||
                  formik.values.gallery[index].preview ? (
                    <>
                      <Image
                        src={
                          formik.values.gallery[index].preview
                            ? formik.values.gallery[index].preview
                            : item.src
                        }
                        className="aspect-video w-full rounded-2xl object-cover"
                        alt="gallery"
                        width={200}
                        height={200}
                      />
                      <label
                        htmlFor={`gallery-photo-${index}`}
                        className="absolute inset-0 z-10 flex h-full w-full items-center justify-center rounded-2xl opacity-0 transition-all hover:bg-black/30 hover:opacity-100"
                      >
                        <IconPencil size={36} className="text-white" />
                      </label>
                    </>
                  ) : (
                    <label
                      htmlFor={`gallery-photo-${index}`}
                      className="inset-0 z-10 flex aspect-[5/2] w-full items-center justify-center rounded-2xl border border-dashed border-default bg-white transition-all"
                    >
                      <Link as={'span'}>Select an image</Link>
                    </label>
                  )}
                </div>
              </div>
            ))}
            {formik.values.gallery.length < 15 && (
              <div className="relative flex h-full min-h-40 w-full flex-col rounded-2xl border border-dashed border-default-500">
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
                  formik.values.gallery.filter((item) => item.preview).length
                }
                className="mb-4"
              />
              <p>
                {progressMessage} {stepCount}/
                {formik.values.gallery.filter((item) => item.preview).length}
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
