import { PHOTOMAXSIZE } from '@/lib/config';
import { Room } from '@/lib/interface';
import { Icon } from '@iconify/react/dist/iconify.js';
import {
  Button,
  Link,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Progress
} from '@nextui-org/react';
import { IconPencil, IconPlus, IconX } from '@tabler/icons-react';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import React from 'react';
import slugify from 'slugify';
import { toast } from 'sonner';

interface Props {
  room: Room;
}

export default function Images({ room }: Props) {
  const [stepCount, setStepCount] = React.useState(0);
  const [progressMessage, setProgressMessage] = React.useState('');
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      hotelId: room.hotelId,
      title: room.title,
      images: room.images
    },
    onSubmit: async (values) => {
      if (values.images.length > 0) {
        setProgressMessage('Uploading files...');
        for (let i = 0; i < values.images.length; i++) {
          if (values.images[i].preview) {
            let filename = `hotels/${values.hotelId}/rooms/${slugify(values.title, { lower: true })}/room-${new Date().getTime()}.${values.images[i].file?.name.split('.').pop()}`;
            const previousFilename = `${values.images[i].src.split('amazonaws.com/')[1]}`;
            const formData = new FormData();
            formData.append('file', values.images[i].file);
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
              values.images[i].src = data.url;
              setStepCount((prev) => prev + 1);
            });
          }
        }
      }
      await fetch(`/api/rooms/${room._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });
      toast.success('Website updated successfully');
    }
  });

  const handleAddImage = () => {
    formik.setFieldValue('images', [
      ...formik.values.images,
      {
        src: '',
        preview: '',
        file: null
      }
    ]);
  };

  // Handler to delete a testimonial
  const handleDeleteImage = (index: number) => {
    formik.setFieldValue(
      'images',
      formik.values.images.filter((_, i) => i !== index)
    );
    // Remove the image from the storage
    if (formik.values.images[index].src) {
      const previousFilename = `${formik.values.images[index].src.split('amazonaws.com/')[1]}`;
      fetch(`/api/s3-upload`, {
        method: 'DELETE',
        body: JSON.stringify({ filename: previousFilename })
      });
    }
  };
  return (
    <>
      <div>
        <div className="px-4 sm:px-0">
          <h3 className="text-base font-semibold leading-7 text-gray-900">
            Room Images
          </h3>
          <p className="max-w-2xl text-sm leading-6 text-gray-500">
            Upload images of the room
          </p>
        </div>
        <form onSubmit={formik.handleSubmit} className="mt-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
            {formik.values.images.map((item, index) => (
              <div
                key={index}
                className="group relative flex max-w-xs flex-col"
              >
                <Button
                  variant="flat"
                  color="danger"
                  size="sm"
                  className="absolute -right-2 -top-2 z-50 hidden group-hover:flex"
                  onClick={() => handleDeleteImage(index)}
                  isIconOnly
                  radius="full"
                >
                  <IconX size={18} />
                </Button>
                <div className="relative w-full rounded-2xl bg-default">
                  <input
                    id={`image-photo-${index}`}
                    name={`image-photo-${index}`}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const selectedFile: File = e.target.files[0];
                        if (selectedFile.size > PHOTOMAXSIZE) {
                          toast.error('Image size should be less than 1MB');
                          return;
                        }
                        const reader = new FileReader();
                        reader.onload = () => {
                          const imageData = reader.result as string;
                          formik.setFieldValue(
                            `images[${index}].file`,
                            selectedFile
                          );
                          formik.setFieldValue(
                            `images[${index}].preview`,
                            imageData
                          );
                        };
                        reader.readAsDataURL(selectedFile);
                      }
                    }}
                  />
                  {formik.values.images[index].src ||
                  formik.values.images[index].preview ? (
                    <>
                      <Image
                        src={
                          formik.values.images[index].preview
                            ? formik.values.images[index].preview
                            : item.src
                        }
                        className="aspect-square w-full rounded-2xl object-cover"
                        alt="image"
                      />
                      <label
                        htmlFor={`image-photo-${index}`}
                        className="absolute inset-0 z-10 flex h-full w-full items-center justify-center rounded-2xl opacity-0 transition-all hover:bg-black/30 hover:opacity-100"
                      >
                        <IconPencil size={36} className="text-white" />
                      </label>
                    </>
                  ) : (
                    <label
                      htmlFor={`image-photo-${index}`}
                      className="inset-0 z-10 flex aspect-square w-full items-center justify-center rounded-2xl border border-dashed border-default bg-white transition-all"
                    >
                      <Link as={'span'}>Select an image</Link>
                    </label>
                  )}
                </div>
              </div>
            ))}
            {formik.values.images.length < 15 && (
              <div className="relative flex aspect-square w-full max-w-xs flex-col rounded-2xl border border-dashed border-default-500">
                <div className="ga-2 absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 transform flex-col items-center justify-center">
                  <Button
                    variant="flat"
                    color="primary"
                    size="lg"
                    onClick={handleAddImage}
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
                  formik.values.images.filter((item) => item.preview).length
                }
                className="mb-4"
              />
              <p>
                {progressMessage} {stepCount}/
                {formik.values.images.filter((item) => item.preview).length}
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
